import { Component, ViewEncapsulation } from '@angular/core';

import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';



import {SelectConfigComponent} from './select-config.component'
import {SelectInputsComponent, InputSelctedEvent} from './select-inputs.component'
import {PssimisticalReportRunnerComponent} from './report-runner.component'
import {IPssimisticalWebUIModel} from './IPssimisticalWebUIModel'

import {IPssimisticalInput} from '../core/config/IPssimisticalConfig'
import {IPssimisticalConfigWrapper} from '../core/config/IPssimisticalConfigWrapper'




@Component({
    moduleId: module.id,
    selector: 'pssimistical-web-ui',

    template:
    `

        <md-toolbar color="primary">
            Pssimistical
            <button md-button color="secondary" *ngIf="!showConfigSelector()" (click)="clearConfig()">
                Reset
            </button>
        </md-toolbar>


        <md-card>
            <md-card-title>{{getTitle()}}</md-card-title>
            <md-card-content>
                    <pssimistical-config-selector  *ngIf="showConfigSelector()" (configSelected)="onConfigSelected($event)">
                    </pssimistical-config-selector> 

                    <pssimistical-input-selector  *ngIf="showInputSelector()" [config]="model.config" (configSelected)="onInputSelected($event)">
                    </pssimistical-input-selector> 

                    <pssimistical-report-runner  *ngIf="showReportRunner()" [model]="model">
                    </pssimistical-report-runner> 
            </md-card-content>
    </md-card>


  `,

    directives: [SelectConfigComponent, SelectInputsComponent, PssimisticalReportRunnerComponent, MdToolbar, MD_CARD_DIRECTIVES, MdButton]
})

export class AppComponent {

    private model: IPssimisticalWebUIModel = {
        config: undefined,
        inputs: undefined
    };

    ngOnInit() {

        let model = window.sessionStorage.getItem('modelKey');
        if (model) {
            this.model = JSON.parse(model);
        }
    }

    showConfigSelector(): boolean {
        return !this.model || !this.model.config;
    }

    showInputSelector(): boolean {
        //show input selector when there is a model with a config, but not all inputs satisfied
        return !this.showConfigSelector()
            && !this.hasAllInputs();
    }

    hasAllInputs(): boolean {
        return this.model.inputs && this.model.config.inputs.reduce((hasAll: boolean, input: IPssimisticalInput) => hasAll && this.model.inputs[input.path], true);
    }

    showReportRunner(): boolean {
        return !this.showConfigSelector()
            && this.hasAllInputs();
    }

    onConfigSelected(event: IPssimisticalConfigWrapper) {
        this.model = {
            config: event.getConfig(),
            inputs: undefined
        };

        window.sessionStorage.setItem('modelKey', JSON.stringify(this.model));
    }

    onInputSelected(event: InputSelctedEvent) {
        this.model.inputs = Object.assign({}, this.model.inputs);
        this.model.inputs[event.path] = event.content;
        window.sessionStorage.setItem('modelKey', JSON.stringify(this.model));

    }
    
    clearConfig() {
        this.model = undefined;
        window.sessionStorage.clear();
    }

    getTitle(): string {
        if (this.showConfigSelector()) {
            return "Import a Pssimistical Configuration File"
        } else if (this.showInputSelector()) {
            return "Import data files for report"
        } else if (this.showReportRunner()) {
            return "Run report";
        }
    }

}

