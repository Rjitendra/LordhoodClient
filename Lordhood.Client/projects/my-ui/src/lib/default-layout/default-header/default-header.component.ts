import { Component, Input } from '@angular/core';
import {
  HeaderModule,
  ClassToggleService,
  HeaderComponent,
  ContainerComponent,
  HeaderTogglerDirective,
  SidebarToggleDirective,
  HeaderNavComponent,
  DropdownComponent,
  DropdownToggleDirective,
  AvatarComponent,
  DropdownMenuDirective,
  DropdownItemDirective,
  DropdownDividerDirective,
} from '@coreui/angular';

import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss'],
  standalone: true,
  imports: [
    HeaderModule,
    ContainerComponent,
    HeaderTogglerDirective,
    SidebarToggleDirective,
    IconDirective,
    HeaderNavComponent,
    NgTemplateOutlet,
    DropdownComponent,
    DropdownToggleDirective,
    AvatarComponent,
    DropdownMenuDirective,
    RouterLink,
    DropdownItemDirective,
    DropdownDividerDirective,
  ],
})
export class DefaultHeaderComponent extends HeaderComponent {
  @Input() sidebarId: string = 'sidebar';

  public newMessages = new Array(4);
  public newTasks = new Array(5);
  public newNotifications = new Array(5);

  constructor(private classToggler: ClassToggleService) {
    super();
  }

  public async onLogout(): Promise<void> {
    try {
    } catch (err) {}
  }
}
