import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Cliente } from 'app/main/apps/clientes/cliente.model';
import { environment } from 'environments/environment';

@Injectable()
export class ClientesService implements Resolve<any>
{
    onClientesChanged: BehaviorSubject<any>;
    onSelectedClientesChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    onPagerChanged: BehaviorSubject<any>;
    onSorterChanged: BehaviorSubject<any>;
    clientes: Cliente[];
    user: any;
    selectedClientes: string[] = [];

    searchText: string;
    filterBy: string;
    pager: {
        length: 0,
        pageIndex: 0,
        pageSize: 10,
        previousPageIndex: 0
    };
    sorter: {
        active: "",
        direction: ""
    };
    params = {
        pager: {
            length: 0,
            pageIndex: 0,
            pageSize: 10,
            previousPageIndex: 0
        },
        pagina: 1,
        tamanio: 10,
        sorter: {
            active: "",
            direction: ""
        },
        filter: "",
        estado: null
    };
    initSorter() {
        this.sorter = {
            active: "",
            direction: ""
        };
    }
    initPager() {
        this.pager = {
            length: 0,
            pageIndex: 0,
            pageSize: 10,
            previousPageIndex: 0
        };
    }
    initParams() {
        this.params = {
            pager: this.pager,
            pagina:1,
            tamanio:10,
            sorter: this.sorter,
            filter: "",
            estado: null
        }

    }

    cleanAllParameters() {
        this.searchText = "";

        this.initSorter();
        this.initPager();
        this.initParams();

    }

    private uri: string = `${environment.api_url}/cliente`;
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onClientesChanged = new BehaviorSubject([]);
        this.onSelectedClientesChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onPagerChanged = new BehaviorSubject([]);
        this.onSorterChanged = new BehaviorSubject([]);
        this.onFilterChanged = new Subject();
        this.cleanAllParameters();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getClientes()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getClientes();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getClientes();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get clientes
     *
     * @returns {Promise<any>}
     */
    getClientes(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.deselectClientes();
            this.initParams();

            this.params.filter = this.searchText;
            this.params.pager = this.pager;
            this.params.estado = this.filterBy == "activo" ? true :  this.filterBy == "inactivo" ? false : null;

            let estado = this.params.estado != null ? `estado=${this.params.estado}` : "";

            this._httpClient.get(`${this.uri}/paginado?pagina=${this.pager.pageIndex+1}&tamanio=${this.pager.pageSize}&buscarPor=${this.params.filter}&${estado}`)
                    .subscribe((response: any) => {
                        this.clientes = response.listado;
                        this.clientes = this.clientes.map(cliente => {
                            return new Cliente(cliente);
                        });

                        this.onClientesChanged.next(this.clientes);

                        /*let params_pager = {
                            length: response.page.totalElements,
                            pageIndex: response.page.pageNumber,
                            pageSize: response.page.size
                        }*/
                        let params_pager = {
                            length: response.total,
                            pageIndex: this.pager.pageIndex,
                            pageSize: this.pager.pageSize
                        }
                        this.onPagerChanged.next(params_pager);

                        resolve(this.clientes);
                    }, reject);
        });
    }

    updatePager(pager): Promise<any> {
        this.pager = pager;
        return new Promise((resolve, reject) => {
            this.getClientes().then(clients => {
                resolve(clients);
            }, reject);
        });

    }

    deselectClients(): void {
        this.selectedClientes = [];
        // Trigger the next event

        this.onSelectedClientesChanged.next(this.selectedClientes);
    }

    /**
     * Get user data
     *
     * @returns {Promise<any>}
     */
    getUserData(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get('api/clientes-user/5725a6802d10e277a0f35724')
                    .subscribe((response: any) => {
                        this.user = response;
                        this.onUserDataChanged.next(this.user);
                        resolve(this.user);
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected cliente by id
     *
     * @param id
     */
    toggleSelectedCliente(id): void
    {
        // First, check if we already have that cliente as selected...
        if ( this.selectedClientes.length > 0 )
        {
            const index = this.selectedClientes.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedClientes.splice(index, 1);

                // Trigger the next event
                this.onSelectedClientesChanged.next(this.selectedClientes);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedClientes.push(id);

        // Trigger the next event
        this.onSelectedClientesChanged.next(this.selectedClientes);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedClientes.length > 0 )
        {
            this.deselectClientes();
        }
        else
        {
            this.selectClientes();
        }
    }

    /**
     * Select clientes
     *
     * @param filterParameter
     * @param filterValue
     */
    selectClientes(filterParameter?, filterValue?): void
    {
        this.selectedClientes = [];

        // If there is no filter, select all clientes
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedClientes = [];
            this.clientes.map(cliente => {
                this.selectedClientes.push(cliente.id);
            });
        }

        // Trigger the next event
        this.onSelectedClientesChanged.next(this.selectedClientes);
    }

    /**
     * Update cliente
     *
     * @param cliente
     * @returns {Promise<any>}
     */
    updateCliente(cliente): Promise<any>
    {
        return new Promise((resolve, reject) => {

            this._httpClient.put(`${this.uri}`, {...cliente})
                .subscribe(response => {
                    this.getClientes();
                    resolve(response);
                });
        });
    }

    /**
     * Add cliente
     *
     * @param cliente
     * @returns {Promise<any>}
     */
     addCliente(cliente): Promise<any>
     {
         return new Promise((resolve, reject) => {
 
             this._httpClient.post(`${this.uri}`, {...cliente})
                 .subscribe(response => {
                     this.getClientes();
                     resolve(response);
                 });
         });
     }

    /**
     * Deselect clientes
     */
    deselectClientes(): void
    {
        this.selectedClientes = [];

        // Trigger the next event
        this.onSelectedClientesChanged.next(this.selectedClientes);
    }

    /**
     * Delete cliente
     *
     * @param cliente
     */
    deleteCliente(cliente): void
    {
        new Promise((resolve, reject) => {
            //this._httpClient.post('api/clients-clients/' + client.clientId, {...client})
            this._httpClient.delete(`${this.uri}/${cliente.id}`)
                .subscribe(response => {
                    this.getClientes();
                    resolve(response);
                });
        });
    }

    /**
     * Delete selected clientes
     */
    deleteSelectedClientes(): void
    {
        
        this.deselectClientes();
    }

    getClient(clientId): Observable<any> {
        return this._httpClient.get(`${this.uri}/${clientId}`);
    }
}
