import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OauthService } from '@app/oauth/service/oauth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TenatClientGuardService {
  constructor(private authService: OauthService, private router: Router) {}
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.getAsyncGetUserData();
  }
  async getAsyncGetUserData(): Promise<boolean> {
    try {
      const user = await this.authService.getUser();
      if (user && user.access_token) {
        var res = user.profile['roleName'];

        if (res == 'Tenant') {
          this.authService.setUserInfo(user.profile);
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }

      this.router.navigate(['/']);
      return false;
    } catch (error) {
      this.router.navigate(['/']);
      return false;
    }
  }
}
