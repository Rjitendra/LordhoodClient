import { Injectable } from '@angular/core';
import { ProfileService } from '@app/service/profile.service';
import { ModalService } from '@app/modules/landlord/modal.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AddTenantGuardService {
  constructor(
    private router: Router,
    private profileService: ProfileService,
    public dialogService: ModalService
  ) {}
  canActivate(): Promise<boolean> {
    const isDirectAccess = !this.router.navigated;
    return this.getAsyncGetAccountIdExist()
      .then((result) => {
        if (!result) {
          // Reject the promise to indicate access denied
          this.dialogService.openAccessDeniedModal();
          if (isDirectAccess) {
            // Redirect to the desired screen
            this.router.navigate(['landlord/dashboard']); // Replace '/dashboard' with the desired route
          }
          return false;
        }

        // Resolve the promise to indicate access granted
        return true;
      })
      .catch(() => {
        // Reject the promise to indicate access denied
        return false;
      });
  }

  async getAsyncGetAccountIdExist(): Promise<boolean> {
    try {
      const result = await this.profileService
        .getStripeAccountLinkStatus()
        .toPromise();
      if (result === undefined) {
        throw new Error('Unexpected response from server');
      }
      return result;
    } catch (error) {
      return false;
    }
  }
}
