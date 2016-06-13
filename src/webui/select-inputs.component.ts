
import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import {IPssimisticalConfigWrapper} from '../core/config/IPssimisticalConfigWrapper'
import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs';
import {FileDropTargetComponent} from './file-drop-target.component'




@Component({
    moduleId: module.id,
    selector: 'pssimistical-input-selector',
    template:
    `
    <div>
    <md-tab-group class="demo-tab-group">
        <md-tab *ngFor="let input of config.inputs">
            <template md-tab-label>{{input.path}}</template>
            <template md-tab-content>
                <file-drop-target (fileDropped)="fileDropped($event, input.path)">
                    <h3>Drop files to import here</h3>
                </file-drop-target>
            </template>
        </md-tab>
    </md-tab-group>
    

    </div>
    `,
    directives: [MD_TABS_DIRECTIVES, FileDropTargetComponent],
    encapsulation: ViewEncapsulation.None,

})


export class SelectInputsComponent {

    @Input()  config: IPssimisticalConfigWrapper;
    @Output() configSelected = new EventEmitter<InputSelctedEvent>();

    fileDropped(event: string, path: string) {
        this.configSelected.emit({
            path: path,
            content: event
        });
    }
}


export interface InputSelctedEvent {
    path: string,
    content: string
}


