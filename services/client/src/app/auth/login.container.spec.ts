import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginContainer } from './login.container';

describe('LoginContainer', () => {
  let comp: LoginContainer;
  let fixture: ComponentFixture<LoginContainer>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginContainer],
      imports: [BrowserAnimationsModule],
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
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
