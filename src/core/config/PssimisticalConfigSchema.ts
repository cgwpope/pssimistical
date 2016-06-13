
export default `
{
    "id": "TODO",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "description": "Schema for Pssimistical config",
    "type": "object",
    "required": [
        "tables",
        "inputs"
    ],
    "properties": {
        "tables": {
            "type": "array",
            "minItems": 1,
            "items": {
                "type": "object",
                "required": [
                    "name",
                    "columns"
                ],
                "properties": {
                    "name": {
                        "type": "string",
                        "pattern": "^[a-zA-Z_][a-zA-Z0-9_]*$"
                    },
                    "columns": {
                        "type": "array",
                        "minItems": 1,
                        "items": {
                            "type": "object",
                            "required": [
                                "name",
                                "type"
                            ],
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "pattern": "^[a-zA-Z_][a-zA-Z0-9_]*$"
                                },
                                "type": {
                                    "enum": [
                                        "number",
                                        "text",
                                        "date"
                                    ]
                                },
                                "index": {
                                    "type": "boolean"
                                }
                            }
                        }
                    }
                }
            }
        },
        "readers": {
            "type": "object",
            "patternProperties": {
                "\w+": {
                    "type": "object",
                    "required": [
                        "type",
                        "columns"
                    ],
                    "properties": {
                        "type": {
                            "type": "string"
                        },
                        "readerProperties": {
                            "type": "object"
                        },
                        "columnMappings" : {
                            "type": "object"
                        },
                        "columns": {
                            "type": "array",
                            "minItems": 1,
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "inputs": {
            "type": "array",
            "minItems": 1,
            "items": {
                "type": "object",
                "required": [
                    "path",
                    "table",
                    "reader"
                ],
                "properties": {
                    "path": {
                        "type": "string"
                    },
                    "table": {
                        "type": "string"
                    },
                    "reader": {
                        "type": "string"
                    }
                }
            }
        },
        "query": {
            "type": "object",
            "required": [
                "sql"            
            ],
            "properties": {
                "sql": {"type": "string"},
                "outputFile": {"type": "string"}
            }
        }
    }
}
`;