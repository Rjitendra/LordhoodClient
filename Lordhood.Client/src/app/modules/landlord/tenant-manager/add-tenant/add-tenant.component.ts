import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { IUserDetail, OauthService } from '@app/oauth/service/oauth.service';

import moment from 'moment';
import * as saveAs from 'file-saver';
import { ConfirmEventType, ConfirmationService, SharedModule } from 'primeng/api';
import { IDropDown } from '@app/model/model';
import { IProperty } from '@app/model/property';
import {
  ITenant,
  ITenantResponse,
  ITenantUser,
  ITenantFilter,
  IROC,
  IPropertyPicture,
} from '@app/model/tenant';
import { requiredWithTrim } from '@app/model/validators';
import { PropertyService } from '@app/service/property.service';
import { TenantService } from '@app/service/tenant.service';
import { LoaderService } from '@app/core/primeng/services/loader.service';
import { ToasterService } from '@app/core/primeng/services/toaster.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { NgClass, NgIf, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-add-tenant',
    templateUrl: './add-tenant.component.html',
    styleUrls: ['./add-tenant.component.css'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgClass,
        NgIf,
        CalendarModule,
        DropdownModule,
        CurrencyMaskModule,
        InputSwitchModule,
        ButtonModule,
        TableModule,
        SharedModule,
        TooltipModule,
        DialogModule,
        ProgressSpinnerModule,
        CurrencyPipe,
        DatePipe,
    ],
})
export class AddTenantComponent implements OnInit {
  tenant!: ITenant;
  tenantList: ITenantResponse[] = [];
  primaryTenantDetails: ITenantResponse | null = null;
  tenantIdForEmailEdit: number | null = null;
  form!: FormGroup;
  tenantForm!: FormGroup;
  tenantEmailForm!: FormGroup;
  userdetail: Partial<IUserDetail> = {};

  submitted = false;
  submittedTenant = false;
  submittedEmailTenant = false;
  displayMaximizableEmailEdit = false;
  isShowenantEmailLoader = false;
  propertyDropDown: IDropDown[] = [];
  properties: IProperty[] = [];
  tenantUser: ITenantUser[] = [];
  minDateTenancyStratDate!: Date;
  minDateTenancyDueDate!: Date;
  maxDateTenancyDueDate!: Date;
  maxFiles = 10;
  maxFileSize = 2097152;
  validFileTypes = ['image/jpeg', 'image/png', 'image/gif'];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: TenantService,
    private userService: OauthService,
    private propertyService: PropertyService,
    private loaderService: LoaderService,
    private toasterService: ToasterService,
    private confirmationService: ConfirmationService
  ) {
    this.userdetail = this.userService.getUserInfo();
    this.getPropertyList(this.userdetail.userId!);
    this.getTenantList();
  }

  ngOnInit() {
    this.formInitialize();
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let nextMonth = month === 11 ? 0 : month + 1;
    let nextYear = nextMonth === 0 ? year + 1 : year;
    // minimum date to start from the first day of the current month
    // this.minDateTenancyStratDate = new Date(year, month, 1);
    this.minDateTenancyStratDate = new Date(year, month, today.getDate());
  }

  formInitialize() {
    this.form = this.formBuilder.group({
      propertyImagesCtrl: [''],
      propertyImagesSourceCtrl: [
        [],
        [
          this.validateMaxFiles.bind(this),
          this.validateMaxFileSize.bind(this),
          this.validateFileType.bind(this),
        ],
      ],

      nameCtrl: [
        '',
        [Validators.required, Validators.maxLength(50), requiredWithTrim()],
      ],
      emailCtrl: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.email,
          requiredWithTrim(),
        ],
      ],
      dobCtrl: ['', [Validators.required]],
      occupationCtrl: [
        '',
        [Validators.required, Validators.maxLength(50), requiredWithTrim()],
      ],

      backgroundCheckCtrl: ['', [this.fileValidator]],
      backgroundCheckSourceCtrl: [''],

      rentAmountCtrl: [null, [Validators.required]],
      rentDueDateCtrl: ['', [Validators.required]],
      tenacyStartDateCtrl: ['', [Validators.required]],
      primaryCtrl: [true, [this.customRequiredValidator]],
      isNewTenantCtrl: [true],
      propertyCtrl: [null, [Validators.required]],
    });

    this.tenantForm = this.formBuilder.group({
      tenancyAgreemenCtrl: ['', [Validators.required, this.fileValidator]],
      tenancyAgreemenSourceCtrl: ['', [Validators.required]],

      rentGuideCtrl: ['', [Validators.required, this.fileValidator]],
      rentGuideSourceCtrl: ['', [Validators.required]],

      depositCertificateCtrl: ['', [Validators.required]],
    });
    this.tenantEmailForm = this.formBuilder.group({
      emailCtrl: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.email,
          requiredWithTrim(),
        ],
      ],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  get t(): { [key: string]: AbstractControl } {
    return this.tenantForm.controls;
  }

  get te(): { [key: string]: AbstractControl } {
    return this.tenantEmailForm.controls;
  }

  changeNewTenantSwitch() {
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let nextMonth = month === 11 ? 0 : month + 1;
    this.f['tenacyStartDateCtrl'].reset();
    this.f['rentDueDateCtrl'].reset();

    if (this.f['isNewTenantCtrl'].value) {
      this.minDateTenancyStratDate = new Date(year, month, today.getDate());
    } else {
      this.minDateTenancyStratDate = new Date(year, month, 1);
    }
  }

  resetTenant() {
    this.tenantUser = [];
    this.form.reset({
      propertyImagesCtrl: '',
      propertyImagesSourceCtrl: [],

      nameCtrl: '',
      emailCtrl: '',
      dobCtrl: '',
      occupationCtrl: '',
      isNewTenantCtrl: true,
      backgroundCheckCtrl: '',
      backgroundCheckSourceCtrl: '',

      rentAmountCtrl: null,
      rentDueDateCtrl: '',
      tenacyStartDateCtrl: '',
      primaryCtrl: true,
      propertyCtrl: null,
    });

    if (this.primaryTenantDetails?.tenantGroup) {
      this.primaryTenantDetails = null;
    }

    this.submitted = false;
    this.submittedTenant = false;

    this.tenantForm.reset({
      tenancyAgreemenCtrl: '',
      tenancyAgreemenSourceCtrl: '',
      rentGuideCtrl: '',
      rentGuideSourceCtrl: '',
      depositCertificateCtrl: '',
    });

    this.f['emailCtrl'].setValidators([
      Validators.required,
      Validators.maxLength(50),
      Validators.email,
      requiredWithTrim(),
    ]);
    this.f['emailCtrl'].updateValueAndValidity();

    this.f['rentAmountCtrl'].enable();
    this.f['rentDueDateCtrl'].enable();
    this.f['propertyCtrl'].enable();
    this.f['primaryCtrl'].enable();
    this.f['propertyImagesCtrl'].enable();
    this.f['tenacyStartDateCtrl'].enable();
    this.f['isNewTenantCtrl'].enable();

    this.t['tenancyAgreemenCtrl'].enable();
    this.t['rentGuideCtrl'].enable();
    this.t['depositCertificateCtrl'].enable();

    this.t['tenancyAgreemenCtrl'].setValidators([
      Validators.required,
      this.fileValidator,
    ]);
    this.t['tenancyAgreemenCtrl'].updateValueAndValidity();
    this.t['rentGuideCtrl'].setValidators([
      Validators.required,
      this.fileValidator,
    ]);
    this.t['rentGuideCtrl'].updateValueAndValidity();
    this.t['depositCertificateCtrl'].setValidators([Validators.required]);
  }

  onChanges(): void {
    const val = this.f['tenacyStartDateCtrl'].value;
    if (!val) {
      return;
    }
    const rentDueDate = moment(val).add(1, 'months').toDate(); // Add one month to the tenancy start date
    this.f['rentDueDateCtrl'].setValue(rentDueDate);
    this.minDateTenancyDueDate = moment(val).add(1, 'days').toDate();

    this.maxDateTenancyDueDate = moment(val)
      .add(2, 'months')
      .endOf('month')
      .toDate();
  }

  /**
   * WE CAN MODIFY IT BY SEPARATE API CALL WHICH GIVE ONLY PROPERTY
   */
  getPropertyList(landLordId: number) {
    this.loaderService.show();
    this.propertyService
      .getPropertyList(landLordId)
      .subscribe((response: IProperty[]) => {
        this.properties = response;
        this.properties.forEach((element) => {
          this.propertyDropDown.push({ id: element.id, name: element.name });
        });
        this.loaderService.hide();
      });
  }

  cancel() {
    this.router.navigate(['landlord/tenant']);
  }

  onFileChange(event: any, name: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      switch (name) {
        case 'backgroundcheck':
          this.form.patchValue({
            backgroundCheckSourceCtrl: file,
          });
          if (file.size > 1048576) {
            this.f['backgroundCheckCtrl'].setErrors({
              maxFileSizeExceeded: true,
            });
          } else {
            this.f['backgroundCheckCtrl'].setErrors({
              maxFileSizeExceeded: null,
            });
            this.f['backgroundCheckCtrl'].updateValueAndValidity();
          }

          break;
        case 'propertyimages':
          const files: FileList = event.target.files;
          this.form.patchValue({
            propertyImagesSourceCtrl: files,
          });

          break;
        case 'tenancyagreement':
          this.tenantForm.patchValue({
            tenancyAgreemenSourceCtrl: file,
          });
          if (file.size > 1048576) {
            this.t['tenancyAgreemenCtrl'].setErrors({
              maxFileSizeExceeded: true,
            });
          } else {
            this.t['tenancyAgreemenCtrl'].setErrors({
              maxFileSizeExceeded: null,
            });
            this.t['tenancyAgreemenCtrl'].updateValueAndValidity();
          }

          break;
        case 'rentguide':
          this.tenantForm.patchValue({
            rentGuideSourceCtrl: file,
          });
          if (file.size > 1048576) {
            this.t['rentGuideCtrl'].setErrors({ maxFileSizeExceeded: true });
          } else {
            this.t['rentGuideCtrl'].setErrors({ maxFileSizeExceeded: null });
            this.t['rentGuideCtrl'].updateValueAndValidity();
          }
          break;

        default:
          break;
      }
    } else {
      switch (name) {
        case 'backgroundcheck':
          this.form.patchValue({
            backgroundCheckSourceCtrl: '',
          });
          break;
        case 'tenancyagreement':
          this.tenantForm.patchValue({
            tenancyAgreemenSourceCtrl: '',
          });

          break;

        case 'rentguide':
          this.tenantForm.patchValue({
            rentGuideSourceCtrl: '',
          });
          break;

        case 'propertyimages':
          this.form.patchValue({
            propertyImagesSourceCtrl: [],
          });
          break;

        default:
          break;
      }
    }
  }

  editTenantEmail(tenantResponse: ITenantResponse) {
    this.tenantIdForEmailEdit = tenantResponse.tenantId;
    this.submittedEmailTenant = false;
    this.tenantEmailForm.reset({
      emailCtrl: '',
    });
    this.displayMaximizableEmailEdit = true;
  }

  tenantEmailSubmit(form: FormGroup) {
    this.submittedEmailTenant = true;
    if (form.valid) {
      this.isShowenantEmailLoader = true;
      this.service
        .updateTenantEmail(
          this.te['emailCtrl'].value.trim(),
          this.tenantIdForEmailEdit!
        )
        .subscribe(
          (res: boolean) => {
            this.isShowenantEmailLoader = false;
            this.displayMaximizableEmailEdit = false;
            this.toasterService.showSuccess('Email Updated Successfully');
            this.getTenantList();
          },
          (error) => {
            this.isShowenantEmailLoader = false;
            this.toasterService.showError(error.error);
            this.displayMaximizableEmailEdit = false;
          }
        );
    }
  }

  confirmSubmit(form: FormGroup) {
    this.submitted = true;
    if (form.valid && this.tenantUser.length) {
      this.submit(form);
    } else if (form.valid && this.f['propertyImagesSourceCtrl'].value.length) {
      this.submit(form);
    } else if (form.valid) {
      this.confirmationService.confirm({
        message:
          "You are about to skip adding pictures. This is important and you'll not be able to add it in future. Proceed without adding picture?",
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          if (form.valid) {
            this.submit(form);
          }
        },
        reject: (type: any) => {
          switch (type) {
            case ConfirmEventType.REJECT:
              break;
            case ConfirmEventType.CANCEL:
              break;
          }
        },
      });
    }
  }

  isAgeBelow18(dateOfBirth: Date): boolean {
    const today = new Date();
    const diffInMilliseconds = today.getTime() - dateOfBirth.getTime();
    const ageDate = new Date(diffInMilliseconds);

    const years = ageDate.getUTCFullYear() - 1970;
    return years < 18;
  }

  /**It only check valid email for if passing correct email */
  validateEmail(email: string): boolean {
    if (email.length) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }
    return true;
  }

  async validateTenant(obj: ITenantUser): Promise<boolean> {
    if (this.tenantUser.find((x) => x.email === obj.email)) {
      this.toasterService.showError('Duplicate Email');
      return false;
    }
    if (this.tenantList.find((x) => x.email === obj.email)) {
      this.toasterService.showError('Duplicate Email');
      return false;
    }
    if (!obj.rentAmount) {
      this.toasterService.showError('InValid Rent Amount');
      return false;
    }
    if (obj.email) {
      if (!this.validateEmail(obj.email!)) {
        this.toasterService.showError('InValid Email.');
        return false;
      }

      const isDuplicateEmail = await this.service
        .checkDuplicateEmail(obj.email!)
        .toPromise();

      if (isDuplicateEmail) {
        this.toasterService.showError(
          'This email already exist in our system.'
        );
        return false;
      }
    }
    if (!this.primaryTenantDetails && obj.isPrimary) {
      if (!obj.email) {
        this.toasterService.showError('Email required for Primary User.');
        return false;
      } else if (this.isAgeBelow18(obj.dOB)) {
        this.toasterService.showError('Primary user must be 18 year or above.');
        return false;
      }
    }

    if (!this.primaryTenantDetails && this.tenantUser.length) {
      const primaryUsers = this.tenantUser.filter((x) => x.isPrimary == true);
      if (primaryUsers.length === 0) {
        this.toasterService.showError('One User Should be Primary User.');
        return false;
      } else if (primaryUsers.length > 1) {
        this.toasterService.showError('Only One User Should be Primary User.');
        return false;
      } else if (!primaryUsers[0].email) {
        this.toasterService.showError('Email required for Primary User.');
        return false;
      } else if (this.isAgeBelow18(primaryUsers[0].dOB)) {
        this.toasterService.showError('Primary user must be 18 year or above.');
        return false;
      }
    }

    if (!this.isAgeBelow18(obj.dOB) && !obj.email) {
      this.toasterService.showError('Email Required for age 18 year or above.');
      return false;
    }

    return true;
  }

  async submit(form: FormGroup) {
    if (form.valid) {
      const obj: ITenantUser = {
        id: 0,
        landLordId: this.userdetail.userId!,
        tenantId: 0,
        propertyId: +this.f['propertyCtrl'].value.id,
        name: this.f['nameCtrl'].value.trim(),
        email: this.f['emailCtrl'].value.trim(),
        dOB: new Date(this.f['dobCtrl'].value),
        occupation: this.f['occupationCtrl'].value.trim(),
        isPrimary: this.f['primaryCtrl'].value,
        rentAmount: +this.f['rentAmountCtrl'].value,
        rentDueDate: this.f['rentDueDateCtrl'].value,
        tenancyStartDate: this.f['tenacyStartDateCtrl'].value,
        backgroundCheckFileName: this.f['backgroundCheckSourceCtrl'].value.name,
        backgroundCheckFileData: this.f['backgroundCheckSourceCtrl'].value,
      };
      const isValid = await this.validateTenant(obj);
      if (!isValid) {
        return;
      }
      
      this.tenantUser.push(obj);
      this.f['dobCtrl'].reset();
      this.form.patchValue({
        nameCtrl: '',
        emailCtrl: '',
        dobCtrl: '',
        occupationCtrl: '',
        backgroundCheckCtrl: '',
        backgroundCheckSourceCtrl: '',
        primaryCtrl: false,
      });

      this.f['emailCtrl'].setValidators([Validators.maxLength(50)]);
      this.f['emailCtrl'].updateValueAndValidity();

      this.f['rentAmountCtrl'].disable();
      this.f['rentDueDateCtrl'].disable();
      this.f['propertyCtrl'].disable();
      this.f['primaryCtrl'].disable();
      this.f['propertyImagesCtrl'].disable();
      this.f['tenacyStartDateCtrl'].disable();
      this.f['isNewTenantCtrl'].disable();

      this.submitted = false;
    }
  }

  submitTenant(form: FormGroup, isSendOnBoardingEmail = false) {
    this.submittedTenant = true;
    if (form.valid) {
      if (!this.tenantUser.length) {
        this.toasterService.showError('Please Add Tenant to reflect in Tenant User');
        return;
      }
      const obj: ITenant = {
        id: 0,
        landLordId: this.userdetail.userId!,
        tenantId: 0,
        propertyId: this.tenantUser[0].propertyId,
        tenantGroup: !this.primaryTenantDetails
          ? 0
          : this.primaryTenantDetails?.tenantGroup!,

        rentDueDate: this.f['rentDueDateCtrl'].value,
        agreementFileName: !this.primaryTenantDetails
          ? this.t['tenancyAgreemenSourceCtrl'].value.name
          : '',
        agreementFileData: !this.primaryTenantDetails
          ? this.t['tenancyAgreemenSourceCtrl'].value
          : '',
        rentGuideFileName: !this.primaryTenantDetails?.tenantGroup
          ? this.t['rentGuideSourceCtrl'].value.name
          : '',
        rentGuideFileData: !this.primaryTenantDetails?.tenantGroup
          ? this.t['rentGuideSourceCtrl'].value
          : '',
        depositCertificateDetail: !this.primaryTenantDetails?.tenantGroup
          ? this.t['depositCertificateCtrl'].value.trim()
          : '',
        isNewTenant: this.f['isNewTenantCtrl'].value,
        isAcknowledge: false,
        isActive: true,
        dateCreated: new Date(),
        dateModified: new Date(),
        tenantUser: this.tenantUser,
        propertyPicture: this.getPropertyPic(),
      };

      const formData = this.mapObjToFormData(obj, isSendOnBoardingEmail);

      this.service.addTenant(formData).subscribe(
        (res) => {
          this.toasterService.showSuccess('Tenant added Succesfully');
          this.getTenantList();
          this.resetTenant();
        },
        (error) => {
          if (error.error.toString() == '-1') {
            this.toasterService.showError('"Failed to send Emails"');
          }
          this.toasterService.showError(error.error);
        }
      );
    }
  }

  sendConfirmEmail(tenant: ITenantResponse) {
    const obj: ITenantFilter = {
      id: tenant.id,
      landlordId: this.userdetail.userId!,
      tenantId: tenant.tenantId,
      propertyId: tenant.propertyId,
      email: tenant.user.email,
    };
    this.service.sendConfirmEmail(obj).subscribe((res) => {
      this.toasterService.showSuccess('OnBoarding Email Send');
    });
  }

  mapObjToFormData(tenant: ITenant, isSendOnBoardingEmail: boolean): FormData {
    let formData = new FormData();

    formData.append('id', '0');

    formData.append('landlordId', this.userdetail.userId!.toString());

    formData.append('tenantId', '0');

    formData.append('propertyId', tenant.propertyId.toString());

    formData.append('tenantGroup', tenant.tenantGroup.toString());

    formData.append('isSendOnBoardingEmail', isSendOnBoardingEmail.toString());

    formData.append('rentDueDate', new Date(tenant.rentDueDate!).toISOString());

    formData.append('agreementFileName', tenant.agreementFileName!.toString());

    formData.append('agreementFileData', tenant.agreementFileData!);

    formData.append('rentGuideFileName', tenant.rentGuideFileName!.toString());

    formData.append('rentGuideFileData', tenant.rentGuideFileData!);

    formData.append(
      'depositCertificateDetail',
      tenant.depositCertificateDetail!.toString()
    );

    formData.append('isNewTenant', tenant.isNewTenant!.toString());
    formData.append('isAcknowledge', tenant.isAcknowledge!.toString());

    formData.append('isActive', tenant.isActive!.toString());

    formData.append('dateCreated', new Date(tenant.dateCreated!).toISOString());

    formData.append(
      'dateModified',
      new Date(tenant.dateModified!).toISOString()
    );

    for (let index = 0; index < tenant.tenantUser!.length; index++) {
      formData.append(
        `tenantUser[${index}].id`,
        tenant.tenantUser![index].id!.toString()
      );

      formData.append(
        `tenantUser[${index}].landLordId`,
        tenant.tenantUser![index].landLordId!.toString()
      );

      formData.append(
        `tenantUser[${index}].tenantId`,
        tenant.tenantUser![index].tenantId!.toString()
      );

      formData.append(
        `tenantUser[${index}].propertyId`,
        tenant.tenantUser![index].propertyId!.toString()
      );

      formData.append(
        `tenantUser[${index}].name`,
        tenant.tenantUser![index].name!.toString()
      );

      if (tenant.tenantUser![index].email!) {
        formData.append(
          `tenantUser[${index}].email`,
          tenant.tenantUser![index].email!.toString()
        );
      } else {
        formData.append(`tenantUser[${index}].email`, '');
      }

      formData.append(
        `tenantUser[${index}].dOB`,
        new Date(tenant.tenantUser![index].dOB!).toISOString()
      );

      formData.append(
        `tenantUser[${index}].occupation`,
        tenant.tenantUser![index].occupation!.toString()
      );

      formData.append(
        `tenantUser[${index}].isPrimary`,
        tenant.tenantUser![index].isPrimary!.toString()
      );

      formData.append(
        `tenantUser[${index}].rentAmount`,
        tenant.tenantUser![index].rentAmount!.toString()
      );

      formData.append(
        `tenantUser[${index}].rentDueDate`,
        new Date(tenant.tenantUser![index].rentDueDate!).toISOString()
      );
      formData.append(
        `tenantUser[${index}].tenancyStartDate`,
        new Date(tenant.tenantUser![index].tenancyStartDate).toISOString()
      );
      if (tenant.tenantUser![index]!.backgroundCheckFileName) {
        formData.append(
          `tenantUser[${index}].backgroundCheckFileName`,
          tenant.tenantUser![index]!.backgroundCheckFileName!.toString()
        );
      } else {
        formData.append(`tenantUser[${index}].backgroundCheckFileName`, '');
      }

      if (tenant.tenantUser![index]!.backgroundCheckFileName) {
        formData.append(
          `tenantUser[${index}].backgroundCheckFileData`,
          tenant.tenantUser![index]!.backgroundCheckFileData
        );
      } else {
        formData.append(`tenantUser[${index}].backgroundCheckFileData`, '');
      }
    }
    for (let index = 0; index < tenant.propertyPicture.length; index++) {
      // for (const index in tenant.propertyPicture) {
      formData.append(`propertyPicture[${index}].id`, '0');

      formData.append(
        `propertyPicture[${index}].landlordId`,
        this.userdetail.userId!.toString()
      );

      formData.append(`propertyPicture[${index}].tenantId`, '0');

      formData.append(
        `propertyPicture[${index}].propertyId`,
        tenant.propertyPicture[index].propertyId.toString()
      );

      formData.append(
        `propertyPicture[${index}].imageName`,
        tenant.propertyPicture[index].imageName
      );

      formData.append(
        `propertyPicture[${index}].imageData`,
        tenant.propertyPicture[index].imageData
      );
    }

    return formData;
  }

  getTenantList() {
    this.tenantList = [];
    this.service
      .getTenantList(this.userdetail.userId!)
      .subscribe((response: ITenantResponse[]) => {
        this.tenantList = response;
      });
  }

  getPrimaryUserDetails(propertyId: IDropDown) {
    this.service
      .getPrimaryTenantDetailByPropertyId(propertyId.id)
      .subscribe((response: ITenantResponse) => {
        if (response.tenantId) {
          this.primaryTenantDetails = response;
          this.updateForm();
        } else {
          this.patchTenantForm();
        }
      });
  }

  updateForm() {
    this.form.patchValue({
      backgroundCheckCtrl: '',
      backgroundCheckSourceCtrl: '',
      primaryCtrl: false,
      rentAmountCtrl: this.primaryTenantDetails?.rentAmout,

      rentDueDateCtrl: new Date(this.primaryTenantDetails?.rentDueDate!),
      tenacyStartDateCtrl: new Date(
        this.primaryTenantDetails?.tenancyStartDate!
      ),
      isNewTenantCtrl: this.primaryTenantDetails?.isNewTenant,
    });

    this.f['emailCtrl'].setValidators([Validators.maxLength(50)]);
    this.f['emailCtrl'].updateValueAndValidity();

    this.f['rentAmountCtrl'].disable();
    this.f['rentDueDateCtrl'].disable();
    this.f['primaryCtrl'].disable();
    this.f['tenacyStartDateCtrl'].disable();
    this.f['isNewTenantCtrl'].disable();

    this.submitted = false;

    this.tenantForm.patchValue({
      tenancyAgreemenCtrl: '',
      tenancyAgreemenSourceCtrl: '',
      rentGuideCtrl: '',
      rentGuideSourceCtrl: '',
      depositCertificateCtrl:
        this.primaryTenantDetails?.depositCertificateDetail,
    });

    this.t['tenancyAgreemenCtrl'].setValidators([]);
    this.t['tenancyAgreemenCtrl'].updateValueAndValidity();

    this.t['rentGuideCtrl'].setValidators([]);
    this.t['rentGuideCtrl'].updateValueAndValidity();

    this.t['tenancyAgreemenSourceCtrl'].setValidators([]);
    this.t['tenancyAgreemenSourceCtrl'].updateValueAndValidity();

    this.t['rentGuideSourceCtrl'].setValidators([]);
    this.t['rentGuideSourceCtrl'].updateValueAndValidity();

    this.t['tenancyAgreemenCtrl'].disable();
    this.t['rentGuideCtrl'].disable();
    this.t['depositCertificateCtrl'].disable();
  }

  patchTenantForm() {
    this.tenantUser = [];
    this.form.patchValue({
      propertyImagesCtrl: '',
      propertyImagesSourceCtrl: [],

      isNewTenantCtrl: true,
      backgroundCheckCtrl: '',
      backgroundCheckSourceCtrl: '',

      rentAmountCtrl: null,
      rentDueDateCtrl: '',
      tenacyStartDateCtrl: '',
      primaryCtrl: true,
    });

    if (this.primaryTenantDetails?.tenantGroup) {
      this.primaryTenantDetails = null;
    }

    this.submitted = false;
    this.submittedTenant = false;

    this.tenantForm.patchValue({
      tenancyAgreemenCtrl: '',
      tenancyAgreemenSourceCtrl: '',
      rentGuideCtrl: '',
      rentGuideSourceCtrl: '',
      depositCertificateCtrl: '',
    });

    this.f['emailCtrl'].setValidators([
      Validators.required,
      Validators.maxLength(50),
      Validators.email,
      requiredWithTrim(),
    ]);
    this.f['emailCtrl'].updateValueAndValidity();

    this.f['rentAmountCtrl'].enable();
    this.f['rentDueDateCtrl'].enable();
    this.f['propertyCtrl'].enable();
    this.f['primaryCtrl'].enable();
    this.f['propertyImagesCtrl'].enable();
    this.f['tenacyStartDateCtrl'].enable();
    this.f['isNewTenantCtrl'].enable();

    this.t['tenancyAgreemenCtrl'].enable();
    this.t['rentGuideCtrl'].enable();
    this.t['depositCertificateCtrl'].enable();

    this.t['tenancyAgreemenCtrl'].setValidators([
      Validators.required,
      this.fileValidator,
    ]);
    this.t['tenancyAgreemenCtrl'].updateValueAndValidity();
    this.t['rentGuideCtrl'].setValidators([
      Validators.required,
      this.fileValidator,
    ]);
    this.t['rentGuideCtrl'].updateValueAndValidity();
    this.t['depositCertificateCtrl'].setValidators([Validators.required]);
  }

  getRoc(tenantResponse: ITenantResponse) {
    const obj: IROC = {
      tenantName: tenantResponse.user.firstName!,
      landlordname: this.userdetail.fullName!,
      addressOfProperty: tenantResponse.property!.address,
      acknowledgeDate: tenantResponse.acknowledgeDate!,
      ipAddress: tenantResponse.ipAddress!,
    };
    this.service.getROC(obj).subscribe((blob) => {
      const fileExtension = 'pdf';
      const fileName = 'TenancyAcknowledgement.pdf';
      saveAs(blob, fileName);
    });
  }

  getPropertyName(propertyId: number): string {
    const name = this.propertyDropDown.find((x) => x.id == propertyId)?.name!;
    return name;
  }

  customRequiredValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const value = control.value;
    if (
      value !== null &&
      value !== undefined &&
      value !== '' &&
      value != false
    ) {
      return null;
    } else {
      return { customRequired: true };
    }
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

  getPropertyPic(): IPropertyPicture[] {
    let propertyValue = this.f['propertyImagesSourceCtrl'].value;
    let propertyArray = Array.from(propertyValue);
    let obj: IPropertyPicture[] = [];

    if (Array.isArray(propertyArray)) {
      obj = propertyArray.map((x: any) => ({
        id: 0,
        landlordId: this.userdetail.userId!,
        tenantId: 0,
        propertyId: +this.f['propertyCtrl'].value.id,
        imageName: x.name,
        imageData: x,
        description: '',
        dateCreated: new Date(),
        dateModified: new Date(),
        imageUrl: '',
      }));
    }
    return obj;
  }

  validateMaxFiles(control: AbstractControl): ValidationErrors | null {
    if (control.value.length > this.maxFiles) {
      return {
        maxFiles: true,
      };
    }
    return null;
  }

  validateMaxFileSize(control: AbstractControl): ValidationErrors | null {
    for (let i = 0; i < control.value.length; i++) {
      let totalSize = control.value[i].size;

      if (totalSize > this.maxFileSize) {
        return {
          maxFileSize: true,
        };
      }
    }
    return null;
  }

  validateFileType(control: AbstractControl): ValidationErrors | null {
    for (let i = 0; i < control.value.length; i++) {
      const file = control.value[i];
      if (!this.validFileTypes.includes(file.type)) {
        return {
          invalidFileType: true,
        };
      }
    }
    return null;
  }
}
