import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { NgScrollbarModule } from 'ngx-scrollbar';

const CoreUIModules = [
  AvatarModule,
  FooterModule,
  DropdownModule,
  GridModule,
  HeaderModule,
  SidebarModule,
  IconModule,
  NgScrollbarModule,
  NavModule,
  BadgeModule,
];

@NgModule({
  imports: [
    CommonModule,
    AvatarModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    NavModule,
    BadgeModule,
  ],
  declarations: [],
  providers: [IconSetService],
  exports: CoreUIModules,
})
export class CoreUiModule {}
