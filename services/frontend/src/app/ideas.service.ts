import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable()
export class IdeasService {
  private readonly url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  fetchAll = () =>
    this.http
      .get(`${this.url}/ideas`)
      .pipe(map(response => (response as any).found.filter(idea => !idea.deleted && idea.published)));

  create = (payload: any) => {
    this.http.post(`${this.url}/ideas`, {}).subscribe((response: any) => {
      const id = response.created.id;
      this.http.put(`${this.url}/ideas/${id}`, payload).subscribe(() => {
        this.http.put(`${this.url}/ideas/publish/${id}`, {}).subscribe(() => {
          window.location.reload();
        });
      });
    });
  };
}
