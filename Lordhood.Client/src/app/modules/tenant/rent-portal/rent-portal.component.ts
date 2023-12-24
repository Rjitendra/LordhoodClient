import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { ToasterService } from '@app/core/primeng/services/toaster.service';
import {
  IAccountLinkResponse,
  IPaymentDetails,
  IPaymentRequest,
} from '@app/model/payment';
import { requiredWithZero } from '@app/model/validators';

import { IUserDetail, OauthService } from '@app/oauth/service/oauth.service';
import { PaymentService } from '@app/service/payment.service';

@Component({
  selector: 'app-rent-portal',
  templateUrl: './rent-portal.component.html',
  styleUrls: ['./rent-portal.component.css'],
})
export class RentPortalComponent implements OnInit {
  paymentDetails: IPaymentDetails[] = [];
  userdetail: Partial<IUserDetail> = {};
  paymentRequest!: IPaymentRequest;
  accountLink!: IAccountLinkResponse;
  mock: any[] = [];
  tenantId!: number;
  cashAmount!: number;
  lateChargeAmount!: number;

  paymentForm!: FormGroup;
  stripe: any;
  cardElement: any;
  amount: any;
  isMakeOnlinePayment = false;
  isSubmitAmount = false;
  paymentHandler: any = null;
  amountForm!: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private userService: OauthService,
    private paymentService: PaymentService,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder
  ) {
    this.userdetail = this.userService.getUserInfo();
    const tenantId = this.route.snapshot.paramMap.get('id');

    if (tenantId) {
      this.tenantId = +tenantId;
    }
  }

  ngOnInit() {
    this.formInitialize();
    this.getRentPaymentDetails();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.amountForm.controls;
  }

  getRentPaymentDetails() {
    this.paymentService
      .getRentPaymentDetailsByTenantId(this.tenantId)
      .subscribe((res: IPaymentDetails[]) => {
        this.paymentDetails = res;
      },(error) => {
        this.toasterService.showError(error.error);
      });
  }

  makeOnlinePayment() {
    this.isMakeOnlinePayment = !this.isMakeOnlinePayment;
    this.isSubmitAmount = false;
    this.amountForm.reset({
      amountControl: 0,
    });
    if (
      this.userdetail.roleName &&
      this.userdetail.roleName == 'Tenant' &&
      this.isMakeOnlinePayment
    ) {
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  onCopy(event: ClipboardEvent) {
    event.preventDefault();
  }

  makePayment(amount: number) {
    const paymentRequest: IPaymentRequest = {
      amount: amount,
      landlorId: 0, // we get landlordid from backend service
      tenantGroup: this.tenantId,
    };
    return this.paymentService.checkOut(paymentRequest).subscribe(
      (response: IAccountLinkResponse) => {
        this.amountForm.reset({
          amountControl: 0,
        });
        this.isSubmitAmount = false;
        this.accountLink = response;
        window.location.href = this.accountLink.url;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  checkout() {
    this.isSubmitAmount = true;
    if (this.amountForm.invalid) {
      return;
    }
    if (!+this.f['amountControl'].value) {
      return;
    }
    const amount = +this.f['amountControl'].value;
    this.makePayment(amount);
  }

  formInitialize() {
    this.amountForm = this.formBuilder.group({
      amountControl: [0, [Validators.required, requiredWithZero()]],
    });
  }
}
