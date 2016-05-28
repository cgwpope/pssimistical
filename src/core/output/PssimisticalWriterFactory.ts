import {IPssimisticalOutputFactory} from './IPssimisticalOutputFactory'
import {IPssimisticalOutput} from './IPssimisticalOutput'
import {IPssimisticalConfigWrapper} from '../config/IPssimisticalConfigWrapper'
import {IPssimisticalWriter} from './IPssimisticalWriter'

export class PssimisticalWriterFactory {

    constructor(private _outputFactory: IPssimisticalOutputFactory) {

    }

    buildWriter(configWrapper: IPssimisticalConfigWrapper) {
        //only supported output is CSV
        if (configWrapper.getConfig().query.outputFormat !== "CSV") {
            throw new Error("Invalid output format: " + configWrapper.getConfig().query.outputFormat);
        }

        return new CSVWriter(this._outputFactory.buildOutput(configWrapper));
    }
}


class CSVWriter implements IPssimisticalWriter {
    private _stringify;
    constructor(private _output: IPssimisticalOutput) {
        this._stringify = require('csv-stringify');
    }

    writeRecord(record: [string, any]) {
        this._stringify([record], (err, output) => {
            this._output.writeLine(output);
        })
    }
}