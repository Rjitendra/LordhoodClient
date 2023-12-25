import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SigninCallbackComponent } from './oauth/components/signin-callback/signin-callback.component';
import { SignoutCallbackComponent } from './oauth/components/signout-callback/signout-callback.component';
import { httpInterceptorProviders } from './core/interceptor/interceptors';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        LayoutComponent,
        SigninCallbackComponent,
        SignoutCallbackComponent,
    ],
    providers: [httpInterceptorProviders],
    bootstrap: [AppComponent],
})
export class AppModule {}
