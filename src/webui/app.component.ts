import { Component } from '@angular/core';
import {Router, Routes, ROUTER_DIRECTIVES} from '@angular/router';
import {MATERIAL_DIRECTIVES} from 'ng2-material';
import {SelectConfigComponent} from './select-config.component'
import {SelectInputsComponent} from './select-inputs.component'
import {RunReportComponent} from './run-report.component'
import {ReportOutputComponent} from './report-output.component'
import {HomeComponent} from './home.component'
import {PssimisticalService} from './pssimistical.service'

@Component({
      moduleId: module.id,
    selector: 'my-app',
    //do inline - avoid build process for now
    template:
    `
    <div> Hello World </div>
    <router-outlet></router-outlet>
  `,

    directives: [MATERIAL_DIRECTIVES, ROUTER_DIRECTIVES],
    
    providers: [PssimisticalService]

})
    @Routes([
    {
        path: "/",
        component: HomeComponent
    },


    {
        path: "/select-config",
        component: SelectConfigComponent
    },

    {
        path: "/select-inputs",
        component: SelectInputsComponent
    },

    {
        path: "/run-report",
        component: RunReportComponent
    },
    {
        path: "/report-output",
        component: ReportOutputComponent
    }
])
export class AppComponent {
    constructor(private router: Router){
        
    }
}