import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { User } from 'oidc-client';
import { switchMap } from 'rxjs/operators';
import { OauthService } from 'src/app/oauth/service/oauth.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  constructor(private oauthService: OauthService) {}

  /**
   * Adding Bearer Token to HttpRequest header
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.getCurrentUserValue()).pipe(
      switchMap((token: User) => {
        let contentType = 'application/json';
        if (request.body instanceof FormData) {
          // we are sending a file here
          contentType = 'multipart/form-data';
        }

        const headers = request.headers.set(
          'Authorization',
          'Bearer ' + token.access_token
        );
        const requestClone = request.clone({
          headers,
        });
        return next.handle(requestClone);
      })
    );
  }

  async getCurrentUserValue(): Promise<any> {
    try {
      let user: User | null = await this.oauthService.getUser();
      if (user && user.access_token && !user.expired) {
        this.oauthService.setUserInfo(user.profile);
        return user;
      } else if (user && user.access_token && user.expired) {
        // else if (user && user.access_token)
        user = await this.oauthService.renewToken();
        this.oauthService.setUserInfo(user.profile);
        return user;
      } else {
       await this.oauthService.login();
      }
    } catch (error) {
     await this.oauthService.login();
    }
  }
}
