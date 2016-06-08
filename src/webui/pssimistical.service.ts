import {Injectable} from '@angular/core'

import {IPssimisticalConfigWrapper} from '../core/config/IPssimisticalConfigWrapper'

@Injectable()
export class PssimisticalService {
    
    
    //TODO: should be Observable
    private config: IPssimisticalConfigWrapper;
    
    public setConfig(config: IPssimisticalConfigWrapper){
        this.config = config;
    }
    
    public getConfig() : IPssimisticalConfigWrapper {
        return this.config;
    }
    
}