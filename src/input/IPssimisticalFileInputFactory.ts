import {IPssimisticalFileInput} from './IPssimisticalFileInput';
import {IPssimisticalInput} from '../config//IPssimisticalConfig';

export interface IPssimisticalFileInputFactory {
    buildInput(input: IPssimisticalInput): IPssimisticalFileInput ;

}