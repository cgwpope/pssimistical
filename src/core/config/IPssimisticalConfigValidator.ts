import {IPssimisticalConfig} from './IPssimisticalConfig';
import {IPssimisticalConfigWrapper} from './IPssimisticalConfigWrapper';


export interface IPssimisticalConfigValidator{
    validateConfig(config:IPssimisticalConfig) : Promise<IPssimisticalConfigWrapper>;    
}
 