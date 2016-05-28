export interface IPssimisticalConfig {
    inputs: IPssimisticalInput[],
    tables: IPssimisticalTable[],
    query: IPssimisticalQuery,
    readers: IPssimiticalReaderHolder
}


export interface IPssimiticalReaderHolder {
    [name: string]: IPssimisticalReader;
}

export interface IPssimisticalTable {
    columns: IPssimisticalColumn[],
    name: string
}


export interface IPssimisticalInput {
    path: string,
    table: string,
    reader: string
}

export interface IPssimisticalColumn {
    name: string,
    type: string,
    index: boolean
}

export interface IPssimisticalReader {
    type: string,
    readerProperties: IPssimisticalReaderProperties,
    columns: string[]
}

export interface IPssimisticalReaderProperties {
    [key: string]: any;
}

export interface IPssimisticalQuery {
    sql: string,
    outputFile: string
    outputFormat: string
}


