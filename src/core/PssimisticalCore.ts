import {IPssimisticalFileInputFactory} from './input/IPssimisticalFileInputFactory'
import {IPssimisticalConfigValidator} from './config/IPssimisticalConfigValidator'
import {IPssimisticalConfig, IPssimisticalInput} from './config/IPssimisticalConfig'
import {IPssimisticalConfigWrapper} from './config/IPssimisticalConfigWrapper'
import {PssministicalConfigValidatorFactory} from './config/PssmisticalConfigValidatorFactory'
import {PssimisticalDataStoreFactory} from './datastore/PssimisticalDataStoreFactory'
import {IPssimisticalDataStore} from './datastore/IPssimisticalDataStore'
import {IPssimisticalFileInput} from './input/IPssimisticalFileInput'
import {IPssimisticalLoader} from './input/IPssimisticalLoader'
import {PssimisticalLoaderFactory} from './input/PssimisticalLoaderFactory'
import {IPssimisticalOutputFactory} from './output/IPssimisticalOutputFactory'
import {PssimisticalWriterFactory} from './output/PssimisticalWriterFactory'
import {IPssimisticalWriter} from './output/IPssimisticalWriter'
import {Promise} from 'es6-promise';

export class PssimisticalCore {

    constructor(private _fileInputFactory: IPssimisticalFileInputFactory, private _fileOutputFactory: IPssimisticalOutputFactory) {

    }

    public run(config: IPssimisticalConfig): Promise<void> {
        let validator: IPssimisticalConfigValidator = new PssministicalConfigValidatorFactory().buildConfigValidator();

        return validator.validateConfig(config).then((configWrapper) => {
            //ok, valid config. return a promise that sets up data, loads it and runs queries

            return new PssimisticalDataStoreFactory().buildFromConfig(configWrapper).then((dataStore) => {

                return Promise.all(configWrapper.getConfig().inputs.map((input: IPssimisticalInput) => {
                    //map inputs to a Promise that resolves when each input is loaded

                    let loaderFactory: PssimisticalLoaderFactory = new PssimisticalLoaderFactory(dataStore);
                    let fileInput: IPssimisticalFileInput = this._fileInputFactory.buildInput(input);

                    return loaderFactory.builderLoader(configWrapper, input.reader, configWrapper.getTableForName(input.table))
                        .then((loader: IPssimisticalLoader) => {
                            return fileInput.read(loader);
                        });
                })).then(() => {
                    return dataStore.runQuery(configWrapper.getConfig().query.sql);
                }).then((results: [string, any][]) => {
                    let writerFactory: PssimisticalWriterFactory = new PssimisticalWriterFactory(this._fileOutputFactory);
                    let writer: IPssimisticalWriter = writerFactory.buildWriter(configWrapper);
                    for (let result of results) {
                        writer.writeRecord(result);
                    }
                });
            });
        });

    }
}




