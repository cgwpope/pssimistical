import {IPssimisticalLoader} from './IPssimisticalLoader'
import {IPssmisiticalTableDataStore} from '../datastore/IPssmisiticalTableDataStore'

export class PssimisticalCSVLoader implements IPssimisticalLoader {
        private _parse;
    private _lineCount;


    constructor(private _dataStore: IPssmisiticalTableDataStore, private _columns: string[], private _numLinesToSkip: number) {
        this._parse =  require('csv-parse/lib/sync');
        this._lineCount = 0;
    }

    onReadLine(line: string) {
        if (++this._lineCount >= this._numLinesToSkip) {
            console.log("Read Line");
            console.log(line);
            
            let record = this._parse(line + "\n", {columns: this._columns});
             
            this._dataStore.addRecord(record[0]);
        } else {
            //discard. PSS CSV is weird like that.
        }
    }

    onEOF() {
        //no eof processing here.
    }

}