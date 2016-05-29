import {IPssimisticalConfig} from './IPssimisticalConfig';
import {IPssimisticalConfigWrapper} from './IPssimisticalConfigWrapper';
import {Promise} from 'es6-promise';


export interface IPssimisticalConfigValidator{
    validateConfig(config:IPssimisticalConfig) : Promise<IPssimisticalConfigWrapper>;    
}
 