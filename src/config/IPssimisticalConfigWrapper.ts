import {IPssimisticalConfig, IPssimisticalColumn} from './IPssimisticalConfig';


export interface IPssimisticalConfigWrapper {
    getConfig(): IPssimisticalConfig;
    getTableForName(tableName: string);  // throws NoSuchTableError
    getColumnsForTable(tableName: string): IPssimisticalColumn[]; // throws NoSuchTableError
    getTypeForColumn(tableName: string, columnName: string): string; //throws NoSuchTableError, throws NoSuchColumnError
}


export class NoSuchTableError {
    //TODO   
}

export class NoSuchColumnError {
    //TODO
}