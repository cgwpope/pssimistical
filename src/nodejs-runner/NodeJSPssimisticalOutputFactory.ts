import {IPssimisticalOutputFactory} from '../core/output/IPssimisticalOutputFactory'
import {IPssimisticalOutput} from '../core/output/IPssimisticalOutput'

import {IPssimisticalConfig} from '../core/config/IPssimisticalConfig'
import {IPssimisticalConfigWrapper} from '../core/config/IPssimisticalConfigWrapper'

export class NodeJSPssimisticalOutputFactory implements IPssimisticalOutputFactory {
    buildOutput(config: IPssimisticalConfigWrapper) {
        if(config.getConfig().query.outputFile){
            return new NodeJSPssimisiticalFileOutput(config.getConfig().query.outputFile);    
        } else {
            return new NodeJSPssimisiticalConsoleOutput();
        }
        
    }
}


class NodeJSPssimisiticalFileOutput implements  IPssimisticalOutput {
    
    private _writeStream;
    
    constructor(filePath: string){
        var fs = require("fs");
        this._writeStream = fs.createWriteStream(filePath); //default encodig option is utf-8. Perfect!
    }
    
    writeLine(line: string) {
        this._writeStream.write(line);
    }
}

class NodeJSPssimisiticalConsoleOutput implements  IPssimisticalOutput {
    writeLine(line: string) {
        console.log(line.trim());        
    }
}