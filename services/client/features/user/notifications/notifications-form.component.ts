import { Component, Input, Output, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { takeWhile, debounceTime, tap } from 'rxjs/operators';

import { SyncStatus } from '@cic/shared';
import { INotificationSettingsForm } from './notifications.state';

@Component({
  selector: 'cic-notifications-form',
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
export class NotificationsFormComponent implements OnDestroy, OnChanges {
  @Input() status: number;
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
        debounceTime(500),
        tap(value => this.updateForm.emit(value)),
        takeWhile(() => this.alive),
      )
      .subscribe();
  }

  ngOnChanges() {
    if (this.formState && this.status !== SyncStatus.Syncing && this.status >= 0)
      this.form.patchValue(this.formState, { emitEvent: false });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
