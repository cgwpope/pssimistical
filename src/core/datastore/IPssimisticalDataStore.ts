import {IPssmisiticalTableDataStore} from './IPssmisiticalTableDataStore'
import {IPssimisticalTable} from '../config/IPssimisticalConfig'
import {Promise} from 'es6-promise';

export interface IPssimisticalDataStore {
    init(): Promise<void>;
    runQuery(query: string): Promise<[string, any][]>
    getTableTableStore(table: IPssimisticalTable): IPssmisiticalTableDataStore;//  throws NoSuchTable

}