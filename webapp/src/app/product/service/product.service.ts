import { Product } from './../model/product';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Subscription, Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class ProductService {

  constructor(private http: Http, private authHttp: AuthHttp) { console.log('Product Service Initialized...'); }
  getProducts() {
    if (false == environment.production) {
      return this.http.get('api/product').map(res => res.json());
    } else {
      return this.http.get('mock/mock-products.json').map(res => res.json());
    }
  }
  login() {
    let myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');

    if (false == environment.production) {
      return this.http.post('api/account', { name: 'Admin', password: 'Secret123$' }, { headers: myHeader });
    } else {
      return this.http.get('mock/mock-products.json').map(res => res.json());
    }
  }
  getUserName(){
    return this.authHttp.get('api/account').map(res => res.json());
  }
}
