import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSearchFiltersComponent } from './users-search-filters.component';

describe('UsersSearchFiltersComponent', () => {
  let component: UsersSearchFiltersComponent;
  let fixture: ComponentFixture<UsersSearchFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersSearchFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersSearchFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
