import {IPssimisticalConfigWrapper} from '../config/IPssimisticalConfigWrapper'
import {IPssimisticalOutput} from './IPssimisticalOutput'
export interface IPssimisticalOutputFactory {
    buildOutput(config: IPssimisticalConfigWrapper) : IPssimisticalOutput;
}