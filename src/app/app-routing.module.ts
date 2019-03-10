import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainComponent } from "./main/main.component";
import { UnauthorisedComponent } from "./unauthorised/unauthorised.component";

const routes: Routes = [
  {
    path: "",
    component: MainComponent
  },
  {
    path: "signin-oidc",
    pathMatch: "full",
    redirectTo: ""
  },
  {
    path: "unauthorized",
    pathMatch: "full",
    component: UnauthorisedComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
