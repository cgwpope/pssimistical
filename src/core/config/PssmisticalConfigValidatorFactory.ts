import {IPssimisticalTable, IPssimisticalColumn, IPssimisticalInput, IPssimisticalReader} from './IPssimisticalConfig'
import {IPssimisticalConfigValidator} from './IPssimisticalConfigValidator'
import {IPssimisticalConfig} from './IPssimisticalConfig';
import {IPssimisticalConfigWrapper} from './IPssimisticalConfigWrapper';
import {PssimisticalLoaderFactory} from '../input/PssimisticalLoaderFactory'


import schema from './PssimisticalConfigSchema'

var Validator = require('jsonschema').Validator;


export class PssministicalConfigValidatorFactory {
    buildConfigValidator(): IPssimisticalConfigValidator {
        return new DefaultPssmisiticalConfigValidator();
    }
}


class DefaultPssmisiticalConfigValidator implements IPssimisticalConfigValidator {
    //TODO: Possible to incorporate into schema? 
    //TODO: Specific to alaSQL. Maybe data store needs to validate config as well?

    //These are alaSQL keywords (source; https://github.com/agershun/alasql/wiki/AlaSQL-Keywords)

    private keywords: string[] = [
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




    validateConfig(config: IPssimisticalConfig, onSchemaError: (validationResult) => void, onSemanticError: (message: string) => void): IPssimisticalConfigWrapper {

        var v = new Validator();
        let validationResult = v.validate(config, JSON.parse(schema));
        if (!validationResult.valid) {
            onSchemaError(validationResult);
            return;
        } else {
            //TODO: More semantic checks:
            //Input: table must be defined

            //TODO: move this check to json-schema, it is possible to implement there.
            ///verify no columsn or table names have key keywords as names



            config.tables.forEach((table) => {

                //columns that have keywords
                let violatingColumns: IPssimisticalColumn[] = table.columns.filter(
                    (column) => this.keywords.filter(
                        keyword => keyword.toLowerCase() == column.name.toLowerCase()
                    ).length > 0);

                if (violatingColumns.length > 0) {

                    let message: string = violatingColumns.reduce(
                        (message, column, index) => message += (index == 0 ? "" : ", ") + column,
                        "The following columns of table " + table.name + " have invalid names (SQL keyword): ");
                    onSemanticError(message);
                    return;
                }


                if (this.keywords.filter((keyword) => table.name.toLowerCase() === keyword).length > 0) {
                    onSemanticError("Table " + table.name + " has invalid name (SQL keyword)");
                    return;
                }
            });



            //verify no table name appears more than once
            let tableCounts = config.tables.reduce((counts, table) => {
                counts[table.name.toLowerCase()]++;
                return counts;
            }, {});

            for (let key in tableCounts) {
                if (tableCounts[key] > 1) {
                    onSemanticError("Table " + key + " is defined more than once");
                    return;
                }
            }


            //verify no table has a column defined more than once
            config.tables.forEach(table => {
                let columnCounts: any = table.columns.reduce((counts, column) => {
                    counts[column.name.toLowerCase()]++;
                    return counts;

                }, {});

                for (let key in columnCounts) {
                    if (columnCounts[key] > 1) {
                        onSemanticError("Column " + key + " is defined more than one in table " + table.name);
                        return;
                    }
                }
            });


            //validate readers
            //readers are valid in two ways. Either:
            //reference a reader defined in the config file, or
            //reference the name of a built-in reader
            let violatingInputs: IPssimisticalInput[] = config.inputs.filter((input) => {
                //find any inputs with readers that are not built-in or do not contain a definition in this config
                return (
                    PssimisticalLoaderFactory.readerNames.filter(readerName => readerName.toLowerCase() === input.reader.toLowerCase()).length > 0 ||
                    !config.readers[input.reader]);
            });
            if (violatingInputs.length > 0) {
                onSemanticError(
                    violatingInputs.reduce(
                        (message, input, index) => message + (index > 0 ? ", " : "") + input.reader,
                        "The following readers referenced in inputs are undefined: ")
                );
                return;
            }

            for (let readerName in config.readers) {
                if (PssimisticalLoaderFactory.readerTypes.filter(readerType => readerType.toLowerCase() === config.readers[readerName].type.toLowerCase()).length == 0) {
                    onSemanticError(
                        "Reader " + readerName + " refernces undefined reader type " + config.readers[readerName].type);
                    return;
                }
            }


            //check for input that references non-existant table
            violatingInputs = config.inputs.filter((input) =>
                config.tables.filter(table => table.name.toLowerCase() === input.table.toLowerCase()).length == 0
            );
            if (violatingInputs.length > 0) {
                onSemanticError("Input references undefined table " + violatingInputs[0].table);
                return;
            }


            //TODO: check for input that references non-existant reader
            return new DefaultPssimisticalConfigWrapper(config);
        }

    }
}


class DefaultPssimisticalConfigWrapper implements IPssimisticalConfigWrapper {

    constructor(private _config: IPssimisticalConfig) {
        if (!this._config) {
            //TODO: Type of error
            throw new Error();
        }
    }

    getConfig(): IPssimisticalConfig {
        return this._config;
    }

    getColumnsForTable(tableName: string): IPssimisticalColumn[] {
        let tables: IPssimisticalTable[] = this._config.tables.filter(table => table.name.toLowerCase() === tableName.toLowerCase());
        if (tables.length == 0 || tables.length > 1) {
            //TODO: exception typing
            throw new Error();
        } else {
            return tables[0].columns;
        }
    }


    getTypeForColumn(tableName: string, columnName: string): string {
        let columns: IPssimisticalColumn[] = this.getColumnsForTable(tableName).filter(column => column.name.toLowerCase() === columnName.toLowerCase());
        if (columns.length == 0 || columns.length > 1) {
            //TODO: exception typing
            throw new Error();
        } else {
            return columns[0].type;
        }
    }

    getTableForName(tableName: string): IPssimisticalTable {
        let tables: IPssimisticalTable[] = this._config.tables.filter(table => table.name.toLowerCase() === tableName.toLowerCase());
        if (tables.length > 0) {
            return tables[0];
        } else {
            //TODO: Error typing
            throw new Error();
        }
    }
}

