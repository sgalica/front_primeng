/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AppTopBarComponent } from '../app-topbar/app.topbar.component';
import { AppProfileComponent } from '../app-profile/app.profile.component';
import { AppFooterComponent } from '../app-footer/app.footer.component';
import { AppMenuComponent, AppSubMenuComponent } from '../app-menu/app.menu.component';
import { ScrollPanelModule } from 'primeng/primeng';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [ RouterTestingModule, ScrollPanelModule ],
        declarations: [ AppComponent,
                AppTopBarComponent,
                AppMenuComponent,
                AppSubMenuComponent,
                AppFooterComponent,
                AppProfileComponent
            ],
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
