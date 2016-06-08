import {IPssimisticalLoader} from './IPssimisticalLoader';


export interface IPssimisticalFileInput {

    //Promise resolves when file is completely read    
    read(loader: IPssimisticalLoader): Promise<void>;  

}