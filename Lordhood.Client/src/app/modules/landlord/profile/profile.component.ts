import { Component, OnInit } from '@angular/core';
import { ILandlordProfile } from '@app/model/landlord';
import { IAccountLinkResponse, IPaymentRequest } from '@app/model/payment';
import { IUserDetail, OauthService } from '@app/oauth/service/oauth.service';
import { PaymentService } from '@app/service/payment.service';
import { ProfileService } from '@app/service/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userdetail: Partial<IUserDetail> = {};
  // Account ID input field for linking an existing account
  accountId: string = '';

  // Account link URL returned from Stripe API
  accountLink!: IAccountLinkResponse;
  landlordProfile: ILandlordProfile = {
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
    postcode: '',
    isUpdatedAccount: false,
    dateCreated: null,
    dateExpiry: null,
    isRenew: null,
  };

  connected: boolean = false;

  constructor(
    private profileService: ProfileService,
    private paymentService: PaymentService,
    private userService: OauthService
  ) {
    this.userdetail = this.userService.getUserInfo();
  }

  ngOnInit() {
    this.profileService
      .getLandlordProfile(this.userdetail.userId!)
      .subscribe((res: ILandlordProfile) => {
        this.landlordProfile = res;
      });
  }

  // Submit handler for creating a new account
  createAccount() {
    this.paymentService.createStripeAccount().subscribe((res: string) => {
      this.accountId = res;
      this.linkAccount(this.accountId);
    });
  }

  // Submit handler for linking an existing account
  linkAccount(accountId: string) {
    this.paymentService
      .createAccountLink(accountId)
      .subscribe((res: IAccountLinkResponse) => {
        this.accountLink = res;
        window.location.href = this.accountLink.url;
      });
  }
  checkOutToAdmin() {
    const paymentRequest: IPaymentRequest = {
      amount: 40,
      landlorId: this.userdetail.userId!,
      tenantGroup: 0,
    };
    return this.paymentService.checkOutToAdmin(paymentRequest).subscribe(
      (response: IAccountLinkResponse) => {
        this.accountLink = response;
        window.location.href = this.accountLink.url;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

}
