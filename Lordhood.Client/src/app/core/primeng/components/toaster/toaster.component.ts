import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IToaster,ToasterService } from '../../services/toaster.service';
import { ToastModule } from 'primeng/toast';


@Component({
    selector: 'app-toaster',
    templateUrl: './toaster.component.html',
    styleUrls: ['./toaster.component.css'],
    standalone: true,
    imports: [ToastModule],
})
export class ToasterComponent implements OnInit {
  constructor(
    private toasterService: ToasterService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.toasterService.toasterSubject
      .asObservable()
      .subscribe((res: IToaster | boolean) => {
        if (typeof res == 'boolean') {
          this.clear();
          return;
        }
        this.messageService.add({
          severity: res.severity,
          summary: res.summary,
          detail: res.detail,
        });
      });
  }

  clear() {
    this.messageService.clear();
  }
}
