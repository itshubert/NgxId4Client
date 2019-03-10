import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import {
  AuthModule,
  OidcSecurityService,
  OpenIDImplicitFlowConfiguration,
  OidcConfigService,
  AuthWellKnownEndpoints
} from "angular-auth-oidc-client";
import { AuthInterceptor } from "./auth-interceptor";
import { MainComponent } from "./main/main.component";
import { UnauthorisedComponent } from "./unauthorised/unauthorised.component";


export function initializeApp(oidcConfigService: OidcConfigService) {
  return () => oidcConfigService.load_using_stsServer("http://localhost:5000");
}

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    UnauthorisedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot(),
  ],
  providers: [
    OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [OidcConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(
    private oidcConfigService: OidcConfigService,
    private oidcSecurityService: OidcSecurityService
  ) {

    this.oidcConfigService.onConfigurationLoaded.subscribe(() => {

      const originUrl = "http://localhost:4200";
      const authUrl = "http://localhost:5000";

      this.oidcConfigService.clientConfiguration = {
        stsServer: authUrl,
        client_id: "resClient",
        redirect_url: originUrl + "/signin-oidc" ,
        response_type: "id_token token",
        scope: "openid profile api1",
        post_logout_redirect_uri: originUrl + "/signout-callback-oidc",
        start_checksession: false,
        silent_renew: false,
        forbidden_route: authUrl + "forbidden",
        unauthorized_route: authUrl + "unauthorized",
        log_console_warning_active: true,
        log_console_debug_active: false,
        max_id_token_iat_offset_allowed_in_seconds: 15
      };
      const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
      openIDImplicitFlowConfiguration.stsServer = authUrl;
      openIDImplicitFlowConfiguration.client_id = "spa";
      openIDImplicitFlowConfiguration.redirect_url = originUrl + "/signin-oidc";
      openIDImplicitFlowConfiguration.post_logout_redirect_uri = originUrl + "/signout-callback-oidc";
      openIDImplicitFlowConfiguration.response_type = "id_token token";
      openIDImplicitFlowConfiguration.scope = "openid profile api1";
      openIDImplicitFlowConfiguration.forbidden_route = "/forbidden";
      openIDImplicitFlowConfiguration.unauthorized_route = "/unauthorized";
      openIDImplicitFlowConfiguration.auto_userinfo = true;
      openIDImplicitFlowConfiguration.log_console_warning_active = true;
      openIDImplicitFlowConfiguration.log_console_debug_active = true;
      openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 10;
      openIDImplicitFlowConfiguration.silent_renew = false;
      openIDImplicitFlowConfiguration.auto_userinfo = false;
      openIDImplicitFlowConfiguration.auto_clean_state_after_authentication = true;
      openIDImplicitFlowConfiguration.resource = "";
      
      const authWellKnownEndpoints = new AuthWellKnownEndpoints();
      // authWellKnownEndpoints.issuer = authUrl;

      // authWellKnownEndpoints.jwks_uri = authUrl + "/.well-known/openid-configuration/jwks";
      // authWellKnownEndpoints.authorization_endpoint = authUrl + "/connect/authorize";
      // authWellKnownEndpoints.token_endpoint = authUrl + "/connect/token";
      // authWellKnownEndpoints.userinfo_endpoint = authUrl + "/connect/userinfo";
      // authWellKnownEndpoints.end_session_endpoint = authUrl + "/connect/endsession";
      // authWellKnownEndpoints.check_session_iframe = authUrl + "/connect/checksession";
      // authWellKnownEndpoints.revocation_endpoint = authUrl + "/connect/revocation";
      // authWellKnownEndpoints.introspection_endpoint = authUrl + "/connect/introspect";
      // authWellKnownEndpoints.introspection_endpoint = authUrl + "/connect/introspect";

      authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);
      this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);

    });

  }

}


