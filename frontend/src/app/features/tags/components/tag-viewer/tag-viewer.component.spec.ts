import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagViewerComponent } from './tag-viewer.component';

describe('TagViewerComponent', () => {
  let component: TagViewerComponent;
  let fixture: ComponentFixture<TagViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TagViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
