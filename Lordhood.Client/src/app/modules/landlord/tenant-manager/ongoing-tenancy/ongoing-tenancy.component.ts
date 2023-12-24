import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

import {
  IUserDetail,
  OauthService,
} from '../../../../oauth/service/oauth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import {
  IOngoingTenancy,
  IPropertyPicture,
  IUpdateTenantAgreement,
} from '@app/model/tenant';
import { TenantService } from '@app/service/tenant.service';
import { ToasterService } from '@app/core/primeng/services/toaster.service';
import { DownloadType } from '@app/model/property';

@Component({
  selector: 'app-ongoing-tenancy',
  templateUrl: './ongoing-tenancy.component.html',
  styleUrls: ['./ongoing-tenancy.component.css'],
})
export class OngoingTenancyComponent implements OnInit {
  updateAgreemntForm!: FormGroup;

  userdetail: Partial<IUserDetail> = {};
  downloadType = DownloadType;
  ongoingTenancyList: IOngoingTenancy[] = [];
  propertyPicture: IPropertyPicture[] = [];
  propertyPictureByTenant: IPropertyPicture[] = [];
  uploadedFileNames: any[] = [];
  uploadedFiles: any[] = [];
  myfiles: any = [];
  ongoingTenancy!: IOngoingTenancy;
  tenantGroupId!: number;
  displayMaximizable = false;
  displayMaximizable1 = false;
  displayMaximizable2 = false;
  displayMaximizable3 = false;
  isShowUploadLoader = false;
  isSubmittedTenancyAgreement = false;

  constructor(
    private service: TenantService,
    private userService: OauthService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private router: Router,
    private toaster: ToasterService
  ) {
    this.userdetail = this.userService.getUserInfo();
    this.formInitialize();
  }

  ngOnInit() {
    this.getongoingTenancyList();
  }
  getongoingTenancyList() {
    this.service;
    this.service
      .getTenanatList(this.userdetail.userId!)
      .subscribe((ongoingTenancy: IOngoingTenancy[]) => {
        this.ongoingTenancyList = ongoingTenancy;
      });
  }

  private formInitialize() {
    this.updateAgreemntForm = this.formBuilder.group({
      tenancyAgreemenCtrl: ['', [Validators.required, this.fileValidator]],
      tenancyAgreemenSourceCtrl: ['', [Validators.required]],

      rentAmountCtrl: [0, [Validators.required]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.updateAgreemntForm.controls;
  }

  onFileChange(event: any, name: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      switch (name) {
        case 'tenancyAgreement':
          this.updateAgreemntForm.patchValue({
            tenancyAgreemenSourceCtrl: file,
          });
          if (file.size > 1048576) {
            this.f['tenancyAgreemenCtrl'].setErrors({
              maxFileSizeExceeded: true,
            });
          } else {
            this.f['tenancyAgreemenCtrl'].setErrors({
              maxFileSizeExceeded: null,
            });
            this.f['tenancyAgreemenCtrl'].updateValueAndValidity();
          }
      }
    } else {
      switch (name) {
        case 'propertyimages':
          this.updateAgreemntForm.patchValue({
            tenancyAgreemenCtrl: '',
          });
          break;

        default:
          break;
      }
    }
  }

  updateAgreemnt(updateAgreemntForm: FormGroup) {
    this.isSubmittedTenancyAgreement = true;
    if (+this.f['rentAmountCtrl'].value == 0) {
      return;
    }
    if (updateAgreemntForm.valid) {
      const obj: IUpdateTenantAgreement = {
        tenantId: this.tenantGroupId,
        agreementFileName: this.f['tenancyAgreemenSourceCtrl'].value.name,
        agreementFileData: this.f['tenancyAgreemenSourceCtrl'].value,
        rentAmount: this.f['rentAmountCtrl'].value,
      };
      const formData = new FormData();
      formData.append('tenantId', obj.tenantId.toString());
      formData.append('agreementFileName', obj.agreementFileName!.toString());

      formData.append('agreementFileData', obj.agreementFileData!);
      formData.append('rentAmount', obj.rentAmount!.toString());

      this.service.updateAgreement(formData).subscribe((res) => {
        this.toaster.showSuccess('Updated Successfully');
        this.displayMaximizable3 = false;
        this.resetAgreemntForm();
        this.getongoingTenancyList();
      });
    }
  }

  resetAgreemntForm() {
    this.updateAgreemntForm.reset({
      tenancyAgreemenCtrl: '',
      tenancyAgreemenSourceCtrl: '',
      rentAmountCtrl: 0,
    });
  }

  upload(item: IOngoingTenancy) {
    this.myfiles = [];
    this.ongoingTenancy = item;
    this.uploadedFiles = [];
    this.uploadedFileNames = [];
    this.displayMaximizable = true;
  }

  onSelect(event: any) {
    for (let file of event.files) {
      const exist = this.uploadedFileNames.find((x) => x.name == file.name);
      if (!exist && file.type.includes('image')) {
        this.uploadedFiles.push(file);
        this.uploadedFileNames.push({ name: file.name });
      }
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
        this.userdetail.userId!.toString()
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
    this.service
      .addPropertyImages(formData)
      .subscribe((ongoingTenancy: IPropertyPicture[]) => {
        const obj = this.ongoingTenancyList.find(
          (x) =>
            x.landLordId == this.ongoingTenancy.landLordId &&
            x.tenantId == this.ongoingTenancy.tenantId &&
            x.propertyId == this.ongoingTenancy.propertyId
        );

        ongoingTenancy.forEach((element) => {
          obj?.propertyPicture?.push(element);
        });

        this.myfiles = [];
        this.displayMaximizable = false;
        this.isShowUploadLoader = false;
      });
  }

  getPropertyImages(item: IOngoingTenancy) {
    this.service
      .getPropertyPictureForLandlord(item.tenantId)
      .subscribe((res: IPropertyPicture[]) => {
        this.displayMaximizable1 = true;
        this.propertyPicture = [];
        res.forEach((element) => {
          element.imageUrl = this.getImageUrl(element.imageData);
          this.propertyPicture.push(element);
        });
      });
  }

  getPropertyImagesForTenant(item: IOngoingTenancy) {
    this.service
      .getPropertyPictureForTenant(item.tenantId)
      .subscribe((res: IPropertyPicture[]) => {
        this.displayMaximizable2 = true;
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

  issueTracker(item: IOngoingTenancy) {
    // this.router.navigate(['landlord/issue-report'], {
    //   state: { navigationTenantId: item.tenantId },
    // });
    this.router.navigate(['landlord/tenant/issue-tracker']);
  }

  updateAgreement(item: IOngoingTenancy) {
    this.displayMaximizable3 = true;
    this.tenantGroupId = item.tenantId;
    this.resetAgreemntForm();
  }

  viewRent(item: IOngoingTenancy) {
    this.router.navigate([`landlord/rent-portal/${item.tenantId}`]);
  }

  downloadFile(type: DownloadType, fileName: string, tenantId: number) {
    this.service.downloadTenantFile(type, tenantId).subscribe((res: any) => {
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

  fileValidator(control: FormControl): { [key: string]: any } | null {
    const allowedExtensions = /(\.pdf)$/i;
    if (
      !allowedExtensions.exec(control.value) &&
      control.value !== null &&
      control.value !== undefined &&
      control.value !== ''
    ) {
      return { invalidFileFormat: true };
    }
    return null;
  }
}
