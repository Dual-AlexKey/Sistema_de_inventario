import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionComprasFormComponent } from './gestion-compras-form.component';

describe('GestionComprasFormComponent', () => {
  let component: GestionComprasFormComponent;
  let fixture: ComponentFixture<GestionComprasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionComprasFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionComprasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
