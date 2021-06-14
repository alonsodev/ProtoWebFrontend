import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { ClientesComponent } from 'app/main/apps/clientes/clientes.component';
import { ClientesService } from 'app/main/apps/clientes/clientes.service';
import { ClientesClienteListComponent } from 'app/main/apps/clientes/cliente-list/cliente-list.component';
import { ClientesSelectedBarComponent } from 'app/main/apps/clientes/selected-bar/selected-bar.component';
import { ClientesMainSidebarComponent } from 'app/main/apps/clientes/sidebars/main/main.component';
import { ClientesClienteFormDialogComponent } from 'app/main/apps/clientes/cliente-form/cliente-form.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseAlertDialogModule } from '@fuse/components/alert-dialog/alert-dialog.module';
registerLocaleData(localeEs);
const routes: Routes = [
    {
        path     : '**',
        component: ClientesComponent,
        resolve  : {
            clientes: ClientesService
        }
    }
];

@NgModule({
    declarations   : [
        ClientesComponent,
        ClientesClienteListComponent,
        ClientesSelectedBarComponent,
        ClientesMainSidebarComponent,
        ClientesClienteFormDialogComponent
    ],
    imports        : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatTableModule,
        MatPaginatorModule,
        MatToolbarModule,
        MatSlideToggleModule,
        MatDialogModule,
        
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
    ],
    providers      : [
        ClientesService,
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        DatePipe,
    ],
    entryComponents: [
        ClientesClienteFormDialogComponent
    ]
})
export class ClientesModule
{
}
