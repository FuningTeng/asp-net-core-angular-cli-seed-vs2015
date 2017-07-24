import { User } from './model/user';
import { AuthService } from './../auth/auth.service';
import { AuthResponse } from './../auth/auth-response';
import { Product } from './model/product';
import { ProductService } from './service/product.service';
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  products: Product[];
  authResponse: AuthResponse;
  auth: AuthService;
  user: User;
  constructor(private _productService: ProductService, _auth: AuthService) {
    this.auth = _auth;
  }
  getProducts() {
    this._productService.getProducts().subscribe(
      prds => {
        this.products = prds;
      }
    );
  }
  getUser() {
    this._productService.getUser().subscribe(
      usr => {
        this.user = usr;
      }
    );
  }
  ngOnInit() {
    if (this.auth.loggedIn()) {
      this.getProducts();
      this.getUser();
    }
  }
  login() {
    this._productService.login().subscribe(
      data => {
        this.authResponse = data;
        localStorage.setItem('token', this.authResponse.token);
        var logined = this.auth.loggedIn();
        console.log(logined);
        this.getProducts();
        this.getUser();
      },
      err => console.log(err),
      () => console.log('Request Complete')
    );
  }
  logout() {
    localStorage.clear();
    var logined = this.auth.loggedIn();
    console.log(logined);
    this.products = null;
    this.user = null;
  }
}
