import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginContainer } from './login.container';

describe('LoginContainer', () => {
  let mockStore: MockStore;
  let comp: LoginContainer;
  let fixture: ComponentFixture<LoginContainer>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginContainer],
      imports: [BrowserAnimationsModule, RouterTestingModule],
      providers: [provideMockStore()],
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    mockStore = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(LoginContainer);
    comp = fixture.componentInstance;
  });

  it('should create the login container', () => {
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have a login title', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(el.textContent).toBe('Login');
  });
});
