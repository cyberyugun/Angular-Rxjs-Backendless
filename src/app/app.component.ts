import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { AuthenticationService } from "./service";
import { User, Role } from "./model";

@Component({ selector: "app-root", templateUrl: "app.component.html" })
export class AppComponent {
  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Instructor;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }
}
