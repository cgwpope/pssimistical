"use strict";
const argparse = require("argparse");
const fs = require('fs');
var ArgumentParser = argparse.ArgumentParser;
var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Argparse example'
});
parser.addArgument(['-f', '--config-file'], {
    help: 'Path to the pssimistical configuration file to use',
    required: true
});
var args = parser.parseArgs();
console.log("Confile file path: " + args.config_file);
fs.exists(args.config_file, (exists) => {
    if (exists) {
        console.log("file does not exists");
        //TODO: Safely do this by reading into the buffer and setting a maximu size
        var configData = fs.readFileSync(args.config_file, { encoding: 'utf8' });
        console.log("Config file contents:\n" + configData);
        try {
            let config = JSON.parse(configData);
            if (!config) {
                console.log("Config file supplies at: " + args.config_file + " does not contain utf-8 encoded JSON pssimistical config");
                return;
            }
            if (!config.tables || config.tables.length == 0) {
                console.log("Config requires at least one table");
                return;
            }
            for (let table of config.tables) {
                if (!table.name || !table.columns || table.columns.length == 0) {
                    console.log("Incomplete table definition");
                    return;
                }
                for (let column of table.columns) {
                    if (!column.name || !column.type) {
                        console.log("Incomplete column definition");
                        return;
                    }
                }
            }
            if (!config.inputs || config.inputs.length == 0) {
                console.log("Config requires a least one input");
                return;
            }
            for (let input of config.inputs) {
                if (!input.path || !input.table || !input.reader) {
                    console.log("Incomplete input definition");
                    return;
                }
            }
        }
        catch (parseError) {
            console.log("Config file supplies at: " + args.config_file + " does not contain utf-8 encoded JSON pssimistical config");
            throw parseError;
        }
    }
    else {
        console.log("file does not exists");
    }
});
//# sourceMappingURL=pssimistical.js.map