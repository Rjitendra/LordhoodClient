import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { ToasterService } from '@app/core/primeng/services/toaster.service';
import { IOngoingTenancy } from '@app/model/tenant';
import { ITicket, ITicketHistory, ITicketStatus } from '@app/model/ticket';
import { IUserDetail, OauthService } from '@app/oauth/service/oauth.service';
import { TicketService } from '@app/service/ticket.service';
import { requiredWithTrim } from '@app/model/validators';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-issue-history',
    templateUrl: './issue-history.component.html',
    styleUrls: ['./issue-history.component.css'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        DatePipe,
    ],
})
export class IssueHistoryComponent implements OnInit {
  form!: FormGroup;
  ongoingTenancy!: IOngoingTenancy;
  ticket!: ITicket;
  userdetail: Partial<IUserDetail> = {};
  ticketHistory: ITicketHistory[] = [];
  // navigationTenantId!: number;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private ticketService: TicketService,
    private toaster: ToasterService,
    private userService: OauthService,
    private datePipe: DatePipe
  ) {
    this.userdetail = this.userService.getUserInfo();
    const res = this.router.getCurrentNavigation()?.extras.state;
    if (!res) {
      //   this.router.navigate(['landlord/issue-report']);
      this.location.back();
      return;
    }

    // if (res && res['navigationTenantId']) {
    //   this.navigationTenantId = res['navigationTenantId'];
    // }

    this.ticket = res['ticket'];
    this.form = this.fb.group({
      status: [this.ticket?.status[0]?.status, Validators.required],
      comments: ['', [Validators.required,requiredWithTrim(), Validators.maxLength(500)]],
    });
    this.getHistory();
  }

  ngOnInit() {}

  getHistory() {
    this.ticketService
      .TicketHistory(
        this.ticket?.status[0]?.ticketId,
        this.userdetail.userId!,
        this.ticket.landlordId
      )
      .subscribe((res: ITicketHistory[]) => {
        this.ticketHistory = res;
      });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      const obj: ITicketStatus = {
        id: 0,
        ticketId: this.ticket.status[0].ticketId,
        addedBy: this.userdetail.userId!,
        status: this.f['status'].value,
        comment: this.f['comments'].value,
        dateCreated: new Date(),
        dateModified: new Date(),
      };

      this.ticketService.updateTicket(obj).subscribe((x) => {
        this.getHistory();
        this.form.reset({
          status: this.f['status'].value,
          comment: '',
        });
      });
    }
  }

  back() {
    this.location.back();
    // this.router.navigate(['landlord/tenant/issue-tracker'], {
    //   state: { navigationTenantId: this.navigationTenantId },
    // });
  }
}
