import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimeNgModule } from '@app/core/primeng.module';

import { TenantRoutingModule } from './tenant.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RentPortalComponent } from './components/rent-portal/rent-portal.component';
import { CancelComponent } from './components/stripe/cancel/cancel.component';
import { SuccessComponent } from './components/stripe/success/success.component';
import { TenantOutletComponent } from './components/tenant-outlet/tenant-outlet.component';
import { TenantUserComponent } from './components/tenant-user/tenant-user.component';
import { TicketCreateComponent } from './components/ticket/ticket-create/ticket-create.component';
import { TicketHistoryComponent } from './components/ticket/ticket-history/ticket-history.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    PrimeNgModule,
    TenantRoutingModule,
    TenantOutletComponent,
    TenantUserComponent,
    TicketCreateComponent,
    TicketHistoryComponent,
    RentPortalComponent,
    SuccessComponent,
    CancelComponent,
  ],
  providers: [DatePipe, provideHttpClient(withInterceptorsFromDi())],
})
export class TenantModule {}
