import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesarVentasComponent } from './procesar-ventas.component';

describe('ProcesarVentasComponent', () => {
  let component: ProcesarVentasComponent;
  let fixture: ComponentFixture<ProcesarVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcesarVentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesarVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
