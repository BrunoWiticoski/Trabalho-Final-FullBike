import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MetaInterface } from '../types/metas.interface';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  private url = 'http://localhost:5000/metas';


  constructor(
    private httpClient: HttpClient
  ) {}

 

  getMetas(): Observable<MetaInterface[]> {
    return this.httpClient.get<MetaInterface[]>(this.url);
  }

  excluir(id: string): Observable<Object> {
    return this.httpClient.delete(`${this.url}/${id}`);
  }

  getMeta(id: string): Observable<MetaInterface> {
    return this.httpClient.get<MetaInterface>(`${this.url}/${id}`);
  }

  private adicionar(meta: MetaInterface): Observable<any> {
    return this.httpClient.post(this.url, meta);
  }

  private atualizar(meta: MetaInterface): Observable<any> {
    return this.httpClient.put(`${this.url}/${meta.id}`, meta);
  }

  salvar(meta: MetaInterface): Observable<any> {
    if(meta.id) {
      return this.atualizar(meta);
    } else {
      return this.adicionar(meta);
    }
  }
}
