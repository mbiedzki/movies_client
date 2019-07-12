import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export class HttpInterceptorService implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        retry(0),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = ''; //for client side full message
          let errorCode = ''; //for server side get status code, for OPTION prefly it will be 0, even if for get it is 401 due to CORS handling
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Błąd aplikacji: ${error.error.message}`;
            window.alert(errorMessage);
            return throwError(errorMessage);
          } else {
            // server-side error
            errorCode = `${error.status}`;
            console.error('Błąd serwera: ' + errorCode)
            return throwError(errorCode);
          }
        })
      )
  }
}
