import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';


@NgModule({
  declarations: [
    SettingsComponent,
    SettingsPanelComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
