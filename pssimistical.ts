import argparse = require("argparse");
import fs = require('fs');
import {IPssimisticalConfig, IPssimisticalTable, IPssimisticalColumn} from './config';
var alasql = require('alasql');
var Validator = require('jsonschema').Validator;
var csv = require('csv');
var parse = require('csv-parse');
var transform = require('stream-transform');


var ArgumentParser = argparse.ArgumentParser;
var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Argparse example'
});


interface IPssimisticalReader {

    //ensure there is an intersection between read columns and target table columns
    getColumns(): string[];

    read(filepath: string, rowRead: (row: any) => void, done: () => void);

}


class PssPatientFileReader implements IPssimisticalReader {
    getColumns(): string[] {
        return [
            "name",
            "Sex",
            "Age",
            "Birthdate",
            "doctor_name",
            "id",
            "Health_Num",
            "City",
            "Address",
            "Phone_Number",
            "Status",
            "Last_Billed_date"]
    }

    read(filepath, rowRead: (row: any) => void, done: () => void) {
        var parser = parse({ delimiter: ',' });
        var input = fs.createReadStream(filepath);
        var transformer = transform((record, callback) => {
            let transfromedRow = {};
            for (let i = 0; i < this.getColumns().length; i++) {
                transfromedRow[this.getColumns()[i].toLowerCase()] = record[i];
            }
            rowRead(transfromedRow);
        }, { parallel: 10 }); //not ssure how well alasql will handle parallel inserts
        input.pipe(parser).pipe(transformer);


        //TODO: handle async error

        parser.on('finish', function () {
            done();
        });
    }
}

const readers = {
    "pss_patients_export": new PssPatientFileReader()
};


//TODO: Possible to incorporate into schema?
//These are alaSQL keywords (source; https://github.com/agershun/alasql/wiki/AlaSQL-Keywords)

const keywords: string[] = [
    "ABSOLUTE",
    "ACTION",
    "ADD",
    "AGGR",
    "ALL",
    "ALTER",
    "AND",
    "ANTI",
    "ANY",
    "APPLY",
    "ARRAY",
    "AS",
    "ASSERT",
    "ASC",
    "ATTACH",
    "AUTOINCREMENT",
    "AUTO_INCREMENT",
    "AVG",
    "BEGIN",
    "BETWEEN",
    "BREAK",
    "BY",
    "CALL",
    "CASE",
    "CAST",
    "CHECK",
    "CLASS",
    "CLOSE",
    "COLLATE",
    "COLUMN",
    "COLUMNS",
    "COMMIT",
    "CONSTRAINT",
    "CONTENT",
    "CONTINUE",
    "CONVERT",
    "CORRESPONDING",
    "COUNT",
    "CREATE",
    "CROSS",
    "CUBE",
    "CURRENT_TIMESTAMP",
    "CURSOR",
    "DATABASE",
    "DECLARE",
    "DEFAULT",
    "DELETE",
    "DELETED",
    "DESC",
    "DETACH",
    "DISTINCT",
    "DOUBLEPRECISION",
    "DROP",
    "ECHO",
    "EDGE",
    "END",
    "ENUM",
    "ELSE",
    "EXCEPT",
    "EXISTS",
    "EXPLAIN",
    "FALSE",
    "FETCH",
    "FIRST",
    "FOREIGN",
    "FROM",
    "GO",
    "GRAPH",
    "GROUP",
    "GROUPING",
    "HAVING",
    "HELP",
    "IF",
    "IDENTITY",
    "IS",
    "IN",
    "INDEX",
    "INNER",
    "INSERT",
    "INSERTED",
    "INTERSECT",
    "INTO",
    "JOIN",
    "KEY",
    "LAST",
    "LET",
    "LEFT",
    "LIKE",
    "LIMIT",
    "LOOP",
    "MATCHED",
    "MATRIX",
    "MAX",
    "MERGE",
    "MIN",
    "MINUS",
    "MODIFY",
    "NATURAL",
    "NEXT",
    "NEW",
    "NOCASE",
    "NO",
    "NOT",
    "NULL",
    "OFF",
    "ON",
    "ONLY",
    "OFFSET",
    "OPEN",
    "OPTION",
    "OR",
    "ORDER",
    "OUTER",
    "OVER",
    "PATH",
    "PARTITION",
    "PERCENT",
    "PLAN",
    "PRIMARY",
    "PRINT",
    "PRIOR",
    "QUERY",
    "READ",
    "RECORDSET",
    "REDUCE",
    "REFERENCES",
    "RELATIVE",
    "REMOVE",
    "RENAME",
    "REQUIRE",
    "RESTORE",
    "RETURN",
    "RETURNS",
    "RIGHT",
    "ROLLBACK",
    "ROLLUP",
    "ROW",
    "SCHEMA(S)?",
    "SEARCH",
    "SELECT",
    "SEMI",
    "SET",
    "SETS",
    "SHOW",
    "SOME",
    "SOURCE",
    "STRATEGY",
    "STORE",
    "SUM",
    "TABLE",
    "TABLES",
    "TARGET",
    "TEMP",
    "TEMPORARY",
    "TEXTSTRING",
    "THEN",
    "TIMEOUT",
    "TO",
    "TOP",
    "TRAN",
    "TRANSACTION",
    "TRIGGER",
    "TRUE",
    "TRUNCATE",
    "UNION",
    "UNIQUE",
    "UPDATE",
    "USE",
    "USING",
    "VALUE",
    "VERTEX",
    "VIEW",
    "WHEN",
    "WHERE",
    "WHILE",
    "WITH",
    "WORK"
];



