import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalityTestPageComponent } from './personality-test-page.component';

describe('PersonalityTestPageComponent', () => {
  let component: PersonalityTestPageComponent;
  let fixture: ComponentFixture<PersonalityTestPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalityTestPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalityTestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
