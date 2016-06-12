
import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import {IPssimisticalConfigWrapper} from '../core/config/IPssimisticalConfigWrapper'
import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs';



@Component({
    moduleId: module.id,
    selector: 'pssimistical-input-selector',
    template:
    `
    <div>
    Select inputs
    
    <md-tab-group class="demo-tab-group">
        <md-tab *ngFor="let input of config.inputs">
            <template md-tab-label>{{input.path}}</template>
            <template md-tab-content>
                <div id="drop_zone" (dragover)="handleDraggedOver($event)" (drop)="handleDrop($event, input.path)">
                    Drop files here
                    <br>
                    <br>
                    <br>
                </div>
            </template>
        </md-tab>
    </md-tab-group>
    

    </div>
    `,
    directives: [MD_TABS_DIRECTIVES],
    encapsulation: ViewEncapsulation.None,

})


export class SelectInputsComponent {


    @Input()  config: IPssimisticalConfigWrapper;
    @Output() configSelected = new EventEmitter<InputSelctedEvent>();


    constructor() {
    }

    handleDraggedOver(event: DragEvent) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    handleDrop(event: DragEvent, path: string) {
        event.stopPropagation();
        event.preventDefault();

        let files: FileList = event.dataTransfer.files

        if (files.length > 1) {
            window.alert("Only drop a single file");
        } else {

            let fileReader: FileReader = new FileReader();
            fileReader.onload = (event: Event) => {
                let contents: string = event.target['result'];
                this.configSelected.emit({
                    path: path,
                    content: contents
                });

            }

            //TODO: Show progress as reading
            fileReader.readAsText(files[0], 'utf8');
            
        }
    }
}


export interface InputSelctedEvent {
    path: string,
    content: string
}


