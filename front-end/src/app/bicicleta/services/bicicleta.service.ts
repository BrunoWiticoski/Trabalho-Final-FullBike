import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import { BicicletaInterface } from '../types/bicicleta.interface';

@Injectable({
  providedIn: 'root'
})
export class BicicletaService {

  private url = 'http://localhost:5000/bicicletas';

  private bicicletasAtualizadasSubject: Subject<void> = new Subject<void>();

  constructor(
    private httpClient: HttpClient
  ) {}

  emitirBicicletasAtualizadas() {
    this.bicicletasAtualizadasSubject.next();
  }

  ouvirBicicletasAtualizadas(): Observable<void> {
    return this.bicicletasAtualizadasSubject.asObservable();
  }

  getBicicletas(): Observable<BicicletaInterface[]> {
    return this.httpClient.get<BicicletaInterface[]>(this.url);
  }

  excluir(id: string): Observable<Object> {
    return this.httpClient.delete(`${this.url}/${id}`);
  }

  getBicicleta(id: string): Observable<BicicletaInterface> {
    return this.httpClient.get<BicicletaInterface>(`${this.url}/${id}`);
  }

  private adicionar(bicicleta: BicicletaInterface): Observable<any> {
    return this.httpClient.post(this.url, bicicleta);
  }

  private atualizar(bicicleta: BicicletaInterface): Observable<any> {
    return this.httpClient.put(`${this.url}/${bicicleta.id}`, bicicleta);
  }

  salvar(bicicleta: BicicletaInterface) {
    if(bicicleta.id) {
      return this.atualizar(bicicleta);
    } else {
      return this.adicionar(bicicleta);
    }
  }
}
