
TODO:

- User-definied TSV, CSV readers
- Propery type handling for number and date columns
- Remove separate node.js io dependencies from core to permit running in browser
 



modules
- pssimistical-core
    = Config validation
        = Friendly wrapping of JSONschema errors
        = Ensure no sematic violations that cannot be caught be JSONschema
    = Abstract of data store
        = Ensure possible for storage + query engine to be configurable 
    = Table loading
        = Processors for TSV, SCV, PSS Transaction log
        = Type conversion fo alasql primitives
    = Query running
        = Output streaming
- pssimistical-node
    = node.js wrapper for filesystem i/o, error presentation

- pssimistical-ui
    = Angular2 application for browser-based i/o, error presentation



Config Validator
input = parsed config JSON
    -> JSON schema validation
<-- JSON Schema error
    -> Semantic validation
<-- PSSministical error
    -> Config processing
<-- PSSMisiticalConfigWrapper

IPssimisticalConfigValidator
validateConfig(config, onSchemaError(), onSemanticError(), onSuccess() )  (async) 


IPSSMisitcalConfigWrapper
getConfig();
getTableNames();
getColumnsForTable() throws NoSuchTableError;
getTypeForColumn(table, column) throws NoSuchTableError, throws NoSuchColumnError;



IPSSMisitcalDataStoreFactory
buildFromConfig(config): IPSSMisitcalDataStore

IPSSMisitcalDataStore
- init();
- runQuery();
- getTableTableStore(table): IPSSMisitcalTableDataStore  throws NoSuchTable


IPSSMisitcalTableDataStore
- addRecord(record);



Input

IPSSMisitcalInputFactory
buildPSSMisitcalInput(reader) : throws InputCreationFailure


IPSSMisitcalInput
read( IPSSMisitcalLoader ) : throws InputCreationFailure
- Syncronously read a file, with each line provided to callback



Loader
IPSSMisitcalLoaderFactory (IPSSMisitcalDataStoreFactory)
builderLoader(reader) 


IPSSMisitcalLoader(IPSSMisitcalDataStore) 
- readLine(line)
    - Syncronously process the line of a file
- eof();
    - Perform any handling on read completion    


config = core.validateConfig()
dataStore = IPSSMisitcalDataStoreFactory.build(config)
dataStore.init();

For Each config.Reader
    loader IPSSMisitcalLoaderFactory.buildLoader(reader, dataStore)
    input IPSSMisitcalInputFactory.buildPSSMisitcalInput(reader)
    input.read(loader); 


//query output
//TODO: Needs abstraction

For each config.query
    dataStore.runQuery();
    