import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['clearUser']);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call clearUser and navigate to login on logout', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.onLogout();
    expect(mockAuthService.clearUser).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
