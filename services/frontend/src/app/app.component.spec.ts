import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { provideMockStore } from '@ngrx/store/testing';

import { SettingsService, SettingsMockService } from '@ci-frontend/app';
import { IdeasService } from '@ci-frontend/ideas/ideas.service';
import { AppComponent } from './app.component';

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
