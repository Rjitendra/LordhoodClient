import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '@app/core/primeng/services/toaster.service';
import { IOngoingTenancy } from '@app/model/tenant';
import { ITicket, ITicketHistory, ITicketStatus } from '@app/model/ticket';
import { IUserDetail, OauthService } from '@app/oauth/service/oauth.service';
import { TicketService } from '@app/service/ticket.service';

@Component({
  selector: 'app-ticket-history',
  templateUrl: './ticket-history.component.html',
  styleUrls: ['./ticket-history.component.css'],
})
export class TicketHistoryComponent implements OnInit {
  form!: FormGroup;
  ongoingTenancy!: IOngoingTenancy;
  ticket!: ITicket;
  userdetail: Partial<IUserDetail> = {};
  ticketHistory: ITicketHistory[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ticketService: TicketService,
    private toaster: ToasterService,
    private userService: OauthService
  ) {
    this.userdetail = this.userService.getUserInfo();
    const res = this.router.getCurrentNavigation()?.extras.state;
    if (!res) {
      this.router.navigate(['user/ticket-create']);
      return;
    }
    this.ongoingTenancy = res['ongoingTenancy'];
    this.ticket = res['ticket'];

    this.form = this.fb.group({
      status: [this.ticket?.status[0]?.status, Validators.required],
      comments: ['', [Validators.required, Validators.maxLength(500)]],
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
}
