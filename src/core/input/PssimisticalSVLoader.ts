import {IPssimisticalLoader} from './IPssimisticalLoader'
import {IPssmisiticalTableDataStore} from '../datastore/IPssmisiticalTableDataStore'

export class PssimisticalSVLoader implements IPssimisticalLoader {
        private _parse;
    private _lineCount;


    constructor(private _dataStore: IPssmisiticalTableDataStore, private _columns: string[], private _numLinesToSkip: number, private _delimiter) {
        this._parse =  require('csv-parse/lib/sync');
        this._lineCount = 0;
    }

    onReadLine(line: string) {
        if (++this._lineCount >= this._numLinesToSkip) {
            console.log("Read Line");
            console.log(line);
            
            let record = this._parse(line.trim() + "\n", {columns: this._columns, delimiter: this._delimiter});
             
             console.log(record[0]);
             
            this._dataStore.addRecord(record[0]);
        } else {
            //discard. PSS CSV is weird like that.
        }
    }

    onEOF() {
        //no eof processing here.
    }

}