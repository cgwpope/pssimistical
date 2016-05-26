export interface IPssimisticalConfig {
    inputs: IPssimisticalInput[],
    tables: IPssimisticalTable[],
    query: string
    //TODO: reader
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


