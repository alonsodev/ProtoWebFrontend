import { Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { ClientesService } from 'app/main/apps/clientes/clientes.service';
import { ClientesClienteFormDialogComponent } from 'app/main/apps/clientes/cliente-form/cliente-form.component';
import { Cliente } from '../cliente.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector     : 'clientes-cliente-list',
    templateUrl  : './cliente-list.component.html',
    styleUrls    : ['./cliente-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ClientesClienteListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    clientes: any;
    user: any;
    clientsResult: Array<Cliente> = new Array<Cliente>();
    dataSource: MatTableDataSource<Cliente>;
    displayedColumns = ['checkbox', 'nombres', 'apellidos', 'correo', 'fechaNacimiento', 'direccion', 'activo', 'fechaRegistro', 'buttons'];
    selectedClientes: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ClientesService} _clientesService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _clientesService: ClientesService,
        public _matDialog: MatDialog
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.dataSource = new MatTableDataSource(this.clientsResult);
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {        
        this.paginator._intl.itemsPerPageLabel = 'items por página';

        this.paginator.page.subscribe((pager) => {
            //this.params.pager = pager;
            this._clientesService.updatePager(pager);

        });
        this._clientesService.onClientesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(clientes => {
                this.dataSource = new MatTableDataSource<Cliente>(clientes);

                this.checkboxes = {};
                clientes.map(cliente => {
                    this.checkboxes[cliente.id] = false;
                });
            });

        this._clientesService.onSelectedClientesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedClientes => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedClientes.includes(id);
                }
                this.selectedClientes = selectedClientes;
            });

            this._clientesService.onPagerChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(pager => {
                this.paginator.length = pager.length;
                this.paginator.pageIndex = pager.pageIndex;
                this.paginator.pageSize = pager.pageSize;

            });

        this._clientesService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._clientesService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._clientesService.deselectClientes();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Edit cliente
     *
     * @param cliente
     */
    editCliente(row): void
    {
        this._clientesService.getClient(row.id).subscribe((cliente: any) => {
            this.openEditClient(cliente);
        });

        
    }

    openEditClient(cliente):void{
        this.dialogRef = this._matDialog.open(ClientesClienteFormDialogComponent, {
            panelClass: 'cliente-form-dialog',
            data      : {
                cliente: cliente,
                action : 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch ( actionType )
                {
                    
                    /**
                     * Save
                     */
                    case 'save':

                        this._clientesService.updateCliente(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteCliente(cliente);

                        break;
                }
            });
    }

    /**
     * Delete Cliente
     */
    deleteCliente(cliente): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Tu estás seguro de eliminar el cliente?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._clientesService.deleteCliente(cliente);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param clienteId
     */
    onSelectedChange(clienteId): void
    {
        this._clientesService.toggleSelectedCliente(clienteId);
    }

    public getActivoTexto(cliente){
        return cliente.activo ? "Sí" : "No";
    }

}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {ClientesService} _clientesService
     */
    constructor(
        private _clientesService: ClientesService
    )
    {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._clientesService.onClientesChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
