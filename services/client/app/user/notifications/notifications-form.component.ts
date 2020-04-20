import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { takeWhile, debounceTime, tap, skip } from 'rxjs/operators';

import { INotificationSettingsForm } from './notifications.state';

@Component({
  selector: 'ci-notifications-form',
  template: `
    <h2>Notification Settings</h2>
    <form [formGroup]="form">
      <label>
        <input formControlName="sendEmails" type="checkbox" />
        <span>Email</span>
      </label>
      <br />
      <label>
        <input formControlName="sendPushes" type="checkbox" />
        <span>Push</span>
      </label>
      <br />
    </form>
    <p>{{ status }}</p>
  `,
})
export class NotificationsFormComponent implements OnDestroy, OnInit {
  @Input() status: string;
  @Input() formState: INotificationSettingsForm;
  @Output() updateForm = new EventEmitter<INotificationSettingsForm>();

  form: FormGroup = new FormGroup({
    sendPushes: new FormControl(false),
    sendEmails: new FormControl(false),
  });

  private alive = true;

  constructor() {
    this.form.valueChanges
      .pipe(
        skip(1),
        debounceTime(500),
        tap(value => {
          this.updateForm.emit(value);
        }),
        takeWhile(() => this.alive),
      )
      .subscribe();
  }

  ngOnInit() {
    this.form.patchValue(this.formState);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
