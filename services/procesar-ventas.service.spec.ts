import { TestBed } from '@angular/core/testing';

import { ProcesarVentasService } from './procesar-ventas.service';

describe('ProcesarVentasService', () => {
  let service: ProcesarVentasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcesarVentasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
