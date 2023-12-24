import { Injectable } from '@angular/core';
import { Constants } from '@app/core/constants/constants';
import { Subject } from 'rxjs';

export interface IMessage {
  detail: string;
  severity: string;
  summary: string;
  isClear?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  message = new Subject<IMessage | boolean>();

  constructor() {}
  showSuccess(msg: string) {
    const message: IMessage = {
      detail: msg,
      severity: Constants.common.success,
      summary: Constants.common.successMessage,
    };

    this.message.next(message);
  }

  showInfo(msg: string) {
    const message: IMessage = {
      detail: msg,
      severity: Constants.common.info,
      summary: Constants.common.infoMessage,
      isClear: true,
    };

    this.message.next(message);
  }
  showWarn(msg: string) {
    const message: IMessage = {
      detail: msg,
      severity: Constants.common.warn,
      summary: Constants.common.warn,
      isClear: true,
    };

    this.message.next(message);
  }

  showError(msg: string) {
    const message: IMessage = {
      detail: msg,
      severity: Constants.common.error,
      summary: Constants.common.errorMessage,
      isClear: true,
    };

    this.message.next(message);
  }

  clear() {
    this.message.next(true);
  }
}
