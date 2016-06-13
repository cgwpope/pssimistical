import { Component, EventEmitter, Input } from '@angular/core';


import {IPssimisticalWebUIModel} from './IPssimisticalWebUIModel'

import {IPssimisticalConfig} from '../core/config/IPssimisticalConfig'
import {IPssimisticalFileInputFactory} from '../core/input/IPssimisticalFileInputFactory'
import {IPssimisticalFileInput} from '../core/input/IPssimisticalFileInput'
import {IPssimisticalLoader} from '../core/input/IPssimisticalLoader'
import {IPssimisticalOutputFactory} from '../core/output/IPssimisticalOutputFactory'
import {IPssimisticalOutput} from '../core/output/IPssimisticalOutput'
import {PssimisticalCore} from '../core/PssimisticalCore'
import {IPssimisticalInput} from '../core/config/IPssimisticalConfig'
import {IPssimisticalConfigWrapper} from '../core/config/IPssimisticalConfigWrapper'


import {PssimisticalConfigValidatorFactory} from '../core/config/PssimisticalConfigValidatorFactory'
import {IPssimisticalConfigValidator} from '../core/config/IPssimisticalConfigValidator'


import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';

import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';


@Component({
    selector: 'pssimistical-report-runner',
    template:
    `
        <button md-raised-button (click)="nextButtonClicked()">Run Report</button>
        <div>
            <table>
                <tr>
                    <th *ngFor="let header of headers | async">{{header}}<th>
                </tr>
                <tr *ngFor="let row of rows | async">
                    <td *ngFor="let key of keys(row)">{{row[key]}}</td>
                </tr> 
            </table>
        </div>
    `,

})

export class PssimisticalReportRunnerComponent {

    private headersSubject: Subject<string[]>;
    private headers: Observable<string[]>;

    private rowsSubject: Subject<[string, any][]>;
    private rows: Observable<[string, any][]>;

    @Input()
    private model: IPssimisticalWebUIModel;

    constructor() {
        this.headersSubject = new Subject<string[]>();
        this.headers = this.headersSubject.asObservable();

        this.rowsSubject = new Subject<[string, any][]>();
        this.rows = this.rowsSubject.asObservable();
    }

    nextButtonClicked() {
        window.alert("Next");

        //ok, as this point, we should have enough to run pssimistical's processing routine

        //need to provide a PssimisticalFileInputFactory implementation

        let fileInputFactory = new WebUIPssimisticalFileInputFactory(this.model);
        let outputFactory = new WebUIPssimisticalOutputFactory(this.headersSubject, this.rowsSubject);

        let pssimisticalCore: PssimisticalCore = new PssimisticalCore(fileInputFactory, outputFactory);

        pssimisticalCore.run(this.model.config);

    }

    keys(obj: any){
        if(obj){
            return Object.keys(obj);
        } else {
            return [];
        }
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

    constructor(private headersSubject: Subject<string[]>, private rowsSubject: Subject<[string, any][]>) {

    }

    buildOutput(config: IPssimisticalConfigWrapper): IPssimisticalOutput {
        return new ObservablePssimisticalOutput(this.headersSubject, this.rowsSubject);
    }
}

class ObservablePssimisticalOutput implements IPssimisticalOutput {

    private hasHeaders: boolean = false;

    //TODO: Research better way to push new items to an observable list    
    private rowsBuffer: [string, any][]= [];

    constructor(private columns: Subject<string[]>, private rows: Subject<[string, any][]>) {
    }

    writeRecord(record: [string, any]) {
        if (!this.hasHeaders) {
            let headers: string[] = [];
            for (let key in record) {
                headers.push(key);
            }

            this.columns.next(headers);
            this.hasHeaders = true;
        }

        this.rowsBuffer.push(record);
        this.rows.next(this.rowsBuffer);
    }
} 
