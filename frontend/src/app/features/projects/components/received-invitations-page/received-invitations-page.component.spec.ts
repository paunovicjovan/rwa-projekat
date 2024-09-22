import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedInvitationsPageComponent } from './received-invitations-page.component';

describe('ReceivedInvitationsPageComponent', () => {
  let component: ReceivedInvitationsPageComponent;
  let fixture: ComponentFixture<ReceivedInvitationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceivedInvitationsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivedInvitationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
