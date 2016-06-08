import {IPssimisticalConfigWrapper} from '../config/IPssimisticalConfigWrapper';
import {IPssimisticalTable} from '../config/IPssimisticalConfig'
import {IPssimisticalDataStore} from './IPssimisticalDataStore';
import {IPssimisticalTableDataStore} from './IPssimisticalTableDataStore';
import {AlasqlPssimisticalDataStore} from './AlasqlPssimisticalDataStore';

export class PssimisticalDataStoreFactory {
    buildFromConfig(config: IPssimisticalConfigWrapper): Promise<IPssimisticalDataStore> {
        let dataStore: IPssimisticalDataStore = new AlasqlPssimisticalDataStore(config);

        //first level of wrapping - support type conversion
        dataStore = new DataStoreWrapper(dataStore, config);
        return dataStore.init().then(() => Promise.resolve(dataStore));
    }

    //data store has type-converting wrapper
}


export class DelegatingDataStore implements IPssimisticalDataStore {
    constructor(protected _dataStore: IPssimisticalDataStore) {

    }

    init(): Promise<void> {
        return this._dataStore.init();
    }

    runQuery(query: string): Promise<[string, any][]> {
        return this._dataStore.runQuery(query);
    }

    getTableTableStore(table: IPssimisticalTable): IPssimisticalTableDataStore {
        return this._dataStore.getTableTableStore(table);
    }
} 


//TODO: Figure out general implementation of delegate in Typescript...
class DataStoreWrapper extends DelegatingDataStore implements IPssimisticalDataStore {
    constructor(dataStore: IPssimisticalDataStore, private _config: IPssimisticalConfigWrapper) {
        super(dataStore);
    }

    getTableTableStore(table: IPssimisticalTable): IPssimisticalTableDataStore {
        let delegate: IPssimisticalTableDataStore = this._dataStore.getTableTableStore(table);
        return new TypeConvertingTableDataStore(table, this._config, delegate);
    }
}




class TypeConvertingTableDataStore implements IPssimisticalTableDataStore {

    constructor(private _table: IPssimisticalTable, private _configWrapper: IPssimisticalConfigWrapper, private _delegate: IPssimisticalTableDataStore) {

    }

    /** Intercept the addRecord call, adjust types of argments and forward to the original intended delegate */
    addRecord(record: [string, any]) {
        //for each field in this object, inspect the target column type
        //if it is not text, attempt conversion

        for (let key in record) {

            try {
                let targetType: string = this._configWrapper.getTypeForColumn(this._table.name, key);
                if (targetType === "text") {
                    //nothing to do.
                    continue;
                } else if (targetType === "number") {
                    let numericValue: number = Number(record[key]);
                    if (numericValue === Number.NaN) {
                        //unable to parse number. bail out.
                        throw new Error("Error importing value for column " + key + " of table " + this._table + ". Value " + record[key] + " is not a valid numeric value");
                    } else {
                        record[key] = numericValue;
                    }
                } else if (targetType === "date") {
                    //multiple date formats to consider.
                    var moment = new DateParser().resolveToDate(record[key]);
                    record[key] = moment ? moment.toDate() : null;
                }
            } catch (e) {
                //log, but don't bail out:
                //console.log("Unable to determine target type for column: " + key);
            }
        }

        this._delegate.addRecord(record);
    }
}


/** Handle parsing the many date formats that may appear in a PSS export 

Examples of date formats:
2015-11-26T17:11:24-05:00
2016-05-22 00:05:03.0
Jan 11, 2016
2015/12/17


*/

class DateParser {

    private _formats: string[] = [
        "YYYY-MM-DDTHH:mm:ssZ",
        "YYYY-MM-DD HH:mm:ss.S",
        "MMM D, YYYY",
        "YYYY/MM/DD"
    ];

    public resolveToDate(value: string) {
        let moment = require("moment");
        let date = moment(value, this._formats, false);
        if (date.isValid()) {
            return date;
        } else {
            return null;
        }
    }
}

