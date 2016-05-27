import {IPssmisiticalTableDataStore} from './IPssmisiticalTableDataStore'
import {IPssimisticalTable} from '../config/IPssimisticalConfig'

export interface IPssimisticalDataStore {
    init();
    runQuery(query: string);
    getTableTableStore(table: IPssimisticalTable): IPssmisiticalTableDataStore;//  throws NoSuchTable

}