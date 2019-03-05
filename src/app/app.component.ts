import { Component, OnInit } from "@angular/core";
import { OidcSecurityService } from "angular-auth-oidc-client";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "client";

  constructor(private oidc: OidcSecurityService) {
  }

  ngOnInit() {
  }

  login() {
    this.oidc.authorize();
  }
}