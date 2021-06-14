import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
    {
        path        : '',
        loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule)
    },
    {
        path        : 'clientes',
        loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule)
    }
];

@NgModule({
    imports     : [
        RouterModule.forChild(routes),
        FuseSharedModule
    ]
})
export class AppsModule
{
}
