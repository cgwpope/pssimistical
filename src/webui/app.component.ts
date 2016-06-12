import { Component, ViewEncapsulation } from '@angular/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material';
import {SelectConfigComponent} from './select-config.component'
import {SelectInputsComponent, InputSelctedEvent} from './select-inputs.component'
import {IPssimisticalWebUIModel} from './IPssimisticalWebUIModel'
import {IPssimisticalInput} from '../core/config/IPssimisticalConfig'
import {IPssimisticalConfigWrapper} from '../core/config/IPssimisticalConfigWrapper'

import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';

import {IPssimisticalFileInputFactory} from '../core/input/IPssimisticalFileInputFactory'
import {IPssimisticalFileInput} from '../core/input/IPssimisticalFileInput'
import {IPssimisticalLoader} from '../core/input/IPssimisticalLoader'
import {IPssimisticalOutputFactory} from '../core/output/IPssimisticalOutputFactory'
import {IPssimisticalOutput} from '../core/output/IPssimisticalOutput'
import {PssimisticalCore} from '../core/PssimisticalCore'

import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';



@Component({
    moduleId: module.id,
    selector: 'pssimistical-web-ui',

    template:
    `
        Welcome to Pssmistical. 
        
        <pssimistical-config-selector  *ngIf="showConfigSelector()" (configSelected)="onConfigSelected($event)">
        </pssimistical-config-selector> 

        <pssimistical-input-selector  *ngIf="showInputSelector()" [config]="model.config" (configSelected)="onInputSelected($event)">
        </pssimistical-input-selector> 

        <div *ngIf="showReportRunner()">
            <button md-raised-button (click)="nextButtonClicked()">RAISED</button>
            <div>
                Output:
                {{output | async}}
            </div>
        </div>

  `,

    directives: [SelectConfigComponent, SelectInputsComponent],
    encapsulation: ViewEncapsulation.None
})

export class AppComponent {

    private model: IPssimisticalWebUIModel = {
        config: undefined,
        inputs: undefined
    };


    private outputSubject: Subject<string>;
    private output: Observable<string>;


    constructor() {
        this.outputSubject = new Subject<string>();
        this.output = this.outputSubject.asObservable();
    }

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

    nextButtonClicked() {
        window.alert("Next");

        //ok, as this point, we should have enough to run pssimistical's processing routine

        //need to provide a PssimisticalFileInputFactory implementation

        let fileInputFactory = new WebUIPssimisticalFileInputFactory(this.model);
        let outputFactory = new WebUIPssimisticalOutputFactory(this.outputSubject);

        let pssimisticalCore: PssimisticalCore = new PssimisticalCore(fileInputFactory, outputFactory);

        pssimisticalCore.run(this.model.config);

    }

}

class WebUIPssimisticalFileInputFactory implements IPssimisticalFileInputFactory {
    constructor(private model: IPssimisticalWebUIModel) {

    }

    buildInput(input: IPssimisticalInput): IPssimisticalFileInput {
        if (this.model.inputs[input.path]) {
            return new WebUIPssimisticalFileInput(this.model.inputs[input.path]);
        } else {
            throw new Error("No file for input " + input.path);
        }


    }
}

class WebUIPssimisticalFileInput implements IPssimisticalFileInput {
    constructor(private fileContent: string) {

    }

    read(loader: IPssimisticalLoader): Promise<void> {

        return new Promise<void>((resolve, reject) => {
            //TODO: Must be possible to stream using file API, but for now, read the whole thing and split
            let lines: string[] = this.fileContent.split("\n");
            for (let line of lines) {
                loader.onReadLine(line);
            }

            loader.onEOF();
            resolve();
        });
    }
}


class WebUIPssimisticalOutputFactory implements IPssimisticalOutputFactory {

    constructor(private subject: Subject<string>) {

    }

    buildOutput(config: IPssimisticalConfigWrapper): IPssimisticalOutput {
        return new ObservablePssimisticalOutput(this.subject);
    }
}

class ObservablePssimisticalOutput implements IPssimisticalOutput {

    private buffer: string = "";

    constructor(private subject: Subject<string>) {
    }

    writeLine(line: string) {
        this.buffer += line + "\n";
        this.subject.next(this.buffer);
    }

} 
