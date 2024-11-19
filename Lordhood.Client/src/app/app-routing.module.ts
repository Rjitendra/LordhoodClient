import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


 import { HomeGuardService } from './app-home-guard.service';
import { SigninCallbackComponent } from './oauth/components/signin-callback/signin-callback.component';
import { SignoutCallbackComponent } from './oauth/components/signout-callback/signout-callback.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [HomeGuardService],
  },
  {
    path: 'landlord',
    loadChildren: () =>
      import('./features/landlord/landlord.module').then(
        (m) => m.LandlordModule
      ),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./features/tenant/tenant.module').then((m) => m.TenantModule),
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
