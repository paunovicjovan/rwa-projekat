import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';

@Component({
  selector: 'app-project-participants',
  templateUrl: './project-participants.component.html',
  styleUrl: './project-participants.component.scss'
})
export class ProjectParticipantsComponent implements OnInit {

  @Input({required: true}) projectId!: number;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    
  }

  onTabChange(event: any) {
    console.log(event);
  }
}
