import {IPssimisticalConfigValidator} from '../core/config/IPssimisticalConfigValidator'
import {IPssimisticalConfig, IPssimisticalInput} from '../core/config/IPssimisticalConfig'
import {IPssimisticalConfigWrapper} from '../core/config/IPssimisticalConfigWrapper'
import {PssministicalConfigValidatorFactory} from '../core/config/PssmisticalConfigValidatorFactory'
import {PssimisticalDataStoreFactory} from '../core/datastore/PssimisticalDataStoreFactory'
import {IPssimisticalDataStore} from '../core/datastore/IPssimisticalDataStore'
import {IPssimisticalFileInputFactory} from '../core/input/IPssimisticalFileInputFactory'
import {IPssimisticalFileInput} from '../core/input/IPssimisticalFileInput'
import {IPssimisticalLoader} from '../core/input/IPssimisticalLoader'
import {PssimisticalLoaderFactory} from '../core/input/PssimisticalLoaderFactory'
import {Promise} from 'es6-promise';


export class NodeJSPssimisticalInputFactory implements IPssimisticalFileInputFactory {

    constructor(private _readline, private _fs) {

    }

    buildInput(input: IPssimisticalInput): IPssimisticalFileInput {
        return new FileReader(this._readline, this._fs, input.path);
    }
}

class FileReader implements IPssimisticalFileInput {
    constructor(private _readline, private _fs, private _filePath: string) {

    }

    read(loader: IPssimisticalLoader): Promise<void> {
        
        return new Promise<void>((resolve, reject) => {
            var lineReader = this._readline.createInterface({
                input: this._fs.createReadStream(this._filePath)
            });

            lineReader.on('line', function (line) {
                loader.onReadLine(line);
            });

            lineReader.on('close', function () {
                
                //TODO: loader.onEOF() -> Promise
                loader.onEOF();
                
                resolve();
            });
        });
    }

}