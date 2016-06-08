import {IPssimisticalDataStore} from '../datastore/IPssimisticalDataStore';
import {IPssimisticalTableDataStore} from '../datastore/IPssimisticalTableDataStore';
import {IPssimisticalLoader} from './IPssimisticalLoader';
import {IPssimisticalTable, IPssimisticalReader} from '../config/IPssimisticalConfig';
import {IPssimisticalConfigWrapper} from '../config/IPssimisticalConfigWrapper'
import {PssimisticalSVLoader} from './PssimisticalSVLoader'
import {PssimisticalTransactionLogLoader} from './PssimisticalTransactionLogLoader'
import {DelegatingDataStore} from '../datastore/PssimisticalDataStoreFactory'


export class PssimisticalLoaderFactory {

    public static readerTypes: string[] = [
        "SV",
        "txlog"
    ]


    static readerNames: string[] = [

    ]


    constructor(private _dataStore: IPssimisticalDataStore) {

    }

    buildLoader(configWrapper: IPssimisticalConfigWrapper, reader: string, table: IPssimisticalTable): Promise<IPssimisticalLoader> {


        return new Promise((resolve, reject) => {

            //check to see if this is a built-in reader
            //Nope, don't have any of those yes

            //check to see if this references a valid reader in the config
            let readerConfig: IPssimisticalReader = configWrapper.getConfig().readers[reader];

            if (!readerConfig) {
                //bail out
                reject(new Error("Invalid reader: " + reader));
            } else {

                let dataStore: IPssimisticalTableDataStore = this._dataStore.getTableTableStore(table);
                dataStore = new ColumnWrappingTableDataStore(readerConfig, dataStore);

                //create the appropriate reader based on type
                //only support CSV for now
                if (readerConfig.type === "SV") {
                    let linesToSkip: number = readerConfig.readerProperties['linesToSkip'] || 0;
                    let delimiter: string = readerConfig.readerProperties['delimiter'] || ",";
                    resolve(new PssimisticalSVLoader(dataStore, readerConfig.columns, linesToSkip, delimiter));
                } else if (readerConfig.type === "txlog") {

                    let recordSeparator: string = readerConfig.readerProperties['recordSeparator'];
                    if (!recordSeparator) {
                        reject(new Error("Unable to create txlog reader without recordSeparator string specified"));
                    } else {
                        resolve(new PssimisticalTransactionLogLoader(dataStore, readerConfig.columns, recordSeparator));
                    }

                } else {
                    //bail out
                    reject(new Error("Invalid reader type: " + readerConfig.type));
                }
            }
        });
    }
}



class ColumnWrappingTableDataStore implements IPssimisticalTableDataStore {
    constructor(private _readerConfig: IPssimisticalReader, private _delegate: IPssimisticalTableDataStore) {

    }

    addRecord(record: any) {
        //inspect column mapping, adjust as necessary
        for (let originalColumn in this._readerConfig.columnMappings) {

            let newColumn: string = this._readerConfig.columnMappings[originalColumn];
            if (!newColumn) {
                throw new Error("Invalid column mapping - no mapping supplied for input column " + originalColumn);
            }

            if (record[originalColumn] == undefined) {
                throw new Error("Invalid column mapping - column " + originalColumn + " not present in input");
            } else {
                let value: any = record[originalColumn];
                delete record[originalColumn];
                record[newColumn] = value;
            }
        }

        this._delegate.addRecord(record);
    }
}



