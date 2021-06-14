import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { FuseAlertDialogComponent } from '@fuse/components/alert-dialog/alert-dialog.component';

@NgModule({
    declarations: [
        FuseAlertDialogComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule
    ],
    entryComponents: [
        FuseAlertDialogComponent
    ],
})
export class FuseAlertDialogModule
{
}
