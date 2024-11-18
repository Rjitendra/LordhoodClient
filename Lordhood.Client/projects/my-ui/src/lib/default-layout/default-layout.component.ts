import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { navItems } from './_nav';
import { Title } from '@angular/platform-browser';
import { IconSetService, IconModule } from '@coreui/icons-angular';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { DefaultFooterComponent } from './default-footer/default-footer.component';
import { DefaultHeaderComponent } from './default-header/default-header.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import {
  SidebarComponent,
  SidebarBrandComponent,
  SidebarNavComponent,
  SidebarTogglerComponent,
  SidebarToggleDirective,
  ContainerComponent,
} from '@coreui/angular';
import { iconSubset } from '../icons/icon-subset';

import {
  AvatarModule,
  FooterModule,
  DropdownModule,
  GridModule,
  HeaderModule,
  SidebarModule,
  NavModule,
  BadgeModule,
} from '@coreui/angular';
@Component({
  selector: 'app-core-ui',
  templateUrl: './default-layout.component.html',
  standalone: true,
  imports: [
    AvatarModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    NavModule,
    BadgeModule,
    // SidebarComponent,
    // SidebarBrandComponent,
    //  RouterLink,
    NgScrollbarModule,
    // SidebarNavComponent,
    // SidebarTogglerComponent,
    //SidebarToggleDirective,
    DefaultHeaderComponent,
    //  ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent,
  ],
  providers: [IconSetService],
})
export class DefaultLayoutComponent implements OnInit {
  @Output() logout = new EventEmitter<void>();

  loading!: boolean;
  public navItems = navItems;
  title = 'Lordhood';
  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  constructor(
    private titleService: Title,
    private iconSetService: IconSetService,

    private router: Router
  ) {
    this.titleService.setTitle(this.title);
    this.iconSetService.icons = { ...iconSubset };
  }

  ngOnInit() {}

  openModal() {}
  onLogout(): void {
    this.logout.emit();
  }
}

