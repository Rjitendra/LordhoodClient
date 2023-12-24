import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantOutletComponent } from './tenant-outlet/tenant-outlet.component';
import { TenatClientGuardService } from '@app/guards/tenat-client-guard.service';
import { TenatClientAccessService } from '@app/guards/tenat-client-access.service';
import { TenantUserComponent } from './tenant-user/tenant-user.component';
import { TicketCreateComponent } from './ticket/ticket-create/ticket-create.component';
import { TicketHistoryComponent } from './ticket/ticket-history/ticket-history.component';
import { RentPortalComponent } from './rent-portal/rent-portal.component';
import { SuccessComponent } from './stripe/success/success.component';
import { CancelComponent } from './stripe/cancel/cancel.component';

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
