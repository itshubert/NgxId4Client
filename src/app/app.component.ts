import { Component, OnInit } from "@angular/core";
import { OidcSecurityService, AuthorizationResult } from "angular-auth-oidc-client";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "client";
  values: any;
  authorised = false;

  constructor(private oidc: OidcSecurityService, private http: HttpClient) {
    if(this.oidc.moduleSetup) {
      this.doCallbackLogicIfRequired();
    } else {
      this.oidc.onModuleSetup.subscribe(() => {
        this.doCallbackLogicIfRequired();
      });
    }

    this.oidc.onAuthorizationResult.subscribe(
      (authorizationResult: AuthorizationResult) => {
          // this.onAuthorizationResultComplete(authorizationResult);
      });
  }

  // private onAuthorizationResultComplete(authorizationResult: AuthorizationResult) {
  //   if (authorizationResult.authorizationState === AuthorizationState.unauthorized) {
  //     if (window.location.hash) {
  //       this.oidc.logoff();
  //     } else if (window.parent) {
  //         this.login();
  //     }
  //   } else {
  //     this.setAuthorised(true);
  //   }
  // }

  ngOnInit() {
  }

  login() {
    this.oidc.authorize();
  }

  getValues() {
    const authString = "Bearer " + this.oidc.getToken();
    const h = new HttpHeaders({"Authorization": authString});
    const config = { headers: h };
    const options = this.createOptions({}, config);
    this.http.get("https://localhost:5010/api/values", {headers: h})
      .subscribe(response => {
        console.log(response);
      });
  }

  private doCallbackLogicIfRequired() {
    if (window.location.hash) {
        this.oidc.authorizedCallback();
    }
  }

  private createOptions(p, config) {
    return {
      params: p,
      headers: config ? config.headers : {}
    };
  }
}