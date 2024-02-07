import { Component, Input } from '@angular/core';

@Component({
  selector: 'star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent {

  // Input property to receive the number of stars
  @Input() stars!: number;

  // Input property to specify the size of the star
  @Input() size: number = 1;

  // Getter method to dynamically calculate and return styles for the star element
  get styles() {
    return {
      'width.rem': this.size,
      'height.rem': this.size,
      'marginRight.rem': this.size / 6,
    };
  }

  // Method to determine the star image based on the current iteration value
  getStarImage(current: number): string {
    const previousHalf = current - 0.5;
    const imageName =
      this.stars >= current
        ? 'star-full'
        : this.stars >= previousHalf
        ? 'star-half'
        : 'star-empty';
    return `/assets/stars/${imageName}.svg`;
  } 
}
