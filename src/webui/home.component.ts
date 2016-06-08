import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';


@Component({
          moduleId: module.id,
      selector: 'home-component',

    template: 
    `
    <div>
    Welcome to PSSimistical WebUI!
    
    <a [routerLink]="['/select-config']">Select a configuration</a>
    </div>
    `,
    
    directives: [ROUTER_DIRECTIVES]
})
export class HomeComponent {
    
}