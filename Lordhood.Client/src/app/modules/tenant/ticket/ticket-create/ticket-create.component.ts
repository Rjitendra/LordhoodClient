import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from '@app/core/primeng/services/loader.service';
import { ToasterService } from '@app/core/primeng/services/toaster.service';
import { IOngoingTenancy } from '@app/model/tenant';
import { ITicket } from '@app/model/ticket';
import { requiredWithTrim } from '@app/model/validators';
import { IUserDetail, OauthService } from '@app/oauth/service/oauth.service';
import { TenantService } from '@app/service/tenant.service';
import { TicketService } from '@app/service/ticket.service';

@Component({
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.css'],
})
export class TicketCreateComponent implements OnInit {
  userdetail: Partial<IUserDetail> = {};
  ongoingTenancy!: IOngoingTenancy;
  ticketList: ITicket[] = [];
  ticketForm!: FormGroup;
  constructor(
    private router: Router,
    private tenantService: TenantService,
    private ticketService: TicketService,
    private userService: OauthService,
    private toastService: ToasterService,
    private loaderService: LoaderService
  ) {
    this.userdetail = this.userService.getUserInfo();
  }

  ngOnInit() {
    this.getTenantDetails();
    this.ticketForm = new FormGroup({
      category: new FormControl('', Validators.required),
      description: new FormControl('', [
        Validators.required,
        requiredWithTrim(),
        Validators.maxLength(500),
      ]),
    });
  }

  getTicketList() {
    this.ticketService
      .getTicketList(this.ongoingTenancy.tenantId)
      .subscribe((res: ITicket[]) => {
        this.ticketList = res;
      });
  }
  getTenantDetails() {
    this.tenantService
      .getTenantListByTenantId(this.userdetail.userId!)
      .subscribe((tenant: IOngoingTenancy) => {
        this.ongoingTenancy = tenant;
        this.getTicketList();
      });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.ticketForm.controls;
  }

  onSubmit() {
    const obj: ITicket = {
      id: 0,
      landlordId: this.ongoingTenancy.landLordId,
      tenantId: this.userdetail.userId!,
      tenantGroupId: this.ongoingTenancy.tenantId,
      propertyId: this.ongoingTenancy.propertyId,
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
      this.ticketForm.reset();
      this.ticketForm.patchValue({
        category: '',
        description: '',
      });
      this.toastService.showSuccess(
        'New Ticket has been Created Successfully.'
      );
      this.getTicketList();
    });
  }

  ticketHistory(ticket: ITicket) {
    this.router.navigate(['user/ticket-history'], {
      state: { ongoingTenancy: this.ongoingTenancy, ticket: ticket },
    });
  }
}
