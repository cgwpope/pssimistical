import {IPssimisticalDataStore} from '../datastore/IPssimisticalDataStore';
import {IPssmisiticalTableDataStore} from '../datastore/IPssmisiticalTableDataStore';
import {IPssimisticalLoader} from './IPssimisticalLoader';
import {IPssimisticalTable} from '../config/IPssimisticalConfig';

export class PssimisticalLoaderFactory {

    constructor(private _dataStore: IPssimisticalDataStore) {

    }

    builderLoader(reader: string, table: IPssimisticalTable): IPssimisticalLoader {
        //TODO: handle different types;
        return new PssCSVLoader(this._dataStore.getTableTableStore(table));
    }

}


class PssCSVLoader implements IPssimisticalLoader {

    private _csv;
    private _parse;
    private _transform;

    private _lineCount;


    constructor(private _dataStore: IPssmisiticalTableDataStore) {
        this._parse =  require('csv-parse/lib/sync');
        this._lineCount = 0;
    }

    onReadLine(line: string) {
        if (++this._lineCount >= 2) {
            console.log("Read Line");
            console.log(line);
            
            let record = this._parse(line + "\n", {columns: this.getColumns()});
             
            this._dataStore.addRecord(record[0]);
        } else {
            //discard. PSS CSV is weird like that.
        }
    }

    onEOF() {
        //no eof processing here.
    }

    private getColumns(): string[] {
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
            "Last_Billed_date",
            "?"]
    }

}

