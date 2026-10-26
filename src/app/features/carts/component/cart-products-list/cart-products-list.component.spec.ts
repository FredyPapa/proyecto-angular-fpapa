import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartProductsListComponent } from './cart-products-list.component';

describe('CartProductsListComponent', () => {
  let component: CartProductsListComponent;
  let fixture: ComponentFixture<CartProductsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartProductsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartProductsListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
