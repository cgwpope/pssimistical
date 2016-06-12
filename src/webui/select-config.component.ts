import { Component, EventEmitter, Output } from '@angular/core';
import {IPssimisticalConfig} from '../core/config/IPssimisticalConfig'
import {PssimisticalConfigValidatorFactory} from '../core/config/PssimisticalConfigValidatorFactory'
import {IPssimisticalConfigValidator} from '../core/config/IPssimisticalConfigValidator'
import {IPssimisticalConfigWrapper} from '../core/config/IPssimisticalConfigWrapper'

@Component({
    moduleId: module.id,
    selector: 'pssimistical-config-selector',
    template:
    `
    <div>
    Select a config
    
    <div id="drop_zone" (dragover)="handleDraggedOver($event)" (drop)="handleDrop($event)">Drop files here</div>
    
    </div>
    `
})
export class SelectConfigComponent {

    @Output()
    private configSelected = new EventEmitter<IPssimisticalConfigWrapper>();

    constructor() {
    }

    handleDraggedOver(event: DragEvent) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    handleDrop(event: DragEvent) {
        event.stopPropagation();
        event.preventDefault();

        let files:FileList = event.dataTransfer.files; // FileList object.

        // files is a FileList of File objects. List some properties.
        var output = [];
        for (var i = 0, f: File; f = files[i]; i++) {

            let fileReader: FileReader = new FileReader();
            
            fileReader.onload = (event: Event) => {
                //read file, let's see if it's a pssimistical config
                let config: IPssimisticalConfig = <IPssimisticalConfig>JSON.parse(event.target['result']);
                
                let configValidatorFactory: PssimisticalConfigValidatorFactory = new PssimisticalConfigValidatorFactory();
                let configValidator: IPssimisticalConfigValidator = configValidatorFactory.buildConfigValidator();
                configValidator.validateConfig(config)
                .then( (config: IPssimisticalConfigWrapper) => this.configSelected.emit(config) )
                .catch( (error) => console.log(error)); 
                
                //valid config. Add to the the list to run from
            } 
            
            fileReader.readAsText(f, 'utf8');

        }
    }
}