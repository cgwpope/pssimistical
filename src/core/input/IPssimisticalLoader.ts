
export interface IPssimisticalLoader {
    
    /** - Syncronously process the line of a file  */
    onReadLine(line: string)
    
    /**  Perform any handling on read completion */
    onEOF();
    
}