import { Component, Input } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-avatar-image',
  templateUrl: './avatar-image.component.html',
  styleUrl: './avatar-image.component.scss',
})
export class AvatarImageComponent {
  @Input() imageUrl: string | undefined | null;
  @Input({ required: true }) route!: string;
  @Input({ required: true }) defaultImageUrl!: string;
  @Input() rounded: boolean = false;
  apiUrl: string = environment.apiUrl;

  get imageClass(): string {
    return this.rounded ? 'rounded-circle' : '';
  }
}
