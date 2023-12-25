import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { ToasterService } from '@app/core/primeng/services/toaster.service';
import { DownloadType } from '@app/model/property';
import {
  ITenantResponse,
  IPropertyPicture,
  IOngoingTenancy,
} from '@app/model/tenant';
import { IUserDetail, OauthService } from '@app/oauth/service/oauth.service';
import { PropertyService } from '@app/service/property.service';
import { TenantService } from '@app/service/tenant.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FileUploadModule } from 'primeng/fileupload';
import { SharedModule } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tenant-user',
    templateUrl: './tenant-user.component.html',
    styleUrls: ['./tenant-user.component.css'],
    standalone: true,
    imports: [
        FormsModule,
        ButtonModule,
        RouterLink,
        DialogModule,
        CheckboxModule,
        SharedModule,
        FileUploadModule,
        ProgressSpinnerModule,
    ],
})
export class TenantUserComponent implements OnInit {
  tenantResponse!: ITenantResponse;

  userdetail: Partial<IUserDetail> = {};

  acceptTerms = false;
  currentId!: number;
  acknowledgeAllUser = false;
  isTenantAllAcknowledgeStaus: boolean | null = null;

  propertyPicture: IPropertyPicture[] = [];
  propertyPictureByTenant: IPropertyPicture[] = [];
  uploadedFileNames: any[] = [];
  uploadedFiles: any[] = [];
  myfiles: any = [];
  ongoingTenancy!: IOngoingTenancy;
  downloadType = DownloadType;
  displayMaximizable2 = false; // for term and condtion
  displayMaximizable = false; // upload pic for tenant

  displayMaximizable1 = false; // property picture View for Tenant

  displayMaximizable3 = false; //  property picture for landlord

  isShowUploadLoader = false;

  constructor(
    private tenantService: TenantService,
    private propertyService: PropertyService,
    private userService: OauthService,
    private router: Router,
    private messageService: ToasterService,
    private sanitizer: DomSanitizer
  ) {
    this.userdetail = this.userService.getUserInfo();
    this.getTenantDetails();
  }

  ngOnInit() {}

  getTenantDetails() {
    // getting tenant detail using model IOngoingTenancy
    this.tenantService
      .getTenantListByTenantId(this.userdetail.userId!)
      .subscribe((ongoingTenant: IOngoingTenancy) => {
        this.ongoingTenancy = ongoingTenant;
        if (
          this.ongoingTenancy.isNewTenant &&
          !this.ongoingTenancy.isAcknowledge
        ) {
          this.displayMaximizable2 = true;
        } else {
          this.getAcknowledgeStatus();
        }
      });
  }

  approve() {
    this.tenantService
      .updateTenantAcknowledge(this.userdetail.userId!)
      .subscribe((res: boolean) => {
        this.ongoingTenancy.isAcknowledge = true;
        this.displayMaximizable2 = false;
        this.getAcknowledgeStatus();
      });
  }

  getAcknowledgeStatus() {
    this.tenantService
      .getOveralAcknowledgeStatusByTenantId(this.userdetail.userId!)
      .subscribe((res) => {
        this.isTenantAllAcknowledgeStaus = res;
      });
  }

  uploadPropertyPictureOption(item: IOngoingTenancy) {
    this.myfiles = [];
    this.uploadedFiles = [];
    this.uploadedFileNames = [];
    this.displayMaximizable = true;
    this.isShowUploadLoader = false;
  }

  validateUploadImage(file: any) {
    const exist = this.uploadedFileNames.find((x) => x.name == file.name);
    if (exist) {
      return;
    }
    if (!file.type.includes('image')) {
      return;
    }

    // Check if file is over 2MB
    if (file.size > 2000000) {
      return;
    }

    // Add file to uploaded files array
    this.uploadedFiles.push(file);
    this.uploadedFileNames.push({ name: file.name });
  }

  onSelect(event: any) {
    for (let file of event.files) {
      this.validateUploadImage(file);
    }
  }

  onRemove(event: any) {
    this.uploadedFileNames = this.uploadedFileNames.filter(
      (x) => x.name != event.file.name
    );
    this.uploadedFiles = this.uploadedFiles.filter((x) => x != event.file);
  }

  onClear(event: any) {
    this.uploadedFiles = [];
    this.uploadedFileNames = [];
  }

  onImageError(event: any) {}

  imageUpload() {
    if (!this.uploadedFiles.length) {
      return;
    }
    let formData = new FormData();

    for (const index in this.uploadedFiles) {
      formData.append(`entity[${index}].id`, '0');

      formData.append(
        `entity[${index}].landlordId`,
        this.ongoingTenancy.landLordId!.toString()
      );

      formData.append(
        `entity[${index}].tenantId`,
        this.ongoingTenancy.tenantId.toString()
      );

      formData.append(
        `entity[${index}].propertyId`,
        this.ongoingTenancy.propertyId.toString()
      );

      formData.append(
        `entity[${index}].imageName`,
        this.uploadedFiles[index].name
      );

      formData.append(`entity[${index}].imageData`, this.uploadedFiles[index]);
    }
    this.isShowUploadLoader = true;
    this.tenantService
      .addPropertyImagesByTenant(formData)
      .subscribe((picByTenant: IPropertyPicture[]) => {
        picByTenant.forEach((element) => {
          this.ongoingTenancy?.propertyPictureByTenant?.push(element);
        });
        this.myfiles = [];
        this.displayMaximizable = false;
        this.isShowUploadLoader = false;
      });
  }

  getPropertyImages(ongoingTenancy: IOngoingTenancy) {
    this.tenantService
      .getPropertyPictureForLandlord(ongoingTenancy.tenantId)
      .subscribe((res: IPropertyPicture[]) => {
        this.displayMaximizable3 = true;
        this.propertyPicture = [];
        res.forEach((element) => {
          element.imageUrl = this.getImageUrl(element.imageData);
          this.propertyPicture.push(element);
        });
      });
  }

  getPropertyImagesTenant() {
    this.tenantService
      .getPropertyPictureForTenant(this.ongoingTenancy.tenantId)
      .subscribe((res: IPropertyPicture[]) => {
        this.displayMaximizable1 = true;
        this.propertyPictureByTenant = [];
        res.forEach((element) => {
          element.imageUrl = this.getImageUrl(element.imageData);
          this.propertyPictureByTenant.push(element);
        });
      });
  }

  getImageUrl(bytes: any): any {
    let objectURL = 'data:image/png;base64,' + bytes;
    const image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    return image;
  }

  downloadFileTenant(type: DownloadType, fileName: string, tenantId: number) {
    if (!fileName) {
      return;
    }
    this.tenantService
      .downloadTenantFile(type, tenantId)
      .subscribe((res: any) => {
        let byteCharacters = atob(res);
        let byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('visibility', 'hidden');
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      });
  }

  downloadFileProperty(
    type: DownloadType,
    fileName: string,
    propertyId: number
  ) {
    if (!fileName) {
      return;
    }
    this.propertyService
      .downloadPropertyFile(type, propertyId)
      .subscribe((res: any) => {
        let byteCharacters = atob(res);
        let byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('visibility', 'hidden');
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      });
  }

  newIssue() {
    this.router.navigate(['user/ticket-create']);
  }

  viewRent(item: IOngoingTenancy) {
    this.router.navigate([`user/rent-portal/${item.tenantId}`]);
  }
}
