import {IPssimisticalLoader} from './IPssimisticalLoader';
import {Promise} from 'es6-promise';

export interface IPssimisticalFileInput {

    //Promise resolves when file is completely read    
    read(loader: IPssimisticalLoader): Promise<void>;  

}