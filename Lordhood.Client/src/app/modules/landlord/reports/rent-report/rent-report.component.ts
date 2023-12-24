import { Component, OnInit } from '@angular/core';
import { LoaderService } from '@app/core/primeng/services/loader.service';
import { IDropDown } from '@app/model/model';
import {
  IRentPaymentHistory,
  IRentReport,
  IRentReportFilter,
  IRentReportGroup,
} from '@app/model/payment';
import { IProperty } from '@app/model/property';
import { IUserDetail, OauthService } from '@app/oauth/service/oauth.service';
import { PaymentService } from '@app/service/payment.service';
import { PropertyService } from '@app/service/property.service';

import { ToasterService } from '@coreui/angular';

@Component({
  selector: 'app-rent-report',
  templateUrl: './rent-report.component.html',
  styleUrls: ['./rent-report.component.css'],
})
export class RentReportComponent implements OnInit {
  userdetail: Partial<IUserDetail> = {};
  selectedPropertyValue = 'All';
  selectedPeriodValue = 'All';
  propertyDropDown: IDropDown[] = [];
  selectedProperty?: IDropDown | null;
  rentReport: IRentReport[] = [];
  totalRentAmount: number = 0;
  totalLateCharges: number = 0;
  totalAmontCollected: number = 0;
  constructor(
    private userService: OauthService,
    private loaderService: LoaderService,
    private propertyService: PropertyService,
    private toasterService: ToasterService,
    private payementService: PaymentService
  ) {
    this.userdetail = this.userService.getUserInfo();
    this.getPropertyList(this.userdetail.userId!);
  }

  ngOnInit() {
    this.submit();
  }

  getPropertyList(landLordId: number) {
    this.loaderService.show();
    this.propertyService
      .getPropertyList(landLordId)
      .subscribe((response: IProperty[]) => {
        response.forEach((element) => {
          this.propertyDropDown.push({ id: element.id, name: element.name });
        });
        this.loaderService.hide();
      });
  }
  selectProperty() {
    if (this.selectedPropertyValue !== 'PropertyId') {
      this.selectedProperty = null;
    }
  }

  loadRentHistory(rent: IRentReport) {
    
    if (rent.rentHistory!.length > 0) {
      return;
    }
    this.payementService
      .getRentPaymentHistory(rent.tenantId, rent.rentDate)
      .subscribe((res: IRentPaymentHistory[]) => {
        rent.rentHistory = res;
      });
  }

  submit() {
    const obj: IRentReportFilter = {
      period: this.selectedPeriodValue,
      propertyFilter:
        this.selectedPropertyValue === 'PropertyId'
          ? this.selectedProperty?.id?.toString() ?? ''
          : this.selectedPropertyValue ?? '',
      landlordId: this.userdetail.userId!,
    };
    this.payementService.getRentReport(obj).subscribe((res: IRentReport[]) => {
      this.rentReport = res;
      if (this.rentReport.length) {
        const totalLateCharges = this.rentReport.reduce(
          (acc, curr) => acc + curr.latePaymentCharges,
          0
        );
        this.totalLateCharges = totalLateCharges;

        const groupedRentReports = this.rentReport.reduce(
          (acc: IRentReportGroup, report) => {
            const key = report.tenantId.toString();
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(report);
            return acc;
          },
          {}
        );

        const totalRentamount = this.rentReport.reduce(
          (acc, curr) => acc + curr.rentAmount,
          0
        );
        this.totalRentAmount = totalRentamount;

        const totalAmontCollected = this.rentReport.reduce(
          (acc, curr) => acc + curr.rentPaid,
          0
        );
        this.totalAmontCollected = totalAmontCollected;
      } else {
        this.totalRentAmount = 0;
        this.totalLateCharges = 0;
        this.totalAmontCollected = 0;
      }
    });
  }
}
