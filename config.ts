export interface IPssimisticalConfig {
    inputs: IPssimiscalInput[],
    tables: IPssimisticalTable[]
    
    //TODO: reader
}


export interface IPssimisticalTable {
    columns: IPssimisticalColumn[],
    name: string
}


export interface IPssimiscalInput {
    path: string,
    table: string,
    reader: string
}

export interface IPssimisticalColumn {
    name: string,
    type: string,
    index: boolean
}


