
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertDialogComponent } from '@fuse/components/alert-dialog/alert-dialog.component';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    confirmDialogRef: MatDialogRef<FuseAlertDialogComponent>;
  constructor(
    private router: Router,
    public _matDialog: MatDialog
  ) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((data) => {
       /* if (data.type !== 0) {
          this.spinner.hide();
        }*/
      }),
      catchError((data: HttpErrorResponse) => {debugger;
        switch (data.status) {
          case 400:
            this.confirmDialogRef = this._matDialog.open(FuseAlertDialogComponent, {
                disableClose: false
            });
    
            this.confirmDialogRef.componentInstance.alertMessage = data.error.mensaje;
    
            
            break;
          default:
            this.confirmDialogRef = this._matDialog.open(FuseAlertDialogComponent, {
                disableClose: false
            });
            this.confirmDialogRef.componentInstance.alertMessage = "Error desconocido";
            break;
        }
        return throwError(data);
      })
    );
  }

}
