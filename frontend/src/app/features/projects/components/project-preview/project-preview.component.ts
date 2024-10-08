import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../../models/project.interface';

@Component({
  selector: 'app-project-preview',
  templateUrl: './project-preview.component.html',
  styleUrl: './project-preview.component.scss'
})
export class ProjectPreviewComponent {
  @Input({required: true}) project!: Project;
  @Input() extendedActionsVisible: boolean = false;
  @Output() invitationAccept: EventEmitter<number> = new EventEmitter();
  @Output() invitationDecline: EventEmitter<number> = new EventEmitter();
}
