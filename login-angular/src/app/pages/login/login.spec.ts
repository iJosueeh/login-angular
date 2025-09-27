import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { Login } from './login';
import { Auth } from '../../services/auth';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceMock: jasmine.SpyObj<Auth>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // 👇 creamos mocks de Auth y Router
    authServiceMock = jasmine.createSpyObj<Auth>('Auth', ['login']);
    routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [
        { provide: Auth, useValue: authServiceMock },  // 👈 usar mock en vez de real
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login on submit', () => {
    authServiceMock.login.and.returnValue(of(true));
    component.loginForm.setValue({ email: 'test@test.com', password: '1234' });

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith('test@test.com', '1234');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });
});