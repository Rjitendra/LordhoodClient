import { Injectable } from '@angular/core';
import { Constants } from '@app/core/constants/constants';
import { Subject } from 'rxjs';

export interface IToaster {
  detail: string;
  severity: string;
  summary: string;
  isClear?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  toasterSubject = new Subject<IToaster | boolean>();

  constructor() {}
  showSuccess(msg: string) {
    const toaster: IToaster = {
      detail: msg,
      severity: Constants.common.success,
      summary: Constants.common.successMessage,
    };

    this.toasterSubject.next(toaster);
  }

  showInfo(msg: string) {
    const toaster: IToaster = {
      detail: msg,
      severity: Constants.common.info,
      summary: Constants.common.infoMessage,
      isClear: true,
    };

    this.toasterSubject.next(toaster);
  }
  showWarn(msg: string) {
    const toaster: IToaster = {
      detail: msg,
      severity: Constants.common.warn,
      summary: Constants.common.warn,
      isClear: true,
    };

    this.toasterSubject.next(toaster);
  }

  showError(msg: string) {
    const toaster: IToaster = {
      detail: msg,
      severity: Constants.common.error,
      summary: Constants.common.errorMessage,
      isClear: true,
    };

    this.toasterSubject.next(toaster);
  }

  clear() {
    this.toasterSubject.next(true);
  }
}
