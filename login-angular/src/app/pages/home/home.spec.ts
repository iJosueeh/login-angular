import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Home } from './home';
import { Auth } from '../../services/auth';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      checkAuth: jasmine.createSpy('checkAuth').and.returnValue(of(true)),
      logout: jasmine.createSpy('logout').and.returnValue(of(true)),
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ id: 1, nombre: 'Usuario', apellido: 'De Prueba', email: 'usuario@ejemplo.com', password: 'password123' })
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        { provide: Auth, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar el título de bienvenida cuando está autenticado', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('¡Bienvenido, Usuario!');
  });

  it('debería mostrar "No has iniciado sesión" cuando no está autenticado', () => {
    authServiceMock.getCurrentUser.and.returnValue(null);
    component.user = null;
    fixture.detectChanges()
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('No has iniciado sesión');
    expect(compiled.querySelector('a[routerLink="/login"]').textContent).toContain('Ir a Iniciar Sesión');
  });

  it('debería llamar a logout y navegar a /login cuando se hace clic en el botón de cerrar sesión', () => {
    const logoutButton = fixture.nativeElement.querySelector('button.btn-dark');
    logoutButton.click();
    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});