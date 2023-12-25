import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimeNgModule } from '@app/core/primeng.module';
import { TenantOutletComponent } from './tenant-outlet/tenant-outlet.component';
import { TenantUserComponent } from './tenant-user/tenant-user.component';
import { TicketCreateComponent } from './ticket/ticket-create/ticket-create.component';
import { TicketHistoryComponent } from './ticket/ticket-history/ticket-history.component';
import { TenantRoutingModule } from './tenant.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RentPortalComponent } from './rent-portal/rent-portal.component';
import { CancelComponent } from './stripe/cancel/cancel.component';
import { SuccessComponent } from './stripe/success/success.component';

@NgModule({
    imports: [
    CommonModule,
    HttpClientModule,
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
    providers: [DatePipe],
})
export class TenantModule {}
