import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoaderService } from '@app/core/primeng/services/loader.service';
import { ServiceBase } from './servicebase';
import { ILandlordProfile } from '@app/model/landlord';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends ServiceBase {
  constructor(http: HttpClient, private loader: LoaderService) {
    super(http);
  }

  getLandlordProfile(landlordId: number) {
    this.loader.show();
    const url = this.toApiUrl(`Profile/${landlordId}`);
    return this.http
      .get<ILandlordProfile>(url)
      .pipe(finalize(() => this.loader.hide()));
  }

  getStripeAccountLinkStatus() {
    this.loader.show();
    const url = this.toApiUrl(`Payment/stripe/get-accountid-status`);
    return this.http.get<boolean>(url).pipe(finalize(() => this.loader.hide()));
  }
}
