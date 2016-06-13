import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import {IPssimisticalConfig} from '../core/config/IPssimisticalConfig'


@Component({
    moduleId: module.id,
    selector: 'file-drop-target',
    template:
    `
    <div class="dropzone" (dragover)="handleDraggedOver($event)" (drop)="handleDrop($event)">
        <ng-content></ng-content>
    </div>
    `,
    styles: [
        `
        .dropzone {
            text-align: center;
            height: 200px;
            border-color: black;
            border-style: solid;
            border-width: 2px;
            transition: background-color 0.5s, ease-in;
        }

        .dropzone:hover {
            background-color: cornflowerblue;
        }

`
    ],
    encapsulation: ViewEncapsulation.Native
})
export class FileDropTargetComponent {

    @Output()
    private fileDropped = new EventEmitter<string>();

    constructor() {
    }

    handleDraggedOver(event: DragEvent) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    handleDrop(event: DragEvent) {
        event.stopPropagation();
        event.preventDefault();

        let files:FileList = event.dataTransfer.files; // FileList object.

        // files is a FileList of File objects. List some properties.
        var output = [];
        for (var i = 0, f: File; f = files[i]; i++) {

            let fileReader: FileReader = new FileReader();
            
            fileReader.onload = (event: Event) => {
                this.fileDropped.emit(event.target['result']);
            } 
            fileReader.readAsText(f, 'utf8');
        }
    }
}