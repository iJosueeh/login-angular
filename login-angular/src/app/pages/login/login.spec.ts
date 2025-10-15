import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { Login } from './login';
import { AuthService } from '../../services/auth.service';

describe('Componente Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', ['login']);
    routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a login al enviar', () => {
    authServiceMock.login.and.returnValue(of(true));
    component.loginForm.setValue({ email: 'test@test.com', password: '1234' });

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith('test@test.com', '1234');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });
});