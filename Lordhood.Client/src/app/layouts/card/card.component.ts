import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { DefaultLayoutComponent } from '@core-ui/default-layout';

import { ToasterComponent } from '@app/core/primeng/components/toaster/toaster.component';
import { LoaderService } from '@app/core/primeng/services/loader.service';
import { ModalService } from '@app/features/landlord/modal.service';
import { OauthService } from '@app/oauth/service/oauth.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  standalone: true,
  imports: [
    DefaultLayoutComponent,
    ProgressSpinnerModule,
    ToasterComponent,
    ConfirmDialogModule,
  ],
})
export class CardComponent implements OnInit {
  loading!: boolean;

  title = 'Lordhood';
  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };
  constructor(
    private spinnerService: LoaderService,
    private confirmationService: ConfirmationService,
    private modalService: ModalService,
    private authService: OauthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.modalService.getAccessDeniedModalSubject().subscribe(() => {
      this.openModal();
    });

    this.spinnerService.loading.asObservable().subscribe((x) =>
      setTimeout(() => {
        this.loading = x;
      }, 0)
    );
  }

  openModal() {
    this.confirmationService.confirm({
      message: 'Complete Your Stripe Account to Access the Add Tenant Page',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.router.navigate(['landlord/profile']);
      },
      reject: (type: any) => {},
    });
  }

  async onLogout(): Promise<void> {
    try {
      this.authService.logout();
    } catch (err) {}
  }
}
