import { TestBed } from '@angular/core/testing';

import { Secuencia } from './secuencia';

describe('Secuencia', () => {
  let service: Secuencia;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Secuencia);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
