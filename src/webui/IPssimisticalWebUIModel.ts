import {IPssimisticalConfig} from '../core/config/IPssimisticalConfig'

export interface IPssimisticalWebUIModel {
    "config": IPssimisticalConfig,
    "inputs": [string, string]
}