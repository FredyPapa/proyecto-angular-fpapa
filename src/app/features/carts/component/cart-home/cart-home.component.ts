import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Product } from '../../model/product';
import { CartService } from '../../service/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  imports: [
    RouterOutlet
  ],
  selector: 'app-cart-home',
  styleUrl: './cart-home.component.css',
  templateUrl: './cart-home.component.html',
})
export class CartHomeComponent {

  
}
