import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { NavHComponent } from '../../../shared/components/nav-h/nav-h.component';

@Component({
  imports: [
    RouterOutlet,
    FooterComponent,
    HeaderComponent,
    NavHComponent
  ],
  selector: 'app-home',
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
})
export class HomeComponent {}
