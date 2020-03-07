import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ADD_TODO, DELETE_TODO, TOGGLE_DONE, UPDATE_TODO } from './reducers/reducers';

@Component({
  selector: 'todos',
  template: `
    <h1>Todos</h1>
    <div>{{ editing ? 'Edit' : 'Add' }} your todo</div>
    <input placeholder="your todo" [(ngModel)]="todo" />
    <button (click)="addTodo(todo)" [disabled]="!todo" *ngIf="!editing">Create</button>
    <button (click)="updateTodo(todo)" *ngIf="editing">Update</button>
    <button (click)="cancelEdit()" *ngIf="editing">Cancel</button>
    <div *ngFor="let todo of todos$ | async; let i = index">
      <span (click)="toggleDone(todo, i)">{{ todo.done ? 'check_box' : 'check_box_outline_blank' }}</span>
      <div [class.done]="todo.done">{{ todo.value }}</div>
      <div>
        <span (click)="editTodo(todo, i)">edit</span>
      </div>
      <div>
        <span (click)="deleteTodo(i)">delete</span>
      </div>
    </div>
  `,
})
export class TodosComponent implements OnInit {
  todos$: Observable<any>;
  todo: string;
  editing = false;
  indexToEdit: number | null;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.todos$ = this.store.select('todoReducer');
  }

  addTodo(value) {
    this.store.dispatch({ type: ADD_TODO, payload: { value, done: false } });
    this.todo = '';
  }

  deleteTodo(index) {
    this.store.dispatch({ type: DELETE_TODO, payload: { index } });
  }

  editTodo(todo, index) {
    this.editing = true;
    this.todo = todo.value;
    this.indexToEdit = index;
  }

  cancelEdit() {
    this.editing = false;
    this.todo = '';
    this.indexToEdit = null;
  }

  updateTodo(updatedTodo) {
    this.store.dispatch({ type: UPDATE_TODO, payload: { index: this.indexToEdit, newValue: updatedTodo } });
    this.todo = '';
    this.indexToEdit = null;
    this.editing = false;
  }

  toggleDone(todo, index) {
    this.store.dispatch({ type: TOGGLE_DONE, payload: { index, done: todo.done } });
  }
}
