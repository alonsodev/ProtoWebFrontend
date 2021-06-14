import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Cliente } from 'app/main/apps/clientes/cliente.model';

@Component({
    selector     : 'clientes-cliente-form-dialog',
    templateUrl  : './cliente-form.component.html',
    styleUrls    : ['./cliente-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ClientesClienteFormDialogComponent
{
    action: string;
    cliente: Cliente;
    clienteForm: FormGroup;
    dialogTitle: string;
    currentDate: Date = new Date();
    /**
     * Constructor
     *
     * @param {MatDialogRef<ClientesClienteFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ClientesClienteFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Editar Cliente';
            this.cliente = _data.cliente;
        }
        else
        {
            this.dialogTitle = 'Registrar Cliente';
            this.cliente = new Cliente({});
        }

        this.clienteForm = this.createClienteForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create cliente form
     *
     * @returns {FormGroup}
     */
    createClienteForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.cliente.id],
            nombres    : [this.cliente.nombres],
            apellidos: [this.cliente.apellidos],
            correo  : [this.cliente.correo, [Validators.email]],
            fechaNacimiento: [this.cliente.fechaNacimiento],
            direccion : [this.cliente.direccion],
            activo: [this.cliente.activo]
        });
    }
}
