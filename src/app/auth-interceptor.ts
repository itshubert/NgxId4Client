import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { OidcSecurityService } from "angular-auth-oidc-client";

@Injectable({
  providedIn: "root"
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private oidc: OidcSecurityService
  ) {
  }

  intercept(req: HttpRequest <any>, next: HttpHandler): Observable <HttpEvent<any>> {
    if (req.url === "https://localhost:5010/api/valuesddd") {
        const authReq = req.clone({
            headers: req
                .headers
                .set("Authorization", "Bearer " + this.oidc.getToken())
        });

        return next
            .handle(authReq)
            .pipe(
                tap(),
                catchError(error => this.handleError(error, next, authReq)) as any
            );
    } else {
        return next.handle(req);
    }
  }

  private handleError(error: any, handler: HttpHandler, req: HttpRequest<any>) {
    return throwError(error);
  }

}
