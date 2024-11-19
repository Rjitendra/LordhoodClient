import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ConfirmationService, SharedModule } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import {
  IUserDetail,
  OauthService,
} from '../../../../../oauth/service/oauth.service';
import {
  DownloadType,
  IProperty,
  IUpdateCertificates,
} from '@app/model/property';
import { IDropDown } from '@app/model/model';
import { PropertyService } from '@app/service/property.service';
import { TenantService } from '@app/service/tenant.service';
import { fileValidator, requiredWithTrim } from '@app/model/validators';
import { ToasterService } from '@app/core/primeng/services/toaster.service';
import { LoaderService } from '@app/core/primeng/services/loader.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { NgClass, NgIf, NgSwitch, NgSwitchCase, NgFor, NgSwitchDefault, DatePipe } from '@angular/common';

@Component({
    selector: 'app-add-property',
    templateUrl: './add-property.component.html',
    styleUrls: ['./add-property.component.css'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgClass,
        NgIf,
        AutoCompleteModule,
        CalendarModule,
        ButtonModule,
        TableModule,
        SharedModule,
        TooltipModule,
        OverlayPanelModule,
        NgSwitch,
        NgSwitchCase,
        NgFor,
        NgSwitchDefault,
        DialogModule,
        ProgressSpinnerModule,
        DatePipe,
    ],
})
export class AddPropertyComponent implements OnInit {
  propertyForm!: FormGroup;
  updateCertificateform!: FormGroup;
  userdetail: Partial<IUserDetail> = {};
  properties: IProperty[] = [];
  tenantListByPropertyId: IDropDown[] = [];
  updateCertificates: IUpdateCertificates = {} as IUpdateCertificates;
  seletedProperty: IProperty = {} as IProperty;
  downloadType = DownloadType;
  submitted = false;
  disbaleDeleteButton = false;
  displayMaximizable = false;
  submittedCertificate = false;
  isUpdateCertificatesLoader = false;
  switchValueForOverlayPanel!: string;
  address!: string;
  addressSuggestions: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: PropertyService,
    private userService: OauthService,
    private loaderService: LoaderService,
    private toasterService: ToasterService,
    private tenantService: TenantService,
    private confirmationService: ConfirmationService,
    private http: HttpClient
  ) {
    this.userdetail = this.userService.getUserInfo();
  }

  ngOnInit() {
    this.formInitialize();
    this.getPropertyList(this.userdetail.userId!);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.propertyForm.controls;
  }

  get uc(): { [key: string]: AbstractControl } {
    return this.updateCertificateform.controls;
  }

  private formInitialize() {
    this.propertyForm = this.formBuilder.group({
      nameCtrl: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          requiredWithTrim(),
        ]),
      ],
      addressCtrl: ['', [Validators.required, Validators.maxLength(300)]],

      postCodeCtrl: ['', [Validators.required]],

      profileOfTitleCtrl: ['', [Validators.required, fileValidator]],
      profileOfTitleFileSourceCtrl: ['', [Validators.required]],

      gasSafetyCtrl: ['', [fileValidator]],
      gasSafetyFileSourceCtrl: [''],
      gasSafetyExpiryCtrl: [''],

      energyPerformanceCtrl: ['', [Validators.required, fileValidator]],
      energyPerformanceFileSourceCtrl: ['', [Validators.required]],
      energyPerformanceExpiryCtrl: ['', [Validators.required]],

      eicrCtrl: ['', [Validators.required, fileValidator]],
      eicrCtrlFileSourceCtrl: ['', [Validators.required]],
      eicrExpiryCtrl: ['', [Validators.required]],

      featuresCtrl: [
        '',
        [Validators.required, Validators.maxLength(50), requiredWithTrim()],
      ],
    });

    this.updateCertificateform = this.formBuilder.group(
      {
        gasSafety: ['', [fileValidator]],
        gasSafetyFileSource: [''],
        gasSafetyExpiry: [''],

        energyPerformance: ['', [fileValidator]],
        energyPerformanceFileSource: [''],
        energyPerformanceExpiry: [''],

        eicr: ['', [fileValidator]],
        eicrFileSource: [''],
        eicrExpiry: [''],
      },
      { validator: this.certificateValidator }
    );
    this.onChanges();
  }

  onChanges() {
    this.f['gasSafetyCtrl'].valueChanges.subscribe((val) => {
      const gasSafety = val;
      const gasSafetyExpiry = this.f['gasSafetyExpiryCtrl']?.value;

      if (!gasSafety && !gasSafetyExpiry) {
        this.f['gasSafetyCtrl']?.setErrors(null);
        this.f['gasSafetyExpiryCtrl']?.setErrors(null);
      } else if (!gasSafety && gasSafetyExpiry) {
        this.f['gasSafetyCtrl']?.setErrors({ customRequired: true });
        this.f['gasSafetyExpiryCtrl']?.setErrors(null);
      } else if (gasSafety && !gasSafetyExpiry) {
        this.f['gasSafetyCtrl']?.setErrors(null);
        this.f['gasSafetyExpiryCtrl']?.setErrors({ customRequired: true });
      } else if (gasSafety && gasSafetyExpiry) {
        this.f['gasSafetyExpiryCtrl']?.setErrors(null);
        this.f['gasSafetyCtrl']?.setErrors(null);
      }
    });
    this.f['gasSafetyExpiryCtrl'].valueChanges.subscribe((val) => {
      const gasSafety = this.f['gasSafetyCtrl']?.value;
      const gasSafetyExpiry = val;

      if (!gasSafety && !gasSafetyExpiry) {
        this.f['gasSafetyCtrl']?.setErrors(null);
        this.f['gasSafetyExpiryCtrl']?.setErrors(null);
      } else if (!gasSafety && gasSafetyExpiry) {
        this.f['gasSafetyCtrl']?.setErrors({ customRequired: true });
        this.f['gasSafetyExpiryCtrl']?.setErrors(null);
      } else if (gasSafety && !gasSafetyExpiry) {
        this.f['gasSafetyCtrl']?.setErrors(null);
        this.f['gasSafetyExpiryCtrl']?.setErrors({ customRequired: true });
      } else if (gasSafety && gasSafetyExpiry) {
        this.f['gasSafetyExpiryCtrl']?.setErrors(null);
        this.f['gasSafetyCtrl']?.setErrors(null);
      }
    });
  }

  searchAddresses(event: any) {
    const term = event.query;
    const apiKey = environment.addressKey;
    const apiUrl = `https://api.getAddress.io/autocomplete/${term}?api-key=${apiKey}`;
    const data = {
      all: false,
      template: '{formatted_address}{postcode,, }{postcode}',
      top: 6,
      fuzzy: false,
    };
    this.http
      .post(apiUrl, data)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((res: any) => {
          if (term.length >= 3) {
            return of(res.suggestions);
          } else {
            return of([]);
          }
        })
      )
      .subscribe((res: any) => {
        this.addressSuggestions = res;
      });
  }

  onSelectAddress(event: any) {
    const addressId = event.id;
    const apiKey = environment.addressKey;
    const apiUrl = `https://api.getAddress.io/get/${addressId}?api-key=${apiKey}`;

    this.http.get(apiUrl).subscribe((res: any) => {
      this.propertyForm.patchValue({
        postCodeCtrl: res.postcode,
      });
    });
  }

  getTenantListByPropertyIdOverlayPanel(
    property: IProperty,
    op: any,
    event: any
  ) {
    this.loaderService.show();

    this.tenantService
      .getAllTenantsWithStatusByPropertyId(property.id)
      .subscribe((res: IDropDown[]) => {
        this.tenantListByPropertyId = [];

        // check if res.length==0 means there are no tenant adeed to specific property
        if (res.length) {
          // check if res has false value ,Then then some tenants are pending for approval
          const status = res.filter((x) => x.isActive == false);
          if (!status.length) {
            res.forEach((element) => {
              this.tenantListByPropertyId.push({
                id: element.id,
                name: element.name!,
                isActive: element.isActive,
              });
            });
            this.switchValueForOverlayPanel = 'value1';
          } else {
            this.switchValueForOverlayPanel = 'value2';
          }
        } else {
          this.switchValueForOverlayPanel = 'value3';
        }

        this.loaderService.hide();
        // open panel overlay
        op.toggle(event);
      });
  }

  submit(form: FormGroup) {
    this.submitted = true;

    if (form.valid) {
      const property: IProperty = this.mapFormToObject(form);
      const formData = this.mapObjToFormData(property);
      this.loaderService.show();
      this.service.addProperty(formData).subscribe(
        (response) => {
          this.loaderService.hide();
          this.reset();
          this.getPropertyList(this.userdetail.userId!);
          this.toasterService.showSuccess('Property Added Successfully');
        },
        (error) => {
          this.toasterService.showError(
            "Due to technichal error Property hasn't been added"
          );
        }
      );
    }
  }

  delete(property: IProperty) {
    this.disbaleDeleteButton = true;
    this.service.deleteProperty(property.id).subscribe(
      (res) => {
        if (res) {
          const properties = this.properties.filter((x) => x.id != property.id);
          this.properties = properties;
          this.disbaleDeleteButton = false;
          this.toasterService.showSuccess('Deleted Successfully');
        }
      },
      (error) => {
        this.disbaleDeleteButton = false;
        this.toasterService.showError(error?.error);
        this.loaderService.hide();
      }
    );
  }

  deleteConfirm(property: IProperty, event: any) {
    this.confirmationService.confirm({
      target: event.target,
      icon: 'pi pi-exclamation-triangle',
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      accept: () => {
        this.delete(property);
      },
      reject: () => {},
    });
  }

  reset() {
    this.submitted = false;
    this.propertyForm.reset({
      nameCtrl: '',
      addressCtrl: '',
      postCodeCtrl: '',
      profileOfTitleCtrl: '',
      profileOfTitleFileSourceCtrl: '',

      gasSafetyCtrl: '',
      gasSafetyFileSourceCtrl: '',
      gasSafetyExpiryCtrl: '',

      energyPerformanceCtrl: '',
      energyPerformanceFileSourceCtrl: '',
      energyPerformanceExpiryCtrl: '',

      eicrCtrl: '',
      eicrCtrlFileSourceCtrl: '',
      eicrExpiryCtrl: '',

      featuresCtrl: '',
    });
  }

  onFileChange(event: any, name: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      switch (name) {
        case 'profiletitle':
          this.propertyForm.patchValue({
            profileOfTitleFileSourceCtrl: file,
          });
          if (file.size > 1048576) {
            this.f['profileOfTitleCtrl'].setErrors({
              maxFileSizeExceeded: true,
            });
          } else {
            this.f['profileOfTitleCtrl'].setErrors({
              maxFileSizeExceeded: null,
            });
            this.f['profileOfTitleCtrl'].updateValueAndValidity();
          }

          break;
        case 'gassafety':
          this.propertyForm.patchValue({
            gasSafetyFileSourceCtrl: file,
          });
          if (file.size > 1048576) {
            this.f['gasSafetyCtrl'].setErrors({ maxFileSizeExceeded: true });
          } else {
            this.f['gasSafetyCtrl'].setErrors({ maxFileSizeExceeded: null });
            this.f['gasSafetyCtrl'].updateValueAndValidity();
          }
          break;
        case 'energyperformance':
          this.propertyForm.patchValue({
            energyPerformanceFileSourceCtrl: file,
          });
          if (file.size > 1048576) {
            this.f['energyPerformanceCtrl'].setErrors({
              maxFileSizeExceeded: true,
            });
          } else {
            this.f['energyPerformanceCtrl'].setErrors({
              maxFileSizeExceeded: null,
            });
            this.f['energyPerformanceCtrl'].updateValueAndValidity();
          }
          break;
        case 'eicr':
          this.propertyForm.patchValue({
            eicrCtrlFileSourceCtrl: file,
          });
          if (file.size > 1048576) {
            this.f['eicrCtrl'].setErrors({ maxFileSizeExceeded: true });
          } else {
            this.f['eicrCtrl'].setErrors({ maxFileSizeExceeded: null });
            this.f['eicrCtrl'].updateValueAndValidity();
          }
          break;

        case 'u-eicr':
          this.updateCertificateform.patchValue({
            eicrFileSource: file,
          });
          if (file.size > 1048576) {
            this.uc['eicr'].setErrors({ maxFileSizeExceeded: true });
          } else {
            this.uc['eicr'].setErrors({ maxFileSizeExceeded: null });
            this.uc['eicr'].updateValueAndValidity();
          }
          break;
        case 'u-energyperformance':
          this.updateCertificateform.patchValue({
            energyPerformanceFileSource: file,
          });
          if (file.size > 1048576) {
            this.uc['energyPerformance'].setErrors({
              maxFileSizeExceeded: true,
            });
          } else {
            this.uc['energyPerformance'].setErrors({
              maxFileSizeExceeded: null,
            });
            this.uc['energyPerformance'].updateValueAndValidity();
          }
          break;
        case 'u-gassafety':
          this.updateCertificateform.patchValue({
            gasSafetyFileSource: file,
          });
          if (file.size > 1048576) {
            this.uc['gasSafety'].setErrors({ maxFileSizeExceeded: true });
          } else {
            this.uc['gasSafety'].setErrors({ maxFileSizeExceeded: null });
            this.uc['gasSafety'].updateValueAndValidity();
          }
          break;

        default:
          break;
      }
    } else {
      switch (name) {
        case 'profiletitle':
          this.propertyForm.patchValue({
            profileOfTitleFileSourceCtrl: '',
          });

          break;

        case 'gassafety':
          this.propertyForm.patchValue({
            gasSafetyFileSourceCtrl: '',
          });

          break;
        case 'energyperformance':
          this.propertyForm.patchValue({
            energyPerformanceFileSourceCtrl: '',
          });

          break;
        case 'eicr':
          this.propertyForm.patchValue({
            eicrCtrlFileSourceCtrl: '',
          });

          break;

        case 'u-eicr':
          this.updateCertificateform.patchValue({
            eicrFileSource: '',
          });

          break;
        case 'u-energyperformance':
          this.updateCertificateform.patchValue({
            energyPerformanceFileSource: '',
          });

          break;
        case 'u-gassafety':
          this.updateCertificateform.patchValue({
            gasSafetyFileSource: '',
          });

          break;

        default:
          break;
      }
    }
  }

  getAddres(value: any): string {
    if (typeof value === 'object') {
      return value.address;
    }
    return value.trim();
  }

  mapFormToObject(form: FormGroup): IProperty {
    const obj: IProperty = {
      id: 0,
      landLordId: this.userdetail.userId!,
      name: form.controls['nameCtrl'].value.trim(),
      address: this.getAddres(form.controls['addressCtrl'].value),
      postcode: form.controls['postCodeCtrl'].value,
      profileOfTitleFileName:
        form.controls['profileOfTitleFileSourceCtrl'].value.name,
      profileOfTitleFileData:
        form.controls['profileOfTitleFileSourceCtrl'].value,
      gasSafetyFileName: form.controls['gasSafetyFileSourceCtrl'].value
        ? form.controls['gasSafetyFileSourceCtrl'].value.name
        : '',
      gasSafetyFileData: form.controls['gasSafetyFileSourceCtrl'].value
        ? form.controls['gasSafetyFileSourceCtrl'].value
        : '',
      gasSafetyExpiryDate: form.controls['gasSafetyExpiryCtrl'].value
        ? form.controls['gasSafetyExpiryCtrl'].value
        : '',
      energyPerformanceFileName:
        form.controls['energyPerformanceFileSourceCtrl'].value.name,
      energyPerformanceFileData:
        form.controls['energyPerformanceFileSourceCtrl'].value,
      energyPerformanceExpiryDate:
        form.controls['energyPerformanceExpiryCtrl'].value,
      eICRFileName: form.controls['eicrCtrlFileSourceCtrl'].value.name,
      eICRFileData: form.controls['eicrCtrlFileSourceCtrl'].value,
      eICRExpiryDate: form.controls['eicrExpiryCtrl'].value,
      feature: form.controls['featuresCtrl'].value.trim(),
    };
    return obj;
  }

  mapObjToFormData(property: IProperty): FormData {
    let formData = new FormData();

    formData.append('id', '0');

    formData.append('landlordId', property.landLordId.toString());

    formData.append('name', property.name);

    formData.append('address', property.address);

    formData.append('postcode', property.postcode!);

    formData.append('profileOfTitleFileName', property.profileOfTitleFileName);

    formData.append('profileOfTitleFileData', property.profileOfTitleFileData);

    formData.append('gasSafetyFileName', property.gasSafetyFileName!);

    formData.append('gasSafetyFileData', property.gasSafetyFileData);

    formData.append(
      'gasSafetyExpiryDate',
      property.gasSafetyExpiryDate
        ? new Date(property.gasSafetyExpiryDate).toISOString()
        : ''
    );

    formData.append(
      'energyPerformanceFileName',
      property.energyPerformanceFileName
    );

    formData.append(
      'energyPerformanceFileData',
      property.energyPerformanceFileData
    );

    formData.append(
      'energyPerformanceExpiryDate',
      new Date(property.energyPerformanceExpiryDate!).toISOString()
    );

    formData.append('eICRFileName', property.eICRFileName);

    formData.append('eICRFileData', property.eICRFileData);

    formData.append(
      'eICRExpiryDate',
      new Date(property.eICRExpiryDate!).toISOString()
    );

    formData.append('feature', property.feature);

    return formData;
  }

  getPropertyList(landLordId: number) {
    this.loaderService.show();
    this.service
      .getPropertyList(landLordId)
      .subscribe((response: IProperty[]) => {
        this.properties = response;
        this.loaderService.hide();
      });
  }

  additionalDetail(property: IProperty) {
    this.router.navigate(['landlord/property/additional-detail'], {
      state: { property: property },
    });
  }

  viewDetail(property: IProperty) {
    this.router.navigate(['landlord/property/view-additional-detail'], {
      state: { property: property },
    });
  }

  getClassForDate(date: Date): string {
    const todayDate = new Date();
    const inputDate = new Date(date);

    inputDate.setHours(0, 0, 0, 0); // set time to 00:00:00
    todayDate.setHours(0, 0, 0, 0); // set time to 00:00:00

    const diff = Math.abs(todayDate.getTime() - inputDate.getTime());
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    const today = new Date();
    if (inputDate < todayDate) {
      return 'red_background';
    } else if (diffDays <= 30) {
      return 'amber_background';
    } else {
      return 'green_background';
    }
  }

  downloadFile(type: DownloadType, fileName: string, propertyId: number) {
    this.service
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

  updateCertificate(property: IProperty) {
    this.seletedProperty = property;
    this.displayMaximizable = true;
    this.submittedCertificate = false;
    this.updateCertificateform.reset({
      gasSafety: '',
      gasSafetyFileSource: '',
      gasSafetyExpiry: '',
      energyPerformance: '',
      energyPerformanceFileSource: '',
      energyPerformanceExpiry: '',

      eicr: '',
      eicrFileSource: '',
      eicrExpiry: '',
    });
  }

  updateCertificateForm(updateCertificateform: FormGroup) {
    this.submittedCertificate = true;

    if (
      !this.uc['gasSafetyFileSource'].value &&
      !this.uc['gasSafetyExpiry'].value &&
      !this.uc['energyPerformanceFileSource'].value &&
      !this.uc['energyPerformanceExpiry'].value &&
      !this.uc['eicr'].value &&
      !this.uc['eicrExpiry'].value
    ) {
      return;
    }

    if (updateCertificateform.valid) {
      const obj: IUpdateCertificates = {
        propertyId: this.seletedProperty.id,
        gasSafetyFileName: this.uc['gasSafetyFileSource'].value.name,
        gasSafetyFileData: this.uc['gasSafetyFileSource'].value,
        gasSafetyExpiryDate: this.uc['gasSafetyExpiry'].value,
        energyPerformanceFileName:
          this.uc['energyPerformanceFileSource'].value.name,
        energyPerformanceFileData: this.uc['energyPerformanceFileSource'].value,
        energyPerformanceExpiryDate: this.uc['energyPerformanceExpiry'].value,
        eICRFileName: this.uc['eicrFileSource'].value.name,
        eICRFileData: this.uc['eicrFileSource'].value,
        eICRExpiryDate: this.uc['eicrExpiry'].value,
      };
      const formData = new FormData();
      formData.append('propertyId', obj.propertyId.toString());

      formData.append(
        'energyPerformanceFileName',
        obj.energyPerformanceFileName!
      );

      formData.append(
        'energyPerformanceFileData',
        obj.energyPerformanceFileData ? obj.energyPerformanceFileData : ''
      );

      formData.append(
        'energyPerformanceExpiryDate',
        obj.energyPerformanceExpiryDate
          ? new Date(obj.energyPerformanceExpiryDate!).toISOString()
          : ''
      );

      formData.append('eICRFileName', obj.eICRFileName!);

      formData.append('eICRFileData', obj.eICRFileData ? obj.eICRFileData : '');

      formData.append(
        'eICRExpiryDate',
        obj.eICRExpiryDate ? new Date(obj.eICRExpiryDate!).toISOString() : ''
      );
      formData.append('gasSafetyFileName', obj.gasSafetyFileName!);

      formData.append(
        'gasSafetyFileData',
        obj.gasSafetyFileData ? obj.gasSafetyFileData : ''
      );

      formData.append(
        'gasSafetyExpiryDate',
        obj.gasSafetyExpiryDate
          ? new Date(obj.gasSafetyExpiryDate!).toISOString()
          : ''
      );
      this.isUpdateCertificatesLoader = true;
      this.service.updateCertificates(formData).subscribe((x) => {
        this.isUpdateCertificatesLoader = false;
        this.displayMaximizable = false;
        this.getPropertyList(this.userdetail.userId!);
      });
    }
  }

  certificateValidator(group: FormGroup) {
    const gasSafety = group.get('gasSafety')?.value;
    const gasSafetyExpiry = group.get('gasSafetyExpiry')?.value;
    const energyPerformance = group.get('energyPerformance')?.value;
    const energyPerformanceExpiry = group.get('energyPerformanceExpiry')?.value;
    const eicr = group.get('eicr')?.value;
    const eicrExpiry = group.get('eicrExpiry')?.value;

    if (!gasSafety && !gasSafetyExpiry) {
      group.get('gasSafety')?.setErrors(null);
      group.get('gasSafetyExpiry')?.setErrors(null);
    } else if (!gasSafety && gasSafetyExpiry) {
      group.get('gasSafety')?.setErrors({ customRequired: true });
      group.get('gasSafetyExpiry')?.setErrors(null);
    } else if (gasSafety && !gasSafetyExpiry) {
      group.get('gasSafety')?.setErrors(null);
      group.get('gasSafetyExpiry')?.setErrors({ customRequired: true });
    } else if (gasSafety && gasSafetyExpiry) {
      group.get('gasSafetyExpiry')?.setErrors(null);
      group.get('gasSafety')?.setErrors(null);
    }

    if (!energyPerformance && !energyPerformanceExpiry) {
      group.get('energyPerformance')?.setErrors(null);
      group.get('energyPerformanceExpiry')?.setErrors(null);
    } else if (!energyPerformance && energyPerformanceExpiry) {
      group.get('energyPerformance')?.setErrors({ customRequired: true });
      group.get('energyPerformanceExpiry')?.setErrors(null);
    } else if (energyPerformance && !energyPerformanceExpiry) {
      group.get('energyPerformance')?.setErrors(null);
      group.get('energyPerformanceExpiry')?.setErrors({ customRequired: true });
    } else if (energyPerformance && energyPerformanceExpiry) {
      group.get('energyPerformance')?.setErrors(null);
      group.get('energyPerformanceExpiry')?.setErrors(null);
    }

    if (!eicr && !eicrExpiry) {
      group.get('eicr')?.setErrors(null);
      group.get('eicrExpiry')?.setErrors(null);
    } else if (!eicr && eicrExpiry) {
      group.get('eicr')?.setErrors({ customRequired: true });
      group.get('eicrExpiry')?.setErrors(null);
    } else if (eicr && !eicrExpiry) {
      group.get('eicr')?.setErrors(null);
      group.get('eicrExpiry')?.setErrors({ customRequired: true });
    } else if (eicr && eicrExpiry) {
      group.get('eicr')?.setErrors(null);
      group.get('eicrExpiry')?.setErrors(null);
    }
  }
}
