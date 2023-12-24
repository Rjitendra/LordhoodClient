import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OauthGuardService } from '@app/guards/oauth-guard.service';
import { AddTenantGuardService } from '@app/guards/add-tenant-guard.service';
import { DefaultLayoutComponent } from './containers';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddPropertyComponent } from './property/add-property/add-property.component';
import { AddAdditionalDetailComponent } from './property/add-additional-detail/add-additional-detail.component';
import { ViewAdditionalDetailComponent } from './property/view-additional-detail/view-additional-detail.component';
import { AddTenantComponent } from './tenant-manager/add-tenant/add-tenant.component';
import { OngoingTenancyComponent } from './tenant-manager/ongoing-tenancy/ongoing-tenancy.component';
import { RentReportComponent } from './reports/rent-report/rent-report.component';
import { IssueReportComponent } from './reports/issue-report/issue-report.component';
import { IssueTrackerComponent } from './tenant-manager/issue-tracker/issue-tracker.component';
import { IssueHistoryComponent } from './tenant-manager/issue-history/issue-history.component';
import { RentPortalComponent } from './rent-portal/rent-portal.component';
import { ReturnComponent } from './stripe-account/return/return.component';
import { ReauthComponent } from './stripe-account/reauth/reauth.component';
import { ProfileComponent } from './profile/profile.component';
import { SuccessComponent } from './profile/success/success.component';
import { CancelComponent } from './profile/cancel/cancel.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
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
