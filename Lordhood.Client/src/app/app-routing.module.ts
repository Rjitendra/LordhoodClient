import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 import { LayoutComponent } from './components/layout/layout.component';
 import { HomeGuardService } from './guards/home-guard.service';
import { SigninCallbackComponent } from './oauth/components/signin-callback/signin-callback.component';
import { SignoutCallbackComponent } from './oauth/components/signout-callback/signout-callback.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [HomeGuardService],
  },
  {
    path: 'landlord',
    loadChildren: () =>
      import('./modules/landlord/landlord.module').then(
        (m) => m.LandlordModule
      ),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./modules/tenant/tenant.module').then((m) => m.TenantModule),
  },
  
  { path: 'signin-callback', component: SigninCallbackComponent },
  { path: 'signout-callback', component: SignoutCallbackComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
