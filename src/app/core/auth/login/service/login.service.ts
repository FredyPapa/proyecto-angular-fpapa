import { inject, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../model/login.request';
import { LoginResponse } from '../model/login.response';

@Service()
export class LoginService {
    private uri = `${environment.URL_BASE}/auth/login`

    //Injección de Dependencia
    private http = inject(HttpClient)

    login(loginRequest:LoginRequest):Observable<LoginResponse>{
        return this.http.post<LoginResponse>(this.uri,loginRequest)
    }
}
