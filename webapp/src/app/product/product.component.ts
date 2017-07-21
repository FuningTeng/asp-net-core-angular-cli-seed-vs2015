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
  userName: string;
  constructor(private _productService: ProductService, _auth: AuthService) {
    this.auth = _auth;
  }

  ngOnInit() {
    this._productService.getProducts().subscribe(
      prds => {
        this.products = prds;
      }
    );
  }
  login() {
    this._productService.login().subscribe(
      data => {
        console.log(data)
        if (data.status == 200) {
          this.authResponse = JSON.parse(data._body);
          localStorage.setItem('token', this.authResponse.token);
          var logined = this.auth.loggedIn();
          console.log(logined);
          this._productService.getUserName().subscribe(d=>
            {
              console.log(d);
            }
          );
        }
      },
      err => console.log(err),
      () => console.log('Request Complete')
    );
  }
}
