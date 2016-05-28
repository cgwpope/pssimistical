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

export class PssimisticalCore {

    constructor(private _fileInputFactory: IPssimisticalFileInputFactory, private _fileOutputFactory: IPssimisticalOutputFactory) {

    }

    public run(config: IPssimisticalConfig) {
        let validator: IPssimisticalConfigValidator = new PssministicalConfigValidatorFactory().buildConfigValidator();
        let configWrapper: IPssimisticalConfigWrapper = validator.validateConfig(config, this.onSchemaError, this.onSemanticError);

        let dataStore: IPssimisticalDataStore = new PssimisticalDataStoreFactory().buildFromConfig(configWrapper);
        dataStore.init();
        let loaderFactory: PssimisticalLoaderFactory = new PssimisticalLoaderFactory(dataStore);
        let writerFactory: PssimisticalWriterFactory = new PssimisticalWriterFactory(this._fileOutputFactory);


        let numTablesComplete = 0;
        configWrapper.getConfig().inputs.forEach((input: IPssimisticalInput) => {
            let fileInput: IPssimisticalFileInput = this._fileInputFactory.buildInput(input);

            //have file input. no
            let loader: IPssimisticalLoader = loaderFactory.builderLoader(configWrapper, input.reader, configWrapper.getTableForName(input.table));
            fileInput.read(loader, () => {
                if(++numTablesComplete == configWrapper.getConfig().inputs.length){
                    //run the queries
                    var results = dataStore.runQuery(configWrapper.getConfig().query.sql);
                    let writer: IPssimisticalWriter = writerFactory.buildWriter(configWrapper);
                    for(let result of results){
                        writer.writeRecord(result);
                    }
                }
            });
        });

        

    }

    //TODO: Abstract Error reporting for browser vs. nodejs
    onSchemaError(jsonSchemaValidationResult: any) {
        console.log("Schema Validation Error");
        console.log(jsonSchemaValidationResult);
        process.exit(-1);
    }

    //TODO: Abstract Error reporting for browser vs. nodejs
    onSemanticError(message: string) {
        console.log("Config Semantic Error:");
        console.log(message);
        process.exit(-1);
    }


}




