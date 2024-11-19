import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private accessDeniedModalSubject = new ReplaySubject<any>();
  constructor() {}

  openAccessDeniedModal(): void {
    this.accessDeniedModalSubject.next(1);
  }

  getAccessDeniedModalSubject(): Subject<void> {
    return this.accessDeniedModalSubject;
  }
}
