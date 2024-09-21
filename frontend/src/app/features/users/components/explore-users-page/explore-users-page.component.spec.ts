import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreUsersPageComponent } from './explore-users-page.component';

describe('ExploreUsersPageComponent', () => {
  let component: ExploreUsersPageComponent;
  let fixture: ComponentFixture<ExploreUsersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExploreUsersPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreUsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
