import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunazmBadge } from './munazm-badge';

describe('MunazmBadge', () => {
  let component: MunazmBadge;
  let fixture: ComponentFixture<MunazmBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MunazmBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(MunazmBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
