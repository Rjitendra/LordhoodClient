import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TenatClientAccessService } from '@app/features/tenant/guards/tenant-client-access/tenat-client-access.service';

import { TicketCreateComponent } from './components/ticket/ticket-create/ticket-create.component';
import { TicketHistoryComponent } from './components/ticket/ticket-history/ticket-history.component';
import { RentPortalComponent } from './components/rent-portal/rent-portal.component';
import { SuccessComponent } from './components/stripe/success/success.component';
import { CancelComponent } from './components/stripe/cancel/cancel.component';
import { TenantUserComponent } from './components/tenant-user/tenant-user.component';
import { TenantOutletComponent } from './components/tenant-outlet/tenant-outlet.component';
import { TenatClientGuardService } from './guards/tenant-client/tenat-client-guard.service';

const routes: Routes = [
  {
    path: '',
    component: TenantOutletComponent,
    canActivate: [TenatClientGuardService],
    children: [
      { path: '', component: TenantUserComponent },
      { path: 'stripe/success', component: SuccessComponent },
      { path: 'stripe/cancel', component: CancelComponent },
      {
        path: 'ticket-create',
        component: TicketCreateComponent,
        canActivate: [TenatClientAccessService],
      },
      {
        path: 'ticket-history',
        component: TicketHistoryComponent,
        canActivate: [TenatClientAccessService],
      },
      {
        path: 'rent-portal/:id',
        component: RentPortalComponent,
        canActivate: [TenatClientAccessService],
      },
      { path: '**', redirectTo: ''},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class TenantRoutingModule {}
