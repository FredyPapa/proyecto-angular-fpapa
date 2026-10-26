import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartHomeComponent } from './cart-home.component';

describe('CartHomeComponent', () => {
  let component: CartHomeComponent;
  let fixture: ComponentFixture<CartHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartHomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
