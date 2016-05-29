import {IPssimisticalConfig} from './IPssimisticalConfig';
import {IPssimisticalConfigWrapper} from './IPssimisticalConfigWrapper';
import {Promise} from 'es6-promise';


export interface IPssimisticalConfigValidator{
    // validateConfig(config:IPssimisticalConfig, onSchemaError: (validationResult) => void, onSemanticError: (message: string)=>void) : IPssimisticalConfigWrapper;
    validateConfig(config:IPssimisticalConfig) : Promise<IPssimisticalConfigWrapper>;    
}
 