import argparse = require("argparse");
import fs = require('fs');
import {IPssimisticalConfig, IPssimisticalTable, IPssimisticalColumn} from './config';
var alasql = require('alasql');
var Validator = require('jsonschema').Validator;

var ArgumentParser = argparse.ArgumentParser;
var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Argparse example'
});


parser.addArgument(
    ['-f', '--config-file'],
    {
        help: 'Path to the pssimistical configuration file to use',
        required: true
    }
);

var args = parser.parseArgs();
console.log("Confile file path: " + args.config_file);



if (fs.existsSync(args.config_file)) {

    //TODO: Safely do this by reading into the buffer and setting a maximu size
    let config: IPssimisticalConfig = <IPssimisticalConfig>JSON.parse(fs.readFileSync(args.config_file, { encoding: 'utf8' }));
    let schema = JSON.parse(fs.readFileSync("pssimistical.schema.json", { encoding: 'utf8' }));

    var v = new Validator();
    console.log(v.validate(config, schema));


    //TODO: More semantic checks:
    //No duplicate tables
    //No whitespace in column names or names that match invalid column name regex
    //Input: table must be defined


    config.tables.forEach((table: IPssimisticalTable) => {
        //reduce column list to table definition
        let columnsDefinition = table.columns.reduce((value: string, column: IPssimisticalColumn, index: number) => {
            return "";
        }, "");
    });

} else {
    console.log("file does not exists");
}



