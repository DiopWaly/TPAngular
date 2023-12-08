import { startWith, catchError } from 'rxjs/operators';
import { Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ResolveFn } from '@angular/router';
import { ServerService } from 'src/app/services/server.service';

export const HomeResolver: ResolveFn<any> = (
  route, 
  state,
  serverService: ServerService = Inject(ServerService)
  ): Observable<{}> => serverService.servers$
