import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { ClientesService } from 'app/main/apps/clientes/clientes.service';
import { FuseAlertDialogComponent } from '@fuse/components/alert-dialog/alert-dialog.component';

@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class ClientesSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedClientes: boolean;
    isIndeterminate: boolean;
    selectedClientes: string[];
    alertDialogRef: MatDialogRef<FuseAlertDialogComponent>;
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
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._clientesService.onSelectedClientesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedClientes => {
                this.selectedClientes = selectedClientes;
                setTimeout(() => {
                    this.hasSelectedClientes = selectedClientes.length > 0;
                    this.isIndeterminate = (selectedClientes.length !== this._clientesService.clientes.length && selectedClientes.length > 0);
                }, 0);
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
     * Select all
     */
    selectAll(): void
    {
        this._clientesService.selectClientes();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._clientesService.deselectClientes();
    }

    /**
     * Delete selected clientes
     */
    deleteSelectedClientes(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Estás seguro de eliminar todos los clientes seleccionados?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this.alertDialogRef = this._matDialog.open(FuseAlertDialogComponent, {
                        disableClose: false
                    });
            
                    this.alertDialogRef.componentInstance.alertMessage = 'Esto estará listo cuando toque realizar el proyecto real.';
                }
                this.confirmDialogRef = null;
            });
    }
}
