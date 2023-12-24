import {
  Component,
OnInit
} from '@angular/core';
import {
  FormBuilder,
 FormGroup,

} from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { ToasterService } from '@app/core/primeng/services/toaster.service';
import { IPaymentDetails } from '@app/model/payment';
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
    private toaster: ToasterService,
    private formBuilder: FormBuilder,
    private toasterService:ToasterService
  ) {
    this.userdetail = this.userService.getUserInfo();
    const tenantId = this.route.snapshot.paramMap.get('id');

    if (tenantId) {
      this.tenantId = +tenantId;
    }
  }

  ngOnInit() {
    this.getRentPaymentDetails();
  }

  getRentPaymentDetails() {
    this.paymentService
      .getRentPaymentDetailsByTenantId(this.tenantId)
      .subscribe((res: IPaymentDetails[]) => {
        this.paymentDetails = res;
      },(error) => {
        this.toasterService.showError(error.error);
      }
    );
  }

  addCashAmount() {
    if (!this.cashAmount) {
      return;
    }
    this.paymentService
      .addRentPayment(this.cashAmount!, this.tenantId, 'Cash')
      .subscribe((res) => {
        this.getRentPaymentDetails();
        this.cashAmount = 0;
      });
  }

  addLateCharge() {
    if (!this.lateChargeAmount) {
      return;
    }
    this.paymentService
      .addLatePaymentCharge(this.lateChargeAmount!, this.tenantId)
      .subscribe((res) => {
        this.getRentPaymentDetails();
        this.lateChargeAmount = 0;
      });
  }

  sendPaymentReminder() {
    this.paymentService.sendPaymentReminder(this.tenantId).subscribe((res) => {
      this.toaster.showSuccess('Payment Reminder sent Successfully.');
    });
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  onCopy(event: ClipboardEvent) {
    event.preventDefault();
  }
}
