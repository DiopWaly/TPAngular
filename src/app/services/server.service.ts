import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CustumResponse } from '../interfaces/custum-response';
import { Server } from '../interfaces/server';
import { Status } from '../enum/status.enum';

@Injectable({providedIn: 'root'})
export class ServerService {
  private readonly apiUrl = 'http://localhost:8080/server'
  constructor(private http: HttpClient) { }

  servers$ = <Observable<CustumResponse>> this.http.get<CustumResponse>(this.apiUrl)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  save$ = (server: Server) => 
  <Observable<CustumResponse>> this.http.post<CustumResponse>(this.apiUrl, server)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  ping$ = (ipAddress: string) => 
  <Observable<CustumResponse>> this.http.get<CustumResponse>(`${this.apiUrl}/ping/${ipAddress}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  delete$ = (serverId: number) => 
  <Observable<CustumResponse>> this.http.delete<CustumResponse>(`${this.apiUrl}/${serverId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  delete = (serverId: number) => this.http.delete<CustumResponse>(`${this.apiUrl}/${serverId}`);

  filter$ = (status: Status, response: CustumResponse) => 
  <Observable<CustumResponse>> new Observable<CustumResponse>(
    suscriber =>{
      console.log(response);
      suscriber.next(
        status === Status.ALL ? {...response, message: `Server filtered by ${status} status`}:
        {
          ...response,
          message: response.data.servers.filter(server => server.status === status).length > 0 ? `Server filtered by 
          ${status === Status.SERVER_UP ? 'SERVER UP':'SERVER DOWN'} status`:
          `no server of ${status} found`,
          data: {
            servers: response.data.servers.filter(server => server.status === status)
          }
        }
      );
      suscriber.complete();
    }
  )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )
  
  handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(() => new Error(`An error occured - Error code: ${error.status}`));
  }

}
