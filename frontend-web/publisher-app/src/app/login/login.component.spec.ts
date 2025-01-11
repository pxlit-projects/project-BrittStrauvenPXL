import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let alertSpy: jasmine.Spy; 

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['saveUser']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule, FormsModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    alertSpy = spyOn(window, 'alert').and.stub();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call saveUser and navigate to /posts when form is valid', () => {
    spyOn(router, 'navigate');

    component.username = 'testuser';
    component.role = 'admin';
    const mockForm = { valid: true };

    component.onSubmit(mockForm);

    expect(mockAuthService.saveUser).toHaveBeenCalledWith('testuser', 'admin');
    expect(router.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should show an alert and not save user if form is invalid', () => {
    spyOn(router, 'navigate');

    component.username = '';
    component.role = '';
    const mockForm = { valid: false };

    component.onSubmit(mockForm);

    expect(alertSpy).toHaveBeenCalledWith('Please fill out the form correctly.');

    expect(mockAuthService.saveUser).not.toHaveBeenCalled();

    expect(router.navigate).not.toHaveBeenCalled();
  });
});
