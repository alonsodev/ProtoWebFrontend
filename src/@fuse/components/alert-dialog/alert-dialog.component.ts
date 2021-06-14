import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector   : 'fuse-alert-dialog',
    templateUrl: './alert-dialog.component.html',
    styleUrls  : ['./alert-dialog.component.scss']
})
export class FuseAlertDialogComponent
{
    public alertMessage: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<FuseAlertDialogComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<FuseAlertDialogComponent>
    )
    {
    }

}
