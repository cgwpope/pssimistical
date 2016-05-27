export interface IPssimisticalConfig {
    inputs: IPssimisticalInput[],
    tables: IPssimisticalTable[],
    query: string,
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
    linesToSkip: number,
    columns: string[]
}


