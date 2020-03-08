import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HelloWorldComponent } from './hello-world.component';

describe('BannerComponent (inline template)', () => {
  let comp: HelloWorldComponent;
  let fixture: ComponentFixture<HelloWorldComponent>;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HelloWorldComponent], // declare the test component
      imports: [],
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelloWorldComponent);
    comp = fixture.componentInstance;
    el = fixture.debugElement.query(By.css('div')).nativeElement;
  });
});
