import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { IconSetService, IconModule } from '@coreui/icons-angular';

import { DefaultFooterComponent } from './default-footer/default-footer.component';
import { DefaultHeaderComponent } from './default-header/default-header.component';
import { navItems } from './_nav';
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
  selector: 'lib-core-ui',
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
    NgScrollbarModule,
    DefaultHeaderComponent,
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

