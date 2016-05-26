import {IPssimisticalLoader} from './IPssimisticalLoader';

export interface IPssimisticalFileInput {
    
    /** - Syncronously read a file, with each line provided to callback */
    read(loader: IPssimisticalLoader, callback: () => void ); //throws InputCreationFailure  
     

}