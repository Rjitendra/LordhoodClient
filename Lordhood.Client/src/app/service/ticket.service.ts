import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoaderService } from '@app/core/primeng/services/loader.service';
import { finalize } from 'rxjs';
import { ITicket, ITicketHistory, ITicketStatus } from '../model/ticket';
import { ServiceBase } from './servicebase';
import { IRentReportFilter } from '@app/model/payment';

@Injectable({
  providedIn: 'root',
})
export class TicketService extends ServiceBase {
  constructor(http: HttpClient, private loaderService: LoaderService) {
    super(http);
  }
  createTicket(ticket: ITicket) {
    this.loaderService.show();
    const url = this.toApiUrl('Ticket');
    return this.http.post<boolean>(url, ticket).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }

  updateTicket(ticketStatus: ITicketStatus) {
    this.loaderService.show();
    const url = this.toApiUrl('Ticket/UpdateTicket');
    return this.http.post<boolean>(url, ticketStatus).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }

  getTicketList(tenantGroupId: number) {
    this.loaderService.show();
    const url = this.toApiUrl('Ticket/' + tenantGroupId);
    return this.http.get<ITicket[]>(url).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }

  getTicketListByLandlordId(landlordId: number) {
    this.loaderService.show();
    const url = this.toApiUrl('Ticket/TicketsByLandlordId/' + landlordId);
    return this.http.get<ITicket[]>(url).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }

  getTicketListByPropertyId(propertyId: number) {
    this.loaderService.show();
    const url = this.toApiUrl('Ticket/TicketsByPropertyId/' + propertyId);
    return this.http.get<ITicket[]>(url).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }

  TicketHistory(ticketId: number, tenantId: number, landlordId: number) {
    this.loaderService.show();
    const url = this.toApiUrl(
      `Ticket/TicketHistory/ ${ticketId}/ ${tenantId}/ ${landlordId}`
    );
    return this.http.get<ITicketHistory[]>(url).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }
  getIssueReport(obj: IRentReportFilter) {
    this.loaderService.show();
    const url = this.toApiUrl('Ticket/getIssueReport');
    return this.http.post<ITicket[]>(url, obj).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }
}
