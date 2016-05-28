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

import {NodeJSPssimisticalInputFactory} from './NodeJSPssimisticalInputFactory'
import {NodeJSPssimisticalOutputFactory} from './NodeJSPssimisticalOutputFactory'

import {PssimisticalCore} from '../core/PssimisticalCore'



export class PssimisticalNodeJSRunner {

    private _parser;
    
    constructor(private _argparse, private _fs, private _readline) {
        this.initArgumentParser();
    }

    private initArgumentParser() {
        var ArgumentParser = this._argparse.ArgumentParser;
        this._parser = new ArgumentParser({
            version: '0.0.1',
            addHelp: true,
            description: 'Pssimistical NodeJS Runner'
        });

        this._parser.addArgument(
            ['-f', '--config-file'],
            {
                help: 'Path to the pssimistical configuration file to use',
                required: true
            }
        );
    }


    run() {
        var args = this._parser.parseArgs();
        console.log("Confile file path: " + args.config_file);


        if (this._fs.existsSync(args.config_file)) {

            //TODO: Safely do this by reading into the buffer and setting a maximum size
            let config: IPssimisticalConfig = <IPssimisticalConfig>JSON.parse(this._fs.readFileSync(args.config_file, { encoding: 'utf8' }));

            new PssimisticalCore(new NodeJSPssimisticalInputFactory(this._readline, this._fs), new NodeJSPssimisticalOutputFactory()).run(config);
            
        } else {
            console.log("Unable to read provided config file: " + args.config_file);
        }

    }
}











