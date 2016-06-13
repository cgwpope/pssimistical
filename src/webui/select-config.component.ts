import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import {IPssimisticalConfig} from '../core/config/IPssimisticalConfig'
import {PssimisticalConfigValidatorFactory} from '../core/config/PssimisticalConfigValidatorFactory'
import {IPssimisticalConfigValidator} from '../core/config/IPssimisticalConfigValidator'
import {IPssimisticalConfigWrapper} from '../core/config/IPssimisticalConfigWrapper'
import {FileDropTargetComponent} from './file-drop-target.component'

@Component({
    moduleId: module.id,
    selector: 'pssimistical-config-selector',
    template:
    `
    <div>
    
    <h3>Drag a Pssimistical configuration file onto the dropzone.</h3>
    
    <file-drop-target (fileDropped)="fileDropped($event)">
        <h3>Drop configuration file here</h3>
    </file-drop-target>
    
    </div>
    `,
    directives: [FileDropTargetComponent],
    encapsulation: ViewEncapsulation.Native
})
export class SelectConfigComponent {

    @Output()
    private configSelected = new EventEmitter<IPssimisticalConfigWrapper>();

    constructor() {
    }


    fileDropped(event: string) {
        let config: IPssimisticalConfig = <IPssimisticalConfig>JSON.parse(event);
        let configValidatorFactory: PssimisticalConfigValidatorFactory = new PssimisticalConfigValidatorFactory();
        let configValidator: IPssimisticalConfigValidator = configValidatorFactory.buildConfigValidator();
        configValidator.validateConfig(config)
        .then( (config: IPssimisticalConfigWrapper) => this.configSelected.emit(config) )
        .catch( (error) => console.log(error)); 
    }
}