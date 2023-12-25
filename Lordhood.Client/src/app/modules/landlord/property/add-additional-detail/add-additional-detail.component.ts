import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  IUserDetail,
  OauthService,
} from '../../../../oauth/service/oauth.service';
import { IProperty, IWhiteGoods } from '@app/model/property';
import { PropertyService } from '@app/service/property.service';
import { fileValidator } from '@app/model/validators';
import { ButtonModule } from 'primeng/button';
import { NgClass } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';

@Component({
    selector: 'app-add-additional-detail',
    templateUrl: './add-additional-detail.component.html',
    styleUrls: ['./add-additional-detail.component.css'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        NgClass,
        ButtonModule,
    ],
})
export class AddAdditionalDetailComponent implements OnInit {
  form!: FormGroup;
  userdetail: Partial<IUserDetail> = {};
  uploadedFiles: any[] = [];
  uploadedFileNames: any[] = [];
  property!: IProperty;
  submitted = false;
  isFloorPlanFileChange = false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private service: PropertyService,
    private userService: OauthService
  ) {
    this.userdetail = this.userService.getUserInfo();

    const res = this.router.getCurrentNavigation()?.extras.state;
    if (!res) {
      this.router.navigate(['landlord/property']);
      return;
    }
    this.property = res['property'];
  }

  ngOnInit() {
    this.formInitialize();
  }

  formInitialize() {
    this.form = this.formBuilder.group({
      councilDetailsCtrl: [
        this.property?.councilInformation
          ? this.property?.councilInformation
          : '',
      ],

      floorPlanCtrl: [
        {
          value: '',
          disabled: this.property?.floorPlanFileName ? true : false,
        },
        [fileValidator],
      ],
      floorPlanSourceCtrl: [''],

      electricityProviderCtrl: [
        this.property?.electricityProvider
          ? this.property?.electricityProvider
          : '',
      ],
      electricityLatestReadingCtrl: [
        this.property?.electricityProviderLatestReading
          ? this.property?.electricityProviderLatestReading
          : '',
      ],
      electricityDateOnCtrl: [
        this.property?.electricityProviderDateOn
          ? new Date(this.property?.electricityProviderDateOn)
          : '',
      ],

      gasProviderCtrl: [
        this.property?.gasProvider ? this.property?.gasProvider : '',
      ],
      gasProviderLatestReadingCtrl: [
        this.property?.gasProviderLatestReading
          ? this.property?.gasProviderLatestReading
          : '',
      ],
      gasProviderDateOnCtrl: [
        this.property?.gasProviderDateOn
          ? new Date(this.property.gasProviderDateOn)
          : '',
      ],

      waterProviderCtrl: [
        this.property?.waterProvider ? this.property?.waterProvider : '',
      ],
      waterLatestReadingCtrl: [
        this.property?.waterProviderLatestReading
          ? this.property?.waterProviderLatestReading
          : '',
      ],
      waterDateOnCtrl: [
        this.property?.waterProviderDateOn
          ? new Date(this.property.waterProviderDateOn)
          : '',
      ],

      roomDetailCtrl: [
        this.property?.roomDetail ? this.property?.roomDetail : '',
      ],
      toiletDetailCtrl: [
        this.property?.toiletDetail ? this.property?.toiletDetail : '',
      ],

      spaceDetailCtrl: [
        this.property?.spaceDetail ? this.property?.spaceDetail : '',
      ],

      cookerMakeCtrl: [
        this.property?.whiteGoods!.length > 0 &&
        this.property?.whiteGoods![0].make
          ? this.property?.whiteGoods![0].make
          : '',
      ],
      ovenMakeCtrl: [
        this.property?.whiteGoods!.length > 0 &&
        this.property?.whiteGoods![1].make
          ? this.property?.whiteGoods![1].make
          : '',
      ],
      wmMakeCtrl: [
        this.property?.whiteGoods!.length > 0 &&
        this.property?.whiteGoods![2].make
          ? this.property?.whiteGoods![2].make
          : '',
      ],
      refrigeratorMakeCtrl: [
        this.property?.whiteGoods!.length > 0 &&
        this.property?.whiteGoods![3].make
          ? this.property?.whiteGoods![3].make
          : '',
      ],
      dishwasherMakeCtrl: [
        this.property?.whiteGoods!.length > 0 &&
        this.property?.whiteGoods![4].make
          ? this.property?.whiteGoods![4].make
          : '',
      ],

      cookerModelCtrl: [
        this.property?.whiteGoods!.length > 0 &&
        this.property?.whiteGoods![0].model
          ? this.property?.whiteGoods![0].model
          : '',
      ],
      ovenModelCtrl: [
        this.property?.whiteGoods!.length > 0 &&
        this.property?.whiteGoods![1].model
          ? this.property?.whiteGoods![1].model
          : '',
      ],
      wmModelCtrl: [
        this.property?.whiteGoods!.length > 0 &&
        this.property?.whiteGoods![2].model
          ? this.property?.whiteGoods![2].model
          : '',
      ],
      refrigeratorModelCtrl: [
        this.property?.whiteGoods!.length > 0 &&
        this.property?.whiteGoods![3].model
          ? this.property?.whiteGoods![3].model
          : '',
      ],
      dishwasherModelCtrl: [
        this.property?.whiteGoods!.length > 0 &&
        this.property?.whiteGoods![4].model
          ? this.property?.whiteGoods![4].model
          : '',
      ],

      cookerSerialCtrl: [
        this.property?.whiteGoods!.length > 0 &&
        this.property?.whiteGoods![0].serialNo
          ? this.property?.whiteGoods![0].serialNo
          : '',
      ],
      ovenSerialCtrl: [
        this.property?.whiteGoods!.length > 0 &&
        this.property?.whiteGoods![1].serialNo
          ? this.property?.whiteGoods![1].serialNo
          : '',
      ],
      wmSerialCtrl: [
        this.property?.whiteGoods!.length > 0 &&
        this.property?.whiteGoods![2].serialNo
          ? this.property?.whiteGoods![2].serialNo
          : '',
      ],
      refrigeratorSerialCtrl: [
        this.property?.whiteGoods!.length > 0 &&
        this.property?.whiteGoods![3].serialNo
          ? this.property?.whiteGoods![3].serialNo
          : '',
      ],
      dishwasherSerialCtrl: [
        this.property?.whiteGoods!.length > 0 &&
        this.property?.whiteGoods![4].serialNo
          ? this.property?.whiteGoods![4].serialNo
          : '',
      ],

      otherCtrl: [
        this.property?.whiteGoods!.length > 0 &&
        this.property?.whiteGoods![5].description
          ? this.property?.whiteGoods![5].description
          : '',
      ],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  fileChange(event: any) {
    this.isFloorPlanFileChange = true;

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.patchValue({
        floorPlanSourceCtrl: file,
      });

      if (file.size > 1048576) {
        this.f['floorPlanCtrl'].setErrors({
          maxFileSizeExceeded: true,
        });
      } else {
        this.f['floorPlanCtrl'].setErrors({
          maxFileSizeExceeded: null,
        });
        this.f['floorPlanCtrl'].updateValueAndValidity();
        if (this.f['floorPlanCtrl'].valid) {
          this.property.floorPlanFileName = file.name;
          this.f['floorPlanCtrl'].disable();
        }
      }
    }
  }

  fileDelete() {
    this.isFloorPlanFileChange = true;
    this.property.floorPlanFileName = '';
    this.property.floorPlanFileData = null;
    this.form.patchValue({
      floorPlanSourceCtrl: '',
      floorPlanCtrl: '',
    });
    this.f['floorPlanCtrl'].enable();
  }

  submit(form: FormGroup) {
    this.submitted = true;
    if (form.valid) {
      this.mapFormToObject(form);
      const formData = this.mapObjToFormData(this.property);
      this.service.updateProperty(formData).subscribe((res: IProperty) => {
        this.property = res;
        this.isFloorPlanFileChange = false;
        this.form.patchValue({
          floorPlanSourceCtrl: '',
          floorPlanCtrl: '',
        });
      });
    }
  }
  cancel() {
    this.router.navigate(['landlord/property']);
  }

  mapFormToObject(form: FormGroup) {
    this.property.councilInformation =
      form.controls['councilDetailsCtrl'].value.trim();

    if (form.controls['floorPlanSourceCtrl'].value) {
      this.property.floorPlanFileName = form.controls['floorPlanSourceCtrl']
        .value
        ? form.controls['floorPlanSourceCtrl'].value.name
        : '';
      this.property.floorPlanFileData = form.controls['floorPlanSourceCtrl']
        .value
        ? form.controls['floorPlanSourceCtrl'].value
        : null;
    }

    this.property.electricityProvider =
      form.controls['electricityProviderCtrl'].value.trim();
    this.property.electricityProviderLatestReading =
      form.controls['electricityLatestReadingCtrl'].value.trim();
    this.property.electricityProviderDateOn =
      form.controls['electricityDateOnCtrl'].value;

    this.property.gasProvider = form.controls['gasProviderCtrl'].value.trim();
    this.property.gasProviderLatestReading =
      form.controls['gasProviderLatestReadingCtrl'].value.trim();
    this.property.gasProviderDateOn =
      form.controls['gasProviderDateOnCtrl'].value;

    this.property.waterProvider =
      form.controls['waterProviderCtrl'].value.trim();
    this.property.waterProviderLatestReading =
      form.controls['waterLatestReadingCtrl'].value.trim();
    this.property.waterProviderDateOn = form.controls['waterDateOnCtrl'].value;

    this.property.roomDetail = form.controls['roomDetailCtrl'].value.trim();
    this.property.toiletDetail = form.controls['toiletDetailCtrl'].value.trim();

    this.property.spaceDetail = form.controls['spaceDetailCtrl'].value.trim();

    this.property.whiteGoods = this.mapWhiteGoodToEntity(form);
  }

  mapObjToFormData(property: IProperty): FormData {
    let formData = new FormData();
    formData.append('id', property.id.toString());

    formData.append('landlordId', property.landLordId.toString());

    formData.append('name', property.name);

    formData.append('address', property.address);

    if (property.councilInformation) {
      formData.append('councilInformation', property?.councilInformation!);
    } else {
      formData.append('councilInformation', '');
    }

    if (property.floorPlanFileData && this.isFloorPlanFileChange) {
      formData.append('floorPlanFileData', property?.floorPlanFileData!);
    } else {
      formData.append('floorPlanFileData', '');
    }

    if (property.floorPlanFileData && this.isFloorPlanFileChange) {
      formData.append('floorPlanFileName', property?.floorPlanFileName!);
    } else {
      if (property.floorPlanFileName && !this.isFloorPlanFileChange) {
        formData.append('floorPlanFileName', property?.floorPlanFileName!);
      } else {
        formData.append('floorPlanFileName', '');
      }
    }

    if (property.electricityProvider) {
      formData.append('electricityProvider', property.electricityProvider!);
    } else {
      formData.append('electricityProvider', '');
    }

    if (property.electricityProviderLatestReading) {
      formData.append(
        'electricityProviderLatestReading',
        property.electricityProviderLatestReading!
      );
    } else {
      formData.append('electricityProviderLatestReading', '');
    }

    if (property.electricityProviderDateOn) {
      formData.append(
        'electricityProviderDateOn',
        new Date(this.property.electricityProviderDateOn!).toISOString()
      );
    } else {
      formData.append('electricityProviderDateOn', '');
    }
    if (property.gasProvider) {
      formData.append('gasProvider', property?.gasProvider!);
    } else {
      formData.append('gasProvider', '');
    }
    if (property.gasProviderLatestReading) {
      formData.append(
        'gasProviderLatestReading',
        property?.gasProviderLatestReading!
      );
    } else {
      formData.append('gasProviderLatestReading', '');
    }
    if (property.gasProviderDateOn) {
      formData.append(
        'gasProviderDateOn',
        new Date(this.property.gasProviderDateOn!).toISOString()
      );
    } else {
      formData.append('gasProviderDateOn', '');
    }
    if (property.waterProvider) {
      formData.append('waterProvider', property?.waterProvider!);
    } else {
      formData.append('waterProvider', '');
    }
    if (property.waterProviderLatestReading) {
      formData.append(
        'waterProviderLatestReading',
        property?.waterProviderLatestReading!
      );
    } else {
      formData.append('waterProviderLatestReading', '');
    }
    if (property.waterProviderDateOn) {
      let a = new Date(this.property.waterProviderDateOn!).toISOString();
      formData.append(
        'waterProviderDateOn',
        new Date(this.property.waterProviderDateOn!).toISOString()
      );
    } else {
      formData.append('waterProviderDateOn', '');
    }
    if (property.roomDetail) {
      formData.append('roomDetail', property?.roomDetail!);
    } else {
      formData.append('roomDetail', '');
    }
    if (property.spaceDetail) {
      formData.append('spaceDetail', property?.spaceDetail!);
    } else {
      formData.append('spaceDetail', '');
    }
    if (property.toiletDetail) {
      formData.append('toiletDetail', property?.toiletDetail!);
    } else {
      formData.append('toiletDetail', '');
    }

    for (let index = 0; index < this.property.whiteGoods!.length; index++) {
      formData.append(
        `whiteGoods[${index}].id`,
        this.property.whiteGoods![index].id!.toString()
      );

      formData.append(
        `whiteGoods[${index}].propertyId`,
        this.property.whiteGoods![index].propertyId!.toString()
      );

      if (this.property.whiteGoods![index].name) {
        formData.append(
          `whiteGoods[${index}].name`,
          this.property.whiteGoods![index].name!
        );
      } else {
        formData.append('whiteGoods[${index}].name', '');
      }

      if (this.property.whiteGoods![index].make) {
        formData.append(
          `whiteGoods[${index}].make`,
          this.property.whiteGoods![index].make!
        );
      } else {
        formData.append('whiteGoods[${index}].make', '');
      }

      if (this.property.whiteGoods![index].model) {
        formData.append(
          `whiteGoods[${index}].model`,
          this.property.whiteGoods![index].model!
        );
      } else {
        formData.append('whiteGoods[${index}].model', '');
      }

      if (this.property.whiteGoods![index].serialNo) {
        formData.append(
          `whiteGoods[${index}].serialNo`,
          this.property.whiteGoods![index].serialNo!
        );
      } else {
        formData.append('whiteGoods[${index}].serialNo', '');
      }

      if (this.property.whiteGoods![index].description) {
        formData.append(
          `whiteGoods[${index}].description`,
          this.property.whiteGoods![index].description!
        );
      } else {
        formData.append('whiteGoods[${index}].description', '');
      }
    }

    return formData;
  }

  mapWhiteGoodToEntity(form: FormGroup): IWhiteGoods[] {
    const obj: IWhiteGoods[] = [
      {
        id:
          this.property?.whiteGoods!.length > 0
            ? this.property.whiteGoods![0].id
            : 0,
        propertyId: this.property.id,
        name: 'Cooker',
        make: form.controls['cookerMakeCtrl'].value.trim(),
        model: form.controls['cookerModelCtrl'].value.trim(),
        serialNo: form.controls['cookerSerialCtrl'].value.trim(),
        description: '',
      },
      {
        id:
          this.property?.whiteGoods!.length > 0
            ? this.property.whiteGoods![1].id
            : 0,
        propertyId: this.property.id,
        name: 'Oven',
        make: form.controls['ovenMakeCtrl'].value.trim(),
        model: form.controls['ovenModelCtrl'].value.trim(),
        serialNo: form.controls['ovenSerialCtrl'].value.trim(),
        description: '',
      },
      {
        id:
          this.property?.whiteGoods!.length > 0
            ? this.property.whiteGoods![2].id
            : 0,
        propertyId: this.property.id,
        name: 'WashingMachine',
        make: form.controls['wmMakeCtrl'].value.trim(),
        model: form.controls['wmModelCtrl'].value.trim(),
        serialNo: form.controls['wmSerialCtrl'].value.trim(),
        description: '',
      },
      {
        id:
          this.property?.whiteGoods!.length > 0
            ? this.property.whiteGoods![3].id
            : 0,
        propertyId: this.property.id,
        name: 'Refrigerator',
        make: form.controls['refrigeratorMakeCtrl'].value.trim(),
        model: form.controls['refrigeratorModelCtrl'].value.trim(),
        serialNo: form.controls['refrigeratorSerialCtrl'].value.trim(),
        description: '',
      },
      {
        id:
          this.property?.whiteGoods!.length > 0
            ? this.property.whiteGoods![4].id
            : 0,
        propertyId: this.property.id,
        name: 'Dishwasher',
        make: form.controls['dishwasherMakeCtrl'].value.trim(),
        model: form.controls['dishwasherModelCtrl'].value.trim(),
        serialNo: form.controls['dishwasherSerialCtrl'].value.trim(),
        description: '',
      },
      {
        id:
          this.property?.whiteGoods!.length > 0
            ? this.property.whiteGoods![5].id
            : 0,
        propertyId: this.property.id,
        name: 'Other',
        make: '',
        model: '',
        serialNo: '',
        description: form.controls['otherCtrl'].value.trim(),
      },
    ];
    return obj;
  }
}
