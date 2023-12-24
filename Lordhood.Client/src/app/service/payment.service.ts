import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoaderService } from '@app/core/primeng/services/loader.service';
import { finalize } from 'rxjs';
import {
  IAccountLinkResponse,
  IPaymentDetails,
  IPaymentRequest,
  IRentPaymentHistory,
  IRentReport,
  IRentReportFilter,
} from '../model/payment';
import { ServiceBase } from './servicebase';

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends ServiceBase {
  constructor(http: HttpClient, private loader: LoaderService) {
    super(http);
  }

  getRentPaymentDetailsByTenantId(tenantId: number) {
    this.loader.show();
    const url = this.toApiUrl(`Payment/detailsByTenant/${tenantId}`);
    return this.http
      .get<IPaymentDetails[]>(url)
      .pipe(finalize(() => this.loader.hide()));
  }

  addLatePaymentCharge(amount: number, tenantGroup: number) {
    this.loader.show();
    const url = this.toApiUrl(
      `Payment/latePaymentCharge/${amount}/${tenantGroup}`
    );
    return this.http.get<boolean>(url).pipe(finalize(() => this.loader.hide()));
  }

  addRentPayment(amount: number, tenantGroup: number, paymentMode: string) {
    this.loader.show();
    const url = this.toApiUrl(
      `Payment/addRentAmount/${amount}/${tenantGroup}/${paymentMode}`
    );
    return this.http.get<boolean>(url).pipe(finalize(() => this.loader.hide()));
  }

  sendPaymentReminder(tenantGroup: number) {
    this.loader.show();
    const url = this.toApiUrl(`Payment/paymentReminder/${tenantGroup}`);
    return this.http.get<boolean>(url).pipe(finalize(() => this.loader.hide()));
  }

  checkOut(paymentRequest: IPaymentRequest) {
    this.loader.show();
    const url = this.toApiUrl(`Payment/stripe/checkOut`);
    return this.http
      .post<IAccountLinkResponse>(url, paymentRequest)
      .pipe(finalize(() => this.loader.hide()));
  }

  checkOutToAdmin(paymentRequest: IPaymentRequest) {
    this.loader.show();
    const url = this.toApiUrl(`Payment/stripe/checkOutToAdmin`);
    return this.http
      .post<IAccountLinkResponse>(url, paymentRequest)
      .pipe(finalize(() => this.loader.hide()));
  }

  getRentReport(obj: IRentReportFilter) {
    this.loader.show();
    const url = this.toApiUrl(`Payment/GetRentReport`);
    return this.http
      .post<IRentReport[]>(url, obj)
      .pipe(finalize(() => this.loader.hide()));
  }

  getRentPaymentHistory(tenantId: number, rentDate: Date) {
    this.loader.show();
    const url = this.toApiUrl(
      `Payment/getRentPaymentHistoryAsync/${tenantId}/${rentDate}`
    );
    return this.http.get<IRentPaymentHistory[]>(url).pipe(finalize(() => this.loader.hide()));
  }

  createStripeAccount() {
    this.loader.show();
    const url = this.toApiUrl(`Payment/stripe/create-account`);
    return this.http.get<string>(url).pipe(finalize(() => this.loader.hide()));
  }

  createAccountLink(connectedAccountId: string) {
    this.loader.show();
    const url = this.toApiUrl(
      `Payment/stripe/create-account-link/${connectedAccountId}`
    );
    return this.http
      .get<IAccountLinkResponse>(url)
      .pipe(finalize(() => this.loader.hide()));
  }

  checkout() {
    this.loader.show();
    const url = this.toApiUrl(`Payment/stripe/checkOut`);
    return this.http
      .get<IAccountLinkResponse>(url)
      .pipe(finalize(() => this.loader.hide()));
  }

  getAccountIdStatus() {
    this.loader.show();
    const url = this.toApiUrl(`Payment/stripe/get-accountid-status`);
    return this.http.get<boolean>(url).pipe(finalize(() => this.loader.hide()));
  }
}
