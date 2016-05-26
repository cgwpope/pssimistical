import {IPssimisticalConfig} from './IPssimisticalConfig';
import {IPssimisticalConfigWrapper} from './IPssimisticalConfigWrapper';


export interface IPssimisticalConfigValidator{
    validateConfig(config:IPssimisticalConfig, onSchemaError: (validationResult) => void, onSemanticError: (message: string)=>void) : IPssimisticalConfigWrapper;    
}
 