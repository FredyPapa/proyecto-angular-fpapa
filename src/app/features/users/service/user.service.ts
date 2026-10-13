import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { Observable } from 'rxjs';

@Service()
export class UserService {
    private uri = `${environment.URL_BASE}/users`;

    // Inyección de Dependencia
    private http = inject(HttpClient);

    getAll(): Observable<User[]> {
        return this.http.get<User[]>(this.uri);
    }

    findById(id: number): Observable<User> {
        const uri_local = `${this.uri}/${id}`;
        return this.http.get<User>(uri_local);
    }

    save(user: User): Observable<User> {
        return this.http.post<User>(this.uri, user);
    }

    create(user: User): Observable<User> {
        return this.save(user);
    }

    update(id: number, user: User): Observable<User> {
        const uri_local = `${this.uri}/${id}`;
        return this.http.put<User>(uri_local, user);
    }

    delete(id: number): Observable<any> {
        const uri_local = `${this.uri}/${id}`;
        return this.http.delete<any>(uri_local);
    }
}
