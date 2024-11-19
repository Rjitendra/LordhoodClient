import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddPropertyComponent } from './components/property/add-property/add-property.component';
import { AddAdditionalDetailComponent } from './components/property/add-additional-detail/add-additional-detail.component';
import { ViewAdditionalDetailComponent } from './components/property/view-additional-detail/view-additional-detail.component';
import { AddTenantComponent } from './components/tenant-manager/add-tenant/add-tenant.component';
import { OngoingTenancyComponent } from './components/tenant-manager/ongoing-tenancy/ongoing-tenancy.component';
import { RentReportComponent } from './components/reports/rent-report/rent-report.component';
import { IssueReportComponent } from './components/reports/issue-report/issue-report.component';
import { IssueTrackerComponent } from './components/tenant-manager/issue-tracker/issue-tracker.component';
import { IssueHistoryComponent } from './components/tenant-manager/issue-history/issue-history.component';
import { RentPortalComponent } from './components/rent-portal/rent-portal.component';
import { ReturnComponent } from './components/stripe-account/return/return.component';
import { ReauthComponent } from './components/stripe-account/reauth/reauth.component';



import { ProfileComponent } from './components/profile/profile.component';
import { OauthGuardService } from './guards/landlord/oauth-guard.service';
import { AddTenantGuardService } from '../tenant/guards/add-tenant/add-tenant-guard.service';
import { CancelComponent } from '../tenant/components/stripe/cancel/cancel.component';
import { SuccessComponent } from '../tenant/components/stripe/success/success.component';
import { CardComponent } from '@app/layouts/card/card.component';


const routes: Routes = [
  {
    path: '',
    component: CardComponent,
    canActivate: [OauthGuardService],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'property', component: AddPropertyComponent },
      { path: 'reauth', component: ReauthComponent },
      { path: 'return', component: ReturnComponent },
      {
        path: 'property/additional-detail',
        component: AddAdditionalDetailComponent,
      },
      {
        path: 'property/view-additional-detail',
        component: ViewAdditionalDetailComponent,
      },
      {
        path: 'tenant/add',
        component: AddTenantComponent,
        canActivate: [AddTenantGuardService],
      },
      { path: 'tenant/ongoing', component: OngoingTenancyComponent },
      { path: 'tenant/issue-tracker', component: IssueTrackerComponent },
      { path: 'tenant/ticket-history', component: IssueHistoryComponent },
      { path: 'report/rent-report', component: RentReportComponent },
      { path: 'report/issue-report', component: IssueReportComponent },
      { path: 'rent-portal/:id', component: RentPortalComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'sucess', component: SuccessComponent },
      { path: 'cancel', component: CancelComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard'},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class LandlordRoutingModule {}
