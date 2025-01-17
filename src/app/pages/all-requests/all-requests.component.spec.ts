import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRequestsComponent } from './all-requests.component';

describe('AllRequestsComponent', () => {
  let component: AllRequestsComponent;
  let fixture: ComponentFixture<AllRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
