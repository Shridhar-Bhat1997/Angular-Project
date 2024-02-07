// Import necessary modules and components from Angular core and the application
import { Component, OnInit } from '@angular/core';
import { FoodService } from 'src/app/services/food.service';
import { Tag } from 'src/app/shared/models/Tag';

@Component({
  // Component decorator specifying metadata for the component
  selector: 'app-tags', // Selector used to embed this component in HTML
  templateUrl: './tags.component.html', // Path to the component's HTML template
  styleUrls: ['./tags.component.css'] // Array of stylesheet files for the component
})
export class TagsComponent implements OnInit {
  // Property to store an array of Tag objects retrieved from the server
  tags?: Tag[];

  // Constructor method invoked when an instance of the component is created
  constructor(foodService: FoodService) {
    // Subscribe to the observable returned by the 'getAllTags' method of 'FoodService'
    foodService.getAllTags().subscribe(serverTags => this.tags = serverTags);
  }

  // Lifecycle hook called after the component has been initialized
  ngOnInit(): void {
    // Any additional initialization logic can be placed here
  }
}
