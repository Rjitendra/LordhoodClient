import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import { IDropDown } from '../model/model';
import {
  IOngoingTenancy,
  IPropertyPicture,
  IROC,
  ITenantFilter,
  ITenantResponse,
} from '../model/tenant';
import { ServiceBase } from './servicebase';
import { LoaderService } from '@app/core/primeng/services/loader.service';
import { DownloadType } from '@app/model/property';

@Injectable({
  providedIn: 'root',
})
export class TenantService extends ServiceBase {
  constructor(http: HttpClient, private loaderService: LoaderService) {
    super(http);
  }
  addTenant(formdata: FormData) {
    this.loaderService.show();
    const url = this.toApiUrl('Tenant');
    return this.http.post<number>(url, formdata).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }

  sendConfirmEmail(filter: ITenantFilter) {
    this.loaderService.show();
    const url = this.toApiUrl('Tenant/sendOnboardingEmail');
    return this.http.post<number>(url, filter).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }

  getTenantList(landlordId: number) {
    this.loaderService.show();
    const url = this.toApiUrl('Tenant/' + landlordId);
    return this.http.get<ITenantResponse[]>(url).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }

  getTenantListByTenantId(tenatId: number) {
    this.loaderService.show();
    const url = this.toApiUrl('Tenant/tenantByTenantId/' + tenatId);
    return this.http.get<IOngoingTenancy>(url).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }

  getTenantListByPropertyId(propertyId: number) {
    const url = this.toApiUrl('Tenant/getTenantsByPropertyId/' + propertyId);
    return this.http.get<ITenantResponse[]>(url).pipe(finalize(() => {}));
  }

  getPrimaryTenantDetailByPropertyId(propertyId: number) {
    this.loaderService.show();
    const url = this.toApiUrl(
      'Tenant/getPrimaryTenantDetailByPropertyId/' + propertyId
    );
    return this.http.get<ITenantResponse>(url).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }

  getAllTenantsWithStatusByPropertyId(propertyId: number) {
    const url = this.toApiUrl(
      `Tenant/tenantsWithStatusByPropertyId/${propertyId}`
    );
    return this.http.get<IDropDown[]>(url).pipe(finalize(() => {}));
  }

  updateTenantAcknowledge(tenantId: number) {
    this.loaderService.show();
    const url = this.toApiUrl('Tenant/updateTenantAcknowledge/' + tenantId);
    return this.http.get<boolean>(url).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }

  updateAgreement(formData: FormData) {
    const url = this.toApiUrl('Tenant/updateAgreement/');
    return this.http.post<boolean>(url, formData);
  }

  getOveralAcknowledgeStatusByTenantId(tenantId: number) {
    this.loaderService.show();
    const url = this.toApiUrl('Tenant/getOveralAcknowledgeStatus/' + tenantId);
    return this.http.get<boolean>(url).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }

  getOngoingTenantList(landlordId: number) {
    const url = this.toApiUrl('Tenant/' + landlordId);
    return this.http.get<any>(url);
  }

  getTenant(id: number) {
    const url = this.toApiUrl('Tenant/Detail/' + id);
    return this.http.get<any>(url);
  }

  updateTenant(formdata: FormData) {
    const url = this.toApiUrl('Tenant/Update');
    return this.http.post<number>(url, formdata);
  }

  deleteTenant(id: number) {
    const url = this.toApiUrl('Tenant/delete/' + id);
    return this.http.get<number>(url);
  }

  getTenanatList(id: number) {
    this.loaderService.show();
    return this.http
      .get<IOngoingTenancy[]>(this.toApiUrl(`Tenant/onGoingTenancy/${id}`))
      .pipe(finalize(() => this.loaderService.hide()));
  }

  addPropertyImages(formdata: FormData) {
    this.loaderService.show();
    const url = this.toApiUrl('Tenant/addPropertyImages');
    return this.http
      .post<any[]>(url, formdata)
      .pipe(finalize(() => this.loaderService.hide()));
  }

  addPropertyImagesByTenant(formdata: FormData) {
    this.loaderService.show();
    const url = this.toApiUrl('Tenant/addPropertyImagesByTenant');
    return this.http
      .post<any[]>(url, formdata)
      .pipe(finalize(() => this.loaderService.hide()));
  }

  getROC(ROC: IROC) {
    this.loaderService.show();
    const url = this.toApiUrl('Tenant/acknowledgementPdf');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers, responseType: 'blob' as 'json' };
    return this.http
      .post<any>(url, ROC, options)
      .pipe(finalize(() => this.loaderService.hide()));
  }

  updateTenantEmail(email: string, tenantId: number) {
    const url = this.toApiUrl(`Tenant/updateTenantEmail/${email}/${tenantId}`);
    return this.http.get<boolean>(url);
  }

  checkDuplicateEmail(email: string) {
    const url = this.toApiUrl(`Tenant/checkDuplicateEmail/${email}`);
    return this.http.get<boolean>(url);
  }

  downloadTenantFile(type: DownloadType, tenantId: number) {
    this.loaderService.show();
    const url = this.toApiUrl(`Tenant/download-file/${type}/${tenantId}`);
    return this.http.get<any>(url).pipe(finalize(() => this.loaderService.hide()));
  }

  getPropertyPictureForLandlord(tenantId: number) {
    this.loaderService.show();
    const url = this.toApiUrl(`Tenant/propertyPictureForLandlord/${tenantId}`);
    return this.http.get<IPropertyPicture[]>(url).pipe(finalize(() => this.loaderService.hide()));
  }

  getPropertyPictureForTenant(tenantId: number) {
    this.loaderService.show();
    const url = this.toApiUrl(`Tenant/propertyPictureForTenant/${tenantId}`);
    return this.http.get<IPropertyPicture[]>(url).pipe(finalize(() => this.loaderService.hide()));
  }
}
