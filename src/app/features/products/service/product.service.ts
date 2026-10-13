import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../model/product';
import { environment } from '../../../../environments/environment';

@Service()
export class ProductService {
    private uri = environment.URL_BASE+'/products'

    //Injección de Dependencia
    private http = inject(HttpClient)

    getAll():Observable<Product[]>{
        return this.http.get<Product[]>(this.uri)
    }

    findById(id:number):Observable<Product>{
        const uri_local = `${this.uri}/${id}`
        return this.http.get<Product>(uri_local)
    }

    save(product:Product):Observable<Product>{
        return this.http.post<Product>(this.uri,product);
    }

    update(id:number, product:Product):Observable<Product>{
        const uri_local = `${this.uri}/${id}`;
        return this.http.put<Product>(uri_local, product);
    }

    delete(id:number):Observable<any>{
        const uri_local = `${this.uri}/${id}`;
        return this.http.delete<any>(uri_local);
    }

    getCategories():Observable<string[]>{
        const uri_local = `${this.uri}/categories`;
        return this.http.get<string[]>(uri_local);
    }
}
