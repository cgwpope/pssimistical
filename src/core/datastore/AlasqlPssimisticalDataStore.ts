import {IPssimisticalDataStore} from './IPssimisticalDataStore'
import {IPssmisiticalTableDataStore} from './IPssmisiticalTableDataStore'
import {IPssimisticalConfigWrapper} from '../config/IPssimisticalConfigWrapper'
import {IPssimisticalTable, IPssimisticalColumn} from '../config/IPssimisticalConfig'




export class AlasqlPssimisticalDataStore implements IPssimisticalDataStore {

    private _alasql;

    constructor(private _config: IPssimisticalConfigWrapper) {
        this._alasql = require('alasql');
    }

    init() {
        //build some helper data structures
        //dict {table name} => set of columns
        let tables = {};


        //create the tables
        this._config.getConfig().tables.forEach((table) => {
            //reduce column list to table definition
            let columnsDefinition = "(" + table.columns.reduce((value: string, column: IPssimisticalColumn, index: number) => {
                return value + (index > 0 ? ", " : "") + column.name + " " + column.type + " ";
            }, "") + ")";
            this.runSQL("CREATE TABLE " + table.name + " " + columnsDefinition)


            let columns: string[] = [];

            table.columns.filter((column: IPssimisticalColumn) => {
                //add each column
                columns.push(column.name.toLowerCase());
                return !!column.index;
            }).forEach((column: IPssimisticalColumn) => {
                //create indexes for each index column
                this.runSQL("CREATE INDEX ON " + table.name + " ( " + column.name + ")");
            });

            tables[table.name.toLowerCase()] = columns;
        });

    }

    runSQL(sql: string) {
        console.log("Running SQL: " + sql);
        this._alasql(sql);
    }

    runQuery(query: string) {

        //TODO: Handle results
        this.runSQL(query);
    }

    getTableTableStore(table: IPssimisticalTable): IPssmisiticalTableDataStore {//  throws NoSuchTable
        return new AlasqlPssimisticalTableDataStore(this, table);
    }

}


class AlasqlPssimisticalTableDataStore implements IPssmisiticalTableDataStore {

    constructor(private  _datastore: AlasqlPssimisticalDataStore, private _table: IPssimisticalTable) {

    }

    addRecord(record: any) {
        
        //insertable columns are the keys of the record dict
        let insertableColumns: string[] = [];
        
        for(let column of this._table.columns){
            if(record[column.name.toLowerCase()]){
                insertableColumns.push(column.name.toLowerCase());
            }
        }
        
        let sql: string = "INSERT INTO " + this._table.name + " ( " +
            insertableColumns.reduce((columnList, columnName, index) => columnList + (index > 0 ? "," : "") + columnName, "")
            + ") VALUES (" +
            //TODO: Handle column types.
            insertableColumns.reduce((columnList, columnName, index) => {
                let type: string; "";

                return columnList + (index > 0 ? "," : "") + "'" + record[columnName] + "'";
            }, "")
            + ")";


        this._datastore.runSQL(sql);

    }
}

