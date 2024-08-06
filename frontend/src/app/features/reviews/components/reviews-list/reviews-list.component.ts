import { Component } from '@angular/core';
import { Review } from '../../models/review.interface';
import { UserRoles } from '../../../users/models/user-roles.enum';

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrl: './reviews-list.component.scss'
})
export class ReviewsListComponent {
  reviews: Review[] = [
    {
      id: 10,
      rating: 4,
      content: "Sve preporuke za korisnika, izuzetno odgovoran i obavlja svoje obaveze na vreme. Saradjujte sa ovim covekom",
      createdAt: new Date("2024-08-02"),
      author: {
        id: 21,
        firstName: "Jovan",
        lastName: "Paunovic",
        username: "jovan12",
        email: "test12@gmail.com",
        role: UserRoles.ADMIN,
        profileImage: "51e05a20-ef96-42fe-bba4-9b88bb8a2eb4.jpg",
        dateCreated: new Date("2024-07-21")
      }
    },
    {
      id: 11,
      rating: 4,
      content: "Novi sadrzaj",
      createdAt: new Date("2024-08-02"),
      author: {
        id: 21,
        firstName: "Jovan",
        lastName: "Paunovic",
        username: "jovan12",
        email: "test12@gmail.com",
        role: UserRoles.ADMIN,
        profileImage: null,
        dateCreated: new Date("2024-07-21")
      }
    }
  ]
}
