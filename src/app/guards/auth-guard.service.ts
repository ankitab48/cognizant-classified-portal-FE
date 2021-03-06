import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})

//to protect routes
export class AuthGuard implements CanActivate {

    constructor(private _authService: AuthService, private _router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let token: string | null = localStorage.getItem("token")

        return new Observable<boolean>(obs => {
            if (token != null)

                //authenticate the token
                this._authService.isAuthenticated(token).subscribe(
                    data => {
                        //if invalid reroute to login page
                        if (!data.valid) {
                            console.log('fail');
                            this._router.navigateByUrl('/login');
                            obs.next(false);
                        }
                        else {
                            obs.next(true);
                        }
                    }
                );
            else {
                this._router.navigateByUrl("/login");
                obs.next(false);
            }
        });
    }

}


//For login and home page after logging in
@Injectable({
    providedIn: 'root'
})
export class IsSignedInGuard implements CanActivate {
    // here you can inject your auth service to check that user is signed in or not
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
            if (this.authService.isSignedIn()) {
                this.router.navigateByUrl('/main');
                return false;
            }else
                return true;
        }
}