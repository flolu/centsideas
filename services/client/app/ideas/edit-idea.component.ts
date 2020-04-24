import {
  Component,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { takeWhile, debounceTime, tap } from 'rxjs/operators';

import { IIdeaForm } from './ideas.state';

@Component({
  selector: 'cic-edit-idea',
  template: `
    <h3>Edit mode</h3>
    <form [formGroup]="form">
      <div>
        <label>Name</label>
        <input formControlName="title" type="text" placeholder="Title" />
      </div>
      <div>
        <label>Description</label>
        <input formControlName="description" type="text" placeholder="Description" />
      </div>
    </form>
    <button (click)="onCancel()">Cancel</button>
    <button (click)="onSave()">Save</button>
    <button (click)="onDelete()">Delete</button>
  `,
})
export class EditIdeaComponent implements OnChanges, OnDestroy {
  @Input() formState: IIdeaForm;
  @Output() updateForm = new EventEmitter<IIdeaForm>();
  @Output() cancel = new EventEmitter();
  @Output() save = new EventEmitter();
  @Output() delete = new EventEmitter();

  form: FormGroup = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
  });

  alive = true;

  constructor() {
    this.form.valueChanges
      .pipe(
        takeWhile(() => this.alive),
        debounceTime(100),
        tap(value => this.updateForm.emit(value)),
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.formState && this.formState !== this.form.value) {
      this.form.patchValue(this.formState);
    }
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  onCancel = () => this.cancel.emit();
  onSave = () => this.save.emit();
  onDelete = () => this.delete.emit();
}
