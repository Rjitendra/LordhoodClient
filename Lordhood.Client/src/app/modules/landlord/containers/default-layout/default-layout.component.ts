import { Component, OnInit } from '@angular/core';

import { navItems } from './_nav';
import { Title } from '@angular/platform-browser';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from '../../icons/icon-subset';
import { LoaderService } from '@app/core/primeng/services/loader.service';
import { ConfirmationService } from 'primeng/api';
import { ModalService } from '../../modal.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToasterComponent } from '../../../../core/primeng/components/toaster/toaster.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DefaultFooterComponent } from './default-footer/default-footer.component';
import { DefaultHeaderComponent } from './default-header/default-header.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SidebarComponent, SidebarBrandComponent, SidebarNavComponent, SidebarTogglerComponent, SidebarToggleDirective, ContainerComponent } from '@coreui/angular';

@Component({
    selector: 'app-dashboard',
    templateUrl: './default-layout.component.html',
    standalone: true,
    imports: [
        SidebarComponent,
        SidebarBrandComponent,
        RouterLink,
        NgScrollbarModule,
        SidebarNavComponent,
        SidebarTogglerComponent,
        SidebarToggleDirective,
        DefaultHeaderComponent,
        ContainerComponent,
        RouterOutlet,
        DefaultFooterComponent,
        ProgressSpinnerModule,
        ToasterComponent,
        ConfirmDialogModule,
    ],
})
export class DefaultLayoutComponent implements OnInit {
  loading!: boolean;
  public navItems = navItems;
  title = 'Lordhood';
  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  constructor(
    private titleService: Title,
    private iconSetService: IconSetService,
    private spinnerService: LoaderService,
    private confirmationService: ConfirmationService,
    private modalService: ModalService,
    private router: Router
  ) {
    this.titleService.setTitle(this.title);
    this.iconSetService.icons = { ...iconSubset };
  }

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
}
