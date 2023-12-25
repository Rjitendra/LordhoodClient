import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from '@app/core/primeng/services/loader.service';
import { ToasterService } from '@app/core/primeng/services/toaster.service';
import { IDropDown } from '@app/model/model';
import { IProperty } from '@app/model/property';
import { ITenantResponse } from '@app/model/tenant';
import { ITicket } from '@app/model/ticket';
import { requiredWithTrim } from '@app/model/validators';
import { IUserDetail, OauthService } from '@app/oauth/service/oauth.service';
import { PropertyService } from '@app/service/property.service';
import { TenantService } from '@app/service/tenant.service';
import { TicketService } from '@app/service/ticket.service';

import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-issue-tracker',
    templateUrl: './issue-tracker.component.html',
    styleUrls: ['./issue-tracker.component.css'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        SharedModule,
        TooltipModule,
        DatePipe,
    ],
})
export class IssueTrackerComponent implements OnInit {
  ticketForm!: FormGroup;
  ticketCreateForm!: FormGroup;
  userdetail: Partial<IUserDetail> = {};
  ticketList: ITicket[] = [];
  tableData: any[] = [];
  propertyDropDown: IDropDown[] = [];
  tenantDropDown: IDropDown[] = [];
  tenantList: ITenantResponse[] = [];

  displayMaximizable = false;
  isSubmitted = false;
  ticket: ITicket = {} as ITicket;
  navigationTenantId!: number;
  private unsubscribe$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ticketService: TicketService,
    private propertyService: PropertyService,
    private tenantService: TenantService,
    private userService: OauthService,
    private toastService: ToasterService,
    private loaderService: LoaderService
  ) {
    this.userdetail = this.userService.getUserInfo();
    const res = this.router.getCurrentNavigation()?.extras.state;
    if (res && res['navigationTenantId']) {
      this.navigationTenantId = res['navigationTenantId'];
    }
    this.getPropertyDropDown(this.userdetail.userId!);
    this.getTicketList();
  }

  ngOnInit() {
    this.ticketCreateForm = new FormGroup({
      property: new FormControl('', Validators.required),
      tenant: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      description: new FormControl('', [Validators.required,requiredWithTrim(),Validators.maxLength(500)]),
    });

    this.ticketCreateForm.controls['property'].valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (!value) {
          this.tenantDropDown = [];
          this.f['tenant'].setValue('');
          return;
        }
        this.getTenantsDropDown();
        // Do something with the selected item value
      });
  }
  getPropertyDropDown(landLordId: number) {
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
  getTenantsDropDown() {

    this.tenantService
      .getTenantListByPropertyId(+this.f['property'].value.id)
      .subscribe((res: ITenantResponse[]) => {
       
        this.tenantList = res;
        this.tenantDropDown = [];
        res.forEach((element) => {
          this.tenantDropDown.push({
            id: element.tenantId,
            name: element.name!,
          });
        });
      });
  }
  getTicketList() {
    this.ticketService
      .getTicketListByLandlordId(this.userdetail.userId!)
      .subscribe((res: ITicket[]) => {
        this.ticketList = res;
        if (this.navigationTenantId) {
          this.ticketList = this.ticketList.filter(
            (x) => x.tenantGroupId == this.navigationTenantId
          );
        }
        this.displayMaximizable = false;
      });
  }
  changePropertyDropDown() {
    if (this.f['property'].value) {
      this.getTenantsDropDown();
    }
  }
  get f(): { [key: string]: AbstractControl } {
    return this.ticketCreateForm.controls;
  }
  openAction(ticket: ITicket) {
    this.ticket = {} as ITicket;
    this.ticketForm.reset({
      dropdown: '',
      comment: '',
    });
    this.isSubmitted = false;
    this.ticket = ticket;
    this.displayMaximizable = true;
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.ticketCreateForm.valid) {
      const obj: ITicket = {
        id: 0,
        landlordId: this.userdetail.userId!,
        tenantId: +this.f['tenant'].value.id,
        tenantGroupId: this.tenantList.find(
          (x) => x.tenantId == +this.f['tenant'].value.id
        )?.tenantGroup!,
        propertyId: +this.f['property'].value.id,
        category: this.f['category'].value,
        description: this.f['description'].value,
        dateCreated: new Date(),
        status: [
          {
            id: 0,
            ticketId: 0,
            status: 'New',
            comment: 'NA',
            dateCreated: new Date(),
            addedBy: this.userdetail.userId!,
          },
        ],
      };
      this.ticketService.createTicket(obj).subscribe((x: boolean) => {
        this.ticketCreateForm.reset({
          property: '',
          tenant: '',
          category: '',
          description: '',
        });
        this.toastService.showSuccess(
          'New Ticket has been Created Successfully.'
        );
        this.getTicketList();
      });
    }
  }
  closeDisplayMaximizable() {
    this.ticket = {} as ITicket;
    this.displayMaximizable = false;
  }

  ticketHistory(ticket: ITicket) {
    this.router.navigate(['landlord/tenant/ticket-history'], {
      state: { ticket: ticket, navigationTenantId: this.navigationTenantId },
    });
  }

  validateDescription(control: FormControl) {
    const value = control.value.trim(); // Remove leading and trailing spaces
    return value.length > 0 ? null : { required: true };
  }
  
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
