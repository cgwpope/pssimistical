import {IPssimisticalConfigWrapper} from '../config/IPssimisticalConfigWrapper';
import {IPssimisticalDataStore} from './IPssimisticalDataStore';
import {AlasqlPssimisticalDataStore} from './AlasqlPssimisticalDataStore';

export class PssimisticalDataStoreFactory {
    buildFromConfig(config: IPssimisticalConfigWrapper): IPssimisticalDataStore {
        return new AlasqlPssimisticalDataStore(config);
    }
}