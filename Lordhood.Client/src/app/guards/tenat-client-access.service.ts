import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IUserDetail, OauthService } from '@app/oauth/service/oauth.service';
import { Observable } from 'rxjs';
import { TenantService } from '../service/tenant.service';
@Injectable({
  providedIn: 'root',
})
export class TenatClientAccessService {
  userdetail: Partial<IUserDetail> = {};
  constructor(
    private authService: OauthService,
    private router: Router,
    private tenantService: TenantService
  ) {
    this.userdetail = this.authService.getUserInfo();
  }
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
          const result = await this.tenantService
            .getOveralAcknowledgeStatusByTenantId(this.userdetail.userId!)
            .toPromise();
          if (result === undefined) {
            throw new Error('Unexpected response from server');
          }
          return result;
        }
        return false;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}
