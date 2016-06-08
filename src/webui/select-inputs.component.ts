
import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {IPssimisticalConfigWrapper} from '../core/config/IPssimisticalConfigWrapper'
import {PssimisticalService} from './pssimistical.service'


@Component({
    moduleId: module.id,
    template:
    `
    <div>
    Select inputs
    
    <div *ngFor="let input of service.getConfig().getConfig().inputs">
        <!-- component -->
        <div>Input file required: {{input.path}}
    <div>

    
    </div>
    `,

    directives: [ROUTER_DIRECTIVES]
})


export class SelectInputsComponent {

    constructor(private service: PssimisticalService) {

    }


}