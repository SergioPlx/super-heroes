import { HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { finalize, Observable } from "rxjs";


@Injectable()
export class HttpInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {        
        req = req.clone({
            setHeaders: {
                'Content-Type': 'application/json;charset=UTF-8',
                // 'Access-Control-Allow-Origin': '*',
                // 'Access-Control-Allow-Methods': 'GET',
                // Authorization: Here will be token if needded                    
            }
        });

        return next.handle(req).pipe(finalize(() => {}));
    }
}