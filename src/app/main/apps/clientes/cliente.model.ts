import { FuseUtils } from '@fuse/utils';

export class Cliente
{
    id: string;
    nombres: string;
    apellidos: string;
    correo: string;
    fechaNacimiento?: Date;
    direccion: string;
    activo: boolean;
    fechaRegistro: Date;
    
    /**
     * Constructor
     *
     * @param cliente
     */
    constructor(cliente)
    {
        {
            this.id = cliente.id || 0;
            this.nombres = cliente.nombres || '';
            this.apellidos = cliente.apellidos || '';
            this.correo = cliente.correo || '';
            this.fechaNacimiento = cliente.fechaNacimiento || null;
            this.direccion = cliente.direccion || '';
            this.activo = cliente.id == null ? true : cliente.activo;
            this.fechaRegistro = cliente.fechaRegistro || new Date();
        }
    }
}
