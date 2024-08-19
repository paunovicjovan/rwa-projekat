import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTagsPageComponent } from './manage-tags-page.component';

describe('ManageTagsPageComponent', () => {
  let component: ManageTagsPageComponent;
  let fixture: ComponentFixture<ManageTagsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageTagsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTagsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
