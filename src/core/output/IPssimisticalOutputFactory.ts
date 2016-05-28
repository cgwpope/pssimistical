import {IPssimisticalConfigWrapper} from '../config/IPssimisticalConfigWrapper'

export interface IPssimisticalOutputFactory {
    buildOutput(config: IPssimisticalConfigWrapper);
}