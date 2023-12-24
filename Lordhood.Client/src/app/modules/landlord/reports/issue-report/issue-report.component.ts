import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '@app/core/primeng/services/loader.service';
import { ToasterService } from '@app/core/primeng/services/toaster.service';
import { IDropDown } from '@app/model/model';
import {
  IRentReport,
  IRentReportFilter,
  IRentReportGroup,
} from '@app/model/payment';
import { IProperty } from '@app/model/property';
import { ITicket } from '@app/model/ticket';
import { IUserDetail, OauthService } from '@app/oauth/service/oauth.service';
import { PaymentService } from '@app/service/payment.service';
import { PropertyService } from '@app/service/property.service';
import { TicketService } from '@app/service/ticket.service';

@Component({
  selector: 'app-issue-report',
  templateUrl: './issue-report.component.html',
  styleUrls: ['./issue-report.component.css'],
})
export class IssueReportComponent implements OnInit {
  userdetail: Partial<IUserDetail> = {};
  selectedPropertyValue = 'All';
  selectedPeriodValue = 'All';
  propertyDropDown: IDropDown[] = [];
  selectedProperty?: IDropDown | null;
  tickets: ITicket[] = [];
  totalRentAmount: number = 0;
  totalLateCharges: number = 0;
  totalAmontCollected: number = 0;
  constructor(
    private router: Router,
    private userService: OauthService,
    private loaderService: LoaderService,
    private propertyService: PropertyService,
    private toasterService: ToasterService,
    private ticketService: TicketService
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
  submit() {
    const obj: IRentReportFilter = {
      period: this.selectedPeriodValue,
      propertyFilter:
        this.selectedPropertyValue === 'PropertyId'
          ? this.selectedProperty?.id?.toString() ?? ''
          : this.selectedPropertyValue ?? '',
      landlordId: this.userdetail.userId!,
    };
    this.ticketService.getIssueReport(obj).subscribe((res: ITicket[]) => {
      this.tickets = res;
    });
  }
  ticketHistory(ticket: ITicket) {
    this.router.navigate(['landlord/ticket-history'], {
      state: { ticket: ticket },
    });
  }
}
