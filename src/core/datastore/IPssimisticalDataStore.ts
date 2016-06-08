import {IPssimisticalTableDataStore} from './IPssimisticalTableDataStore'
import {IPssimisticalTable} from '../config/IPssimisticalConfig'

export interface IPssimisticalDataStore {
    init(): Promise<void>;
    runQuery(query: string): Promise<[string, any][]>
    getTableTableStore(table: IPssimisticalTable): IPssimisticalTableDataStore;//  throws NoSuchTable

}