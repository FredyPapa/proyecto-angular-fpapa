import { inject, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { Observable } from 'rxjs';

@Service()
export class UserService {
    private uri = `${environment.URL_BASE}/users`;

    //Injección de Dependencia
    private http = inject(HttpClient)

    create(user:User):Observable<User>{
        return this.http.post<User>(this.uri,user)
    }
}
