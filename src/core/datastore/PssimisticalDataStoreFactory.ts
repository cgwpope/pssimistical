import {IPssimisticalConfigWrapper} from '../config/IPssimisticalConfigWrapper';
import {IPssimisticalDataStore} from './IPssimisticalDataStore';
import {AlasqlPssimisticalDataStore} from './AlasqlPssimisticalDataStore';
import {Promise} from 'es6-promise';

export class PssimisticalDataStoreFactory {
    buildFromConfig(config: IPssimisticalConfigWrapper): Promise<IPssimisticalDataStore> {
        let dataStore: IPssimisticalDataStore = new AlasqlPssimisticalDataStore(config);
        return dataStore.init().then(() => Promise.resolve(dataStore));
    }
}