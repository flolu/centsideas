import {Component, Input, Output, EventEmitter, OnDestroy, OnChanges} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {takeWhile, debounceTime, tap} from 'rxjs/operators';

import {IUserState} from '@centsideas/models';
import {SyncStatus} from '@cic/shared';
import {IMeForm} from './store';

@Component({
  selector: 'cic-user-me',
  template: `
    <h2>User Settings</h2>
    <form [formGroup]="form">
      <label for="username">
        Username
      </label>
      <br />
      <input id="username" type="text" formControlName="username" />
      <br />
      <label for="email">
        Email
      </label>
      <br />
      <input id="email" type="text" formControlName="email" />
      <br />
      <span *ngIf="formState.pendingEmail">
        pending email: {{ formState.pendingEmail }} (you need to open the email on this device)
      </span>
      <br />
    </form>
    <p>{{ status }}</p>
  `,
})
export class MeComponent implements OnDestroy, OnChanges {
  @Input() status: number;
  @Input() formState: IUserState;
  @Output() updateForm = new EventEmitter<IMeForm>();

  form: FormGroup = new FormGroup({
    username: new FormControl(),
    email: new FormControl(),
  });

  private alive = true;

  constructor() {
    this.form.valueChanges
      .pipe(
        // FIXME check availablity more often
        debounceTime(1000),
        // FIXME sync instantly when pressing enter
        tap(value => this.updateForm.emit(value)),
        takeWhile(() => this.alive),
      )
      .subscribe();
  }

  ngOnChanges() {
    if (this.formState && this.status !== SyncStatus.Syncing && this.status >= 0)
      this.form.patchValue(this.formState, {emitEvent: false});
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
