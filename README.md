
Pssimistical
============

Pssimitical is a data processing tool to support enhanced data extraction and reporting from PS Suite-generated data. 

Pssimitical is designed to support an open ecosystem, providing capabilities to consumers of all skill levels, from non-technical consumers to programmers.


Design
------

Pssimistical's design philosophy is built around a few simple principles
- Provide a configuration-driven toolchain to support extension though ever-more complex configurations.
- Ensure built-in support for the most common types of data extraction from PS Suite
- Ensure reporting can be done using a familliliar and well-established techniques



Modules
-------

Pssimistical's core has 3 main areas of functionality.
- Configuration loading and validation
- Implementation of a data store using an in-memory SQL-compliant database, alasql
- Implementation of the file reading and parsing logic for necessary data input types, such as PS Suite specific data, or arbitrary CSV or TSV data


In addition, modules are provided to adapt to running in various environments, such as from command-line through a NodeJS runner, or from a browse, using an HTML/Javascript front-end.
- pssimistical-node, a node.js wrapper for filesystem i/o, error presentation
- pssimistical-ui, anngular2 application for browser-based i/o, error presentation



Design Details


Config Validation
-----------------
input 
-   parsed config JSON
    
action
-   Perform JSON schema validation and semantic validation

outputs
-   JSON Schema error for syntactic or schema-level problems with config, or
-   PSSministical error for sematic errors with configuration, or
-   PSSMisiticalConfigWrapper for simplified access to members of the configucation


Rough sketch of involved types and methods

    IPssimisticalConfigValidator
    validateConfig(config, onSchemaError(), onSemanticError(), onSuccess() )  (async) 


    IPSSMisitcalConfigWrapper
    getConfig();
    getTableNames();
    getColumnsForTable() throws NoSuchTableError;
    getTypeForColumn(table, column) throws NoSuchTableError, throws NoSuchColumnError;


Data store
----------
input 
-   validated configuration
    
action
-   Prepare data store to receive loaded inputs

outputs
-   Active data store


    IPSSMisitcalDataStoreFactory
        buildFromConfig(config): IPSSMisitcalDataStore

    IPSSMisitcalDataStore
        init();
        runQuery(); 
        getTableTableStore(table): IPSSMisitcalTableDataStore  throws NoSuchTable


    IPSSMisitcalTableDataStore
        addRecord(record);



Input abstraction
-----------------

Abstraction of the creation of a reader required by a pssiitical config. The supporting environment (command line or browser) must provider the factory implementation to Pssimisitcal core.

    IPSSMisitcalInputFactory
        buildPSSMisitcalInput(reader) : throws InputCreationFailure


    IPSSMisitcalInput
        //Syncronously read a file, with each line provided to callback
        read( IPSSMisitcalLoader ) : throws InputCreationFailure 
    


Loader
-----------------

Used to extract records from provided input and add to data store.

    IPSSMisitcalLoaderFactory (IPSSMisitcalDataStoreFactory)
        builderLoader(reader) 


    IPSSMisitcalLoader(IPSSMisitcalDataStore) 
        //Syncronously process the line of a file
        readLine(line) 
        
        //Perform any handling on read completion
        eof();     


Expected flow of Pssimitical's core

    config = core.validateConfig()
    dataStore = IPSSMisitcalDataStoreFactory.build(config)
    dataStore.init();

    For Each config.Reader
        loader IPSSMisitcalLoaderFactory.buildLoader(reader, dataStore)
        input IPSSMisitcalInputFactory.buildPSSMisitcalInput(reader)
        input.read(loader); 

    For each config.query
        dataStore.runQuery();

TODO
----
- Support multiple input types for built-in formats (CSV, TSV, Transaction log - what else?)
- Support CSV output
- Propery type handling for number and date columns
- Use Promise to better manage async execution.
- Support progress-handling callbacks to visually show progress
- Verify reader column names against pattern in schema, but allow spaces
- Handle mapping column names for txlog-format as a reader property (eg. "patient #":"patient_id"
    - Where should mapping occur? Reader or input?
    - Probbaly reader. It implicitly occurs for TSV/CSV, based on ordering of columns.  
- Move pre-defined readers to separate config read at runtime
- Update documentation to list available readerProperties
- Better abstraction/handling of error reporting


