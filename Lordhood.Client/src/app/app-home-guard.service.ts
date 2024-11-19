import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OauthService } from '@app/oauth/service/oauth.service';

@Injectable({
  providedIn: 'root',
})
export class HomeGuardService {
  constructor(private authService: OauthService, private router: Router) {}
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.getAsyncGetUserData();
  }
  async getAsyncGetUserData(): Promise<boolean> {
    try {
      const user = await this.authService.getUser();
      if (user && user.access_token) {
        var res = user.profile['roleName'];
        if (res == 'Landlord') {
          this.router.navigate(['landlord']);
          return false;
        }
        if (res == 'Tenant') {
          this.router.navigate(['user']);
          return false;
        }
        return true;
      } else {
        return true;
      }
    } catch (error) {
      return true;
    }
  }
}
