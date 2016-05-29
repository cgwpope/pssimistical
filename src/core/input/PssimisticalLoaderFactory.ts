import {IPssimisticalDataStore} from '../datastore/IPssimisticalDataStore';
import {IPssimisticalTableDataStore} from '../datastore/IPssimisticalTableDataStore';
import {IPssimisticalLoader} from './IPssimisticalLoader';
import {IPssimisticalTable, IPssimisticalReader} from '../config/IPssimisticalConfig';
import {IPssimisticalConfigWrapper} from '../config/IPssimisticalConfigWrapper'
import {PssimisticalSVLoader} from './PssimisticalSVLoader'
import {PssimisticalTransactionLogLoader} from './PssimisticalTransactionLogLoader'
import {Promise} from 'es6-promise';


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
                //create the appropriate reader based on type
                //only support CSV for now
                if (readerConfig.type === "SV") {
                    let linesToSkip: number = readerConfig.readerProperties['linesToSkip'] || 0;
                    let delimiter: string = readerConfig.readerProperties['delimiter'] || ",";
                    resolve(new PssimisticalSVLoader(this._dataStore.getTableTableStore(table), readerConfig.columns, linesToSkip, delimiter));
                } else if (readerConfig.type === "txlog") {

                    let recordSeparator: string = readerConfig.readerProperties['recordSeparator'];
                    if (!recordSeparator) {
                        reject(new Error("Unable to create txlog reader without recordSeparator string specified"));
                    } else {
                        resolve(new PssimisticalTransactionLogLoader(this._dataStore.getTableTableStore(table), readerConfig.columns, recordSeparator));
                    }

                } else {
                    //bail out
                    reject(new Error("Invalid reader type: " + readerConfig.type));
                }
            }
        });
    }

}



