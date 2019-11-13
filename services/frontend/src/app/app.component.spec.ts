import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { provideMockStore } from '@ngrx/store/testing';

import { AppComponent } from './app.component';
import { IdeasService } from './ideas/ideas.service';
import { SettingsService } from './settings.service';
import { SettingsMockService } from './settings.mock.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule, HttpClientModule],
      declarations: [AppComponent],
      providers: [IdeasService, SettingsService, provideMockStore({})],
    }).compileComponents();
    TestBed.overrideProvider(SettingsService, { useValue: new SettingsMockService() });
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
