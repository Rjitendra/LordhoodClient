import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OauthService } from 'src/app/oauth/service/oauth.service';

@Injectable({
  providedIn: 'root',
})
export class OauthGuardService {
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
          this.authService.setUserInfo(user.profile);
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      } else {
        await this.authService.login();
        return false;
      }
    } catch (error) {
      await this.authService.login();
      return false;
    }
  }
}
