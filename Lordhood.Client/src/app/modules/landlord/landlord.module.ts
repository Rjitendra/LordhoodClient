import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PrimeNgModule } from '@app/core/primeng.module';
import { CoreUiModule } from '@app/core/core-ui.module';
import { Title } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
} from './containers';
import { LandlordRoutingModule } from './lanlord.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddPropertyComponent } from './property/add-property/add-property.component';
import { AddAdditionalDetailComponent } from './property/add-additional-detail/add-additional-detail.component';
import { ViewAdditionalDetailComponent } from './property/view-additional-detail/view-additional-detail.component';
import { AddTenantComponent } from './tenant-manager/add-tenant/add-tenant.component';
import { IssueTrackerComponent } from './tenant-manager/issue-tracker/issue-tracker.component';
import { OngoingTenancyComponent } from './tenant-manager/ongoing-tenancy/ongoing-tenancy.component';
import { CoreModule } from '@app/core/core.module';
import { IssueReportComponent } from './reports/issue-report/issue-report.component';
import { RentReportComponent } from './reports/rent-report/rent-report.component';
import { IssueHistoryComponent } from './tenant-manager/issue-history/issue-history.component';
import { RentPortalComponent } from './rent-portal/rent-portal.component';
import { StripeAccountComponent } from './stripe-account/stripe-account.component';
import { ReauthComponent } from './stripe-account/reauth/reauth.component';
import { ReturnComponent } from './stripe-account/return/return.component';
import { ProfileComponent } from './profile/profile.component';
import { SuccessComponent } from './profile/success/success.component';
import { CancelComponent } from './profile/cancel/cancel.component';

const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    PrimeNgModule,
    CoreUiModule,
    LandlordRoutingModule,
  ],
  declarations: [
    ...APP_CONTAINERS,
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
    CancelComponent,
  ],
  providers: [Title, DatePipe],
})
export class LandlordModule {}
