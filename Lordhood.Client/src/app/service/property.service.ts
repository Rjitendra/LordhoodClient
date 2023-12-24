import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import { DownloadType, IBoard, IProperty } from '../model/property';
import { ServiceBase } from './servicebase';
import { LoaderService } from '@app/core/primeng/services/loader.service';

@Injectable({
  providedIn: 'root',
})
export class PropertyService extends ServiceBase {
  constructor(http: HttpClient, private loader: LoaderService) {
    super(http);
  }

  addProperty(formdata: FormData) {
    const url = this.toApiUrl('Property');
    return this.http.post<number>(url, formdata);
  }

  getPropertyList(landlordId: number) {
    const url = this.toApiUrl(`Property/${landlordId}`);
    return this.http.get<IProperty[]>(url);
  }

  getProperty(id: number) {
    const url = this.toApiUrl(`Property/Detail/${id}`);
    return this.http.get<any>(url);
  }

  updateProperty(formdata: FormData) {
    this.loader.show();
    const url = this.toApiUrl('Property/Update');
    return this.http
      .post<IProperty>(url, formdata)
      .pipe(finalize(() => this.loader.hide()));
  }

  deleteProperty(id: number) {
    this.loader.show();
    const url = this.toApiUrl(`Property/delete/${id}`);
    return this.http.get<number>(url).pipe(finalize(() => this.loader.hide()));
  }

  updateCertificates(formdata: FormData) {
    this.loader.show();
    const url = this.toApiUrl('Property/updateCertificates');
    return this.http
      .post<number>(url, formdata)
      .pipe(finalize(() => this.loader.hide()));
  }

  downloadPropertyFile(type: DownloadType, propertyId: number) {
    this.loader.show();
    const url = this.toApiUrl(`Property/download-file/${type}/${propertyId}`);
    return this.http.get<any>(url).pipe(finalize(() => this.loader.hide()));
  }
  
  getBoard(landlordId: number) {
    this.loader.show();
    const url = this.toApiUrl(`Property/myBoard/${landlordId}`);
    return this.http
      .get<IBoard[]>(url)
      .pipe(finalize(() => this.loader.hide()));
  }
}
