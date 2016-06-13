import {IPssimisticalFileInputFactory} from './input/IPssimisticalFileInputFactory'
import {IPssimisticalConfigValidator} from './config/IPssimisticalConfigValidator'
import {IPssimisticalConfig, IPssimisticalInput} from './config/IPssimisticalConfig'
import {IPssimisticalConfigWrapper} from './config/IPssimisticalConfigWrapper'
import {PssimisticalConfigValidatorFactory} from './config/PssimisticalConfigValidatorFactory'
import {PssimisticalDataStoreFactory} from './datastore/PssimisticalDataStoreFactory'
import {IPssimisticalDataStore} from './datastore/IPssimisticalDataStore'
import {IPssimisticalFileInput} from './input/IPssimisticalFileInput'
import {IPssimisticalLoader} from './input/IPssimisticalLoader'
import {PssimisticalLoaderFactory} from './input/PssimisticalLoaderFactory'
import {IPssimisticalOutputFactory} from './output/IPssimisticalOutputFactory'
import {IPssimisticalOutput} from './output/IPssimisticalOutput'


export class PssimisticalCore {

    constructor(private _fileInputFactory: IPssimisticalFileInputFactory, private _fileOutputFactory: IPssimisticalOutputFactory) {

    }

    public run(config: IPssimisticalConfig): Promise<void> {
        let validator: IPssimisticalConfigValidator = new PssimisticalConfigValidatorFactory().buildConfigValidator();

        return validator.validateConfig(config).then((configWrapper) => {
            //ok, valid config. return a promise that sets up data, loads it and runs queries
            return new PssimisticalDataStoreFactory().buildFromConfig(configWrapper).then((dataStore) => {

                return Promise.all(configWrapper.getConfig().inputs.map((input: IPssimisticalInput) => {
                    //map inputs to a Promise that resolves when each input is loaded

                    let loaderFactory: PssimisticalLoaderFactory = new PssimisticalLoaderFactory(dataStore);
                    let fileInput: IPssimisticalFileInput = this._fileInputFactory.buildInput(input);

                    return loaderFactory.buildLoader(configWrapper, input.reader, configWrapper.getTableForName(input.table))
                        .then((loader: IPssimisticalLoader) => {
                            return fileInput.read(loader);
                        });
                })).then(() => {
                    return dataStore.runQuery(configWrapper.getConfig().query.sql);
                }).then((results: [string, any][]) => {
                    
                    let writer: IPssimisticalOutput = this._fileOutputFactory.buildOutput(configWrapper);
                    for (let result of results) {
                        writer.writeRecord(result);
                    }
                });
            });
        });
    }   
}