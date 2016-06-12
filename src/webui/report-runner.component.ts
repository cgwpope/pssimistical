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
        <button md-raised-button (click)="nextButtonClicked()">RAISED</button>
        <div>
            Output:
            {{output | async}}
        </div>
    `,

})

export class PssimisticalReportRunnerComponent {

    private outputSubject: Subject<string>;
    private output: Observable<string>;
    
    @Input()
    private model: IPssimisticalWebUIModel;

    constructor() {
        this.outputSubject = new Subject<string>();
        this.output = this.outputSubject.asObservable();
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
