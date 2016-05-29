import {IPssimisticalDataStore} from './IPssimisticalDataStore'
import {IPssmisiticalTableDataStore} from './IPssmisiticalTableDataStore'
import {IPssimisticalConfigWrapper} from '../config/IPssimisticalConfigWrapper'
import {IPssimisticalTable, IPssimisticalColumn} from '../config/IPssimisticalConfig'
import {Promise} from 'es6-promise';




export class AlasqlPssimisticalDataStore implements IPssimisticalDataStore {

    private _alasql;

    constructor(private _config: IPssimisticalConfigWrapper) {
        this._alasql = require('alasql');
    }

    init(): Promise<void> {
        let promises: Promise<void>[] = [];

        this._config.getConfig().tables.forEach((table) => {
            //reduce column list to table definition

            promises.push(new Promise<void>((resolve, reject) => {
                let columnsDefinition = "(" + table.columns.reduce((value: string, column: IPssimisticalColumn, index: number) => {
                    return value + (index > 0 ? ", " : "") + column.name + " " + column.type + " ";
                }, "") + ")";
                this.runModify("CREATE TABLE " + table.name + " " + columnsDefinition)
                resolve();
            }).then(() => {
                let createIndexesPromises: Promise<void>[] = [];
                let columns: string[] = [];

                table.columns.filter((column: IPssimisticalColumn) => {
                    //add each column
                    columns.push(column.name.toLowerCase());
                    return !!column.index;
                }).forEach((column: IPssimisticalColumn) => {
                    //create indexes for each index column
                    createIndexesPromises.push(
                        new Promise<void>((resolve, reject) => {
                            this.runModify("CREATE INDEX ON " + table.name + " ( " + column.name + ")");
                            resolve();
                        })
                    );

                });

                return Promise.all(createIndexesPromises).then(() => Promise.resolve());
            }
                ));
        });

        return Promise.all(promises).then(() => Promise.resolve());

    }

    runQuery(sql: string): Promise<[string, any][]> {
        return new Promise((resolve, reject) => {
            console.log("Running query: " + sql);
            this._alasql(sql, (results) => { resolve(results)});
        });        
    }

    runModify(sql: string) {
        console.log("Running query: " + sql);
        this._alasql(sql);
    }

    getTableTableStore(table: IPssimisticalTable): IPssmisiticalTableDataStore {//  throws NoSuchTable
        return new AlasqlPssimisticalTableDataStore(this, table);
    }

}


class AlasqlPssimisticalTableDataStore implements IPssmisiticalTableDataStore {

    constructor(private _datastore: AlasqlPssimisticalDataStore, private _table: IPssimisticalTable) {

    }

    addRecord(record: any) {

        //insertable columns are the keys of the record dict
        let insertableColumns: string[] = [];

        for (let column of this._table.columns) {
            if (record[column.name.toLowerCase()]) {
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


        this._datastore.runModify(sql);

    }
}

