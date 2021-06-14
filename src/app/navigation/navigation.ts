import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Aplicaciones',
        type     : 'group',
        children : [
            {
                id       : 'clientes',
                title    : 'Clientes',
                type     : 'item',
                icon     : 'person',
                url      : '/apps/clientes'
            }
        ]
    }
];
