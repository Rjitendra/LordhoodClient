import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PrimeNgModule } from '@app/core/primeng.module';
import { Title } from '@angular/platform-browser';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandlordRoutingModule } from './lanlord.routing';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddPropertyComponent } from './components/property/add-property/add-property.component';
import { AddAdditionalDetailComponent } from './components/property/add-additional-detail/add-additional-detail.component';
import { ViewAdditionalDetailComponent } from './components/property/view-additional-detail/view-additional-detail.component';
import { AddTenantComponent } from './components/tenant-manager/add-tenant/add-tenant.component';
import { IssueTrackerComponent } from './components/tenant-manager/issue-tracker/issue-tracker.component';
import { OngoingTenancyComponent } from './components/tenant-manager/ongoing-tenancy/ongoing-tenancy.component';

import { IssueReportComponent } from './components/reports/issue-report/issue-report.component';
import { RentReportComponent } from './components/reports/rent-report/rent-report.component';
import { IssueHistoryComponent } from './components/tenant-manager/issue-history/issue-history.component';
import { RentPortalComponent } from './components/rent-portal/rent-portal.component';
import { StripeAccountComponent } from './components/stripe-account/stripe-account.component';
import { ReauthComponent } from './components/stripe-account/reauth/reauth.component';
import { ReturnComponent } from './components/stripe-account/return/return.component';
import { CancelComponent } from '../tenant/components/stripe/cancel/cancel.component';
import { SuccessComponent } from '../tenant/components/stripe/success/success.component';
import { ProfileComponent } from './components/profile/profile.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    LandlordRoutingModule,
    DashboardComponent,
    AddPropertyComponent,
    AddAdditionalDetailComponent,
    ViewAdditionalDetailComponent,
    OngoingTenancyComponent,
    IssueTrackerComponent,
    AddTenantComponent,
    RentReportComponent,
    IssueReportComponent,
    IssueHistoryComponent,
    RentPortalComponent,
    StripeAccountComponent,
    ReauthComponent,
    ReturnComponent,
    ProfileComponent,
    SuccessComponent,
    CancelComponent
  ],
  providers: [Title, DatePipe, provideHttpClient(withInterceptorsFromDi())],
})
export class LandlordModule {}
