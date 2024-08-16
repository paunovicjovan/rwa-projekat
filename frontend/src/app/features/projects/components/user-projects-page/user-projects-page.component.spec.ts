import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProjectsPageComponent } from './user-projects-page.component';

describe('UserProjectsPageComponent', () => {
  let component: UserProjectsPageComponent;
  let fixture: ComponentFixture<UserProjectsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProjectsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProjectsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
