import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from '@app/core/primeng/services/toaster.service';
import { IAccountLinkResponse } from '@app/model/payment';
import { OauthService } from '@app/oauth/service/oauth.service';
import { PaymentService } from '@app/service/payment.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-stripe-account',
    templateUrl: './stripe-account.component.html',
    styleUrls: ['./stripe-account.component.css'],
    standalone: true,
    imports: [FormsModule, ButtonModule],
})
export class StripeAccountComponent implements OnInit {
  // Account ID input field for linking an existing account
  accountId: string = '';

  // Account link URL returned from Stripe API
  accountLink!: IAccountLinkResponse;
  constructor(
    private route: ActivatedRoute,
    private userService: OauthService,
    private paymentService: PaymentService,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService
  ) {}

  ngOnInit() {}
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

}
