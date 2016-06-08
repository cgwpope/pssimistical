import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {IPssimisticalConfig} from '../core/config/IPssimisticalConfig'
import {PssimisticalConfigValidatorFactory} from '../core/config/PssimisticalConfigValidatorFactory'
import {IPssimisticalConfigValidator} from '../core/config/IPssimisticalConfigValidator'
import {IPssimisticalConfigWrapper} from '../core/config/IPssimisticalConfigWrapper'
import {PssimisticalService} from './pssimistical.service'

@Component({
    moduleId: module.id,

    template:
    `
    <div>
    Select a config
    
    <div id="drop_zone" (dragover)="handleDraggedOver($event)" (drop)="handleDrop($event)">Drop files here</div>
    
    
    <div *ngIf="service.getConfig()">
        Config's query: {{service.getConfig().getConfig().query.sql}}
        <a [routerLink]="['/select-inputs']">Select Inputs</a>   
    <div>
    
    </div>
    `,

    styles: [
        `
        `
    ],

    directives: [ROUTER_DIRECTIVES]

})
export class SelectConfigComponent {

    

    constructor(private service: PssimisticalService) {
    }

    handleDraggedOver(event: DragEvent) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    handleDrop(event: DragEvent) {
        event.stopPropagation();
        event.preventDefault();

        var files = event.dataTransfer.files; // FileList object.

        // files is a FileList of File objects. List some properties.
        var output = [];
        for (var i = 0, f; f = files[i]; i++) {

            let fileReader: FileReader = new FileReader();
            
            fileReader.onload = (event: Event) => {
                //read file, let's see if it's a pssimistical config
                let config: IPssimisticalConfig = <IPssimisticalConfig>JSON.parse(event.target['result']);
                
                let configValidatorFactory: PssimisticalConfigValidatorFactory = new PssimisticalConfigValidatorFactory();
                let configValidator: IPssimisticalConfigValidator = configValidatorFactory.buildConfigValidator();
                configValidator.validateConfig(config)
                .then( (config: IPssimisticalConfigWrapper) => this.service.setConfig(config))
                .catch( (error) => console.log(error)); 
                
                //valid config. Add to the the list to run from
            } 
            
            fileReader.readAsText(f, 'utf8');

        }
    }
}