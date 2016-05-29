import {IPssimisticalLoader} from './IPssimisticalLoader'
import {IPssimisticalTableDataStore} from '../datastore/IPssimisticalTableDataStore'

export class PssimisticalTransactionLogLoader implements IPssimisticalLoader {
    private _currentRecord;
    private _detailsAccumulator: string = "";

    constructor(private _dataStore: IPssimisticalTableDataStore, private _columns: string[], private _recordSeparator: string) {

    }

    onReadLine(line: string) {
        console.log("Read Line");
        console.log(line);

        if (line === this._recordSeparator) {

            //the first record will have this header.
            //so this is the trigger to setup our first current record
            if (this._currentRecord) {
                this._currentRecord['details'] = this._detailsAccumulator;
                console.log(this._currentRecord);
                this._dataStore.addRecord(this._currentRecord);
            }

            //TODO: store the details column in a more elegant way

            this._currentRecord = {};
            this._detailsAccumulator = "";
        } else {
            if (line.match("^.*\:.*$")) {
                //extract field. For each column, see if the line starts with it
                this._columns.forEach(column => {
                    let prefix: string = column.toLowerCase() + ":";
                    if (line.toLowerCase().indexOf(prefix) == 0) {
                        let value: string = line.slice(prefix.length);

                        //replace spaces with underscores to be valid SQL column names
                        let key = column.replace(" ", "_").toLowerCase();

                        this._currentRecord[key] = value;
                    }
                });
            } else {

                //TODO: filter out double-empty line at the end of each record
                this._detailsAccumulator += "\n" + line;
            }
        }
    }


    onEOF() {
        this._dataStore.addRecord(this._currentRecord);
        this._currentRecord = {};
        this._detailsAccumulator = "";

    }

}