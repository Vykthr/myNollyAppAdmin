import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  authenticated: boolean = false;

  constructor(private router: Router){}

  async canActivate() {
    if (!this.authenticated) {
      this.presentLoginModal();
    }
    return this.authenticated;
  }

  
  async presentLoginModal(){
    this.router.navigateByUrl('login');
  }
  
}