parser.addArgument(
    ['-f', '--config-file'],
    {
        help: 'Path to the pssimistical configuration file to use',
        required: true
    }
);

var args = parser.parseArgs();
console.log("Confile file path: " + args.config_file);



if (fs.existsSync(args.config_file)) {

    //TODO: Safely do this by reading into the buffer and setting a maximu size
    let config: IPssimisticalConfig = <IPssimisticalConfig>JSON.parse(fs.readFileSync(args.config_file, { encoding: 'utf8' }));

    let schema = JSON.parse(fs.readFileSync("pssimistical.schema.json", { encoding: 'utf8' }));

    var v = new Validator();
    console.log(v.validate(config, schema));


    //TODO: More semantic checks:
    //No duplicate tables
    //Input: table must be defined

    //TODO: move this check to json-schema, it is possible to implement there.
    ///verify no columsn or table names have key keywords as names



    config.tables.forEach((table) => {

        let violatingColumns: IPssimisticalColumn[] = table.columns.filter((column) => !!keywords.find((keyword) => column.name.toLowerCase() === keyword));
        if (violatingColumns.length > 0) {
            console.log("The following columns of table " + table.name + " have invalid names (SQL keyword)");
            violatingColumns.forEach(column => console.log(column.name));
            process.exit();
        }


        if (keywords.filter((keyword) => table.name.toLowerCase() === keyword).length > 0) {
            console.log("Table " + table.name + " has invalid name (SQL keyword)");
            process.exit();
        }
    });



    //verify no table name appears more than once
    config.tables.reduce((counts, table) => {
        if (counts[table.name.toLowerCase()] > 0) {
            console.log("Table " + table.name + " cannot be defined more than once");
            process.exit();
        }

        counts[table.name.toLowerCase()] = 1;

        return counts;
    }, {});





    //verify no table has a column defined more than once
    config.tables.forEach(table => {
        table.columns.reduce((counts, column) => {
            if (counts[column.name.toLowerCase()] > 0) {
                console.log("Column " + column.name + " in table " + table.name + " cannot be defined more than once");
                process.exit();
            }

            counts[column.name.toLowerCase()]++;

            return counts;
        }, {});
    });


    //build some helper data structures
    //dict {table name} => set of columns
    let tables = {};


    //create the tables
    config.tables.forEach((table) => {
        //reduce column list to table definition
        let columnsDefinition = "(" + table.columns.reduce((value: string, column: IPssimisticalColumn, index: number) => {
            return value + (index > 0 ? ", " : "") + column.name + " " + column.type + " ";
        }, "") + ")";
        runSQL("CREATE TABLE " + table.name + " " + columnsDefinition)


        let columns = new Set<string>();

        table.columns.filter((column: IPssimisticalColumn) => {
            //add each column
            columns.add(column.name.toLowerCase());
            return !!column.index;
        }).forEach((column: IPssimisticalColumn) => {
            //create indexes for each index column
            runSQL("CREATE INDEX ON " + table.name + " ( " + column.name + ")");
        });

        tables[table.name.toLowerCase()] = columns;
    });





    //OK, let's read some data
    config.inputs.forEach(input => {
        let reader: IPssimisticalReader = readers[input.reader];
        let readerColumns: Set<string> = new Set(reader.getColumns());
        let tableColumns: Set<string> = <Set<string>>tables[input.table];
        let insertableColumns: Set<string> = new Set<string>([...readerColumns].map(x => x.toLowerCase()).filter(x => tableColumns.has(x)));

        console.log("insertable " + insertableColumns);

        //TODO; check for non-emtpy intersection of column names
        if (reader) {


            reader.read(input.path, (row) => {
                let sql: string = "INSERT INTO " + input.table + " ( " +
                    [...insertableColumns].reduce((columnList, columnName, index) => columnList + (index > 0 ? "," : "") + columnName, "")
                    + ") VALUES (" +
                    //TODO: Handle column type`
                    [...insertableColumns].reduce((columnList, columnName, index) => {
                        let type: string; "";

                        return columnList + (index > 0 ? "," : "") + "'" + row[columnName] + "'";
                    }, "")
                    + ")";

                runSQL(sql);
            }, () => {
                //import is done. let's run a query!
                if(config.query){
                    runSQL(config.query);
                } else {
                    console.log("Done import, no query!");
                }
            });

        } else {
            console.log("Invalid reader:" + input.reader + " - skipping");
        }

        console.log("read");


    });

} else {
    console.log("file does not exists");
}


function runSQL(sql: string) {
    console.log("Running: " + sql);
    alasql(sql);
}

