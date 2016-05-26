import {IPssimisticalConfigValidator} from '../config/IPssimisticalConfigValidator'
import {IPssimisticalConfig, IPssimisticalInput} from '../config/IPssimisticalConfig'
import {IPssimisticalConfigWrapper} from '../config/IPssimisticalConfigWrapper'
import {PssministicalConfigValidatorFactory} from '../config/PssmisticalConfigValidatorFactory'
import {PssimisticalDataStoreFactory} from '../datastore/PssimisticalDataStoreFactory'
import {IPssimisticalDataStore} from '../datastore/IPssimisticalDataStore'
import {IPssimisticalFileInputFactory} from '../input/IPssimisticalFileInputFactory'
import {IPssimisticalFileInput} from '../input/IPssimisticalFileInput'
import {IPssimisticalLoader} from '../input/IPssimisticalLoader'
import {PssimisticalLoaderFactory} from '../input/PssimisticalLoaderFactory'

export class NodeJSPssimisticalInputFactory implements IPssimisticalFileInputFactory {

    constructor(private _readline, private _fs) {

    }

    buildInput(input: IPssimisticalInput): IPssimisticalFileInput {
        return new FileReader(this._readline, this._fs, input.path);
    }
}

class FileReader implements IPssimisticalFileInput {
    constructor(private _readline,  private _fs, private _filePath: string) {

    }


    //TODO: detect and handle EOF
    read(loader: IPssimisticalLoader, onCompleteCallback: () => void) { //throws InputCreationFailure  
        var lineReader = this._readline.createInterface({
            input: this._fs.createReadStream(this._filePath)
        });

        lineReader.on('line', function (line) {
            loader.onReadLine(line);
        });

        lineReader.on('close', function () {
            loader.onEOF();
            
            //TODO: This only works properly if loader.onEOF() is sync. 
            //may need to make that async as well.
            onCompleteCallback();
        });
    }

}