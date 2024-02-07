import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Array to store the list of foods to be displayed
  foods: Food[] = [];

  // Constructor with injected services and ActivatedRoute
  constructor(private foodService: FoodService, activatedRoute: ActivatedRoute) {
    // Observable to fetch food data based on route parameters
    let foodObservable: Observable<Food[]>;

    // Subscribe to changes in route parameters
    activatedRoute.params.subscribe((params) => {
      // Check if a search term is provided in the route parameters
      if (params.searchTerm)
        foodObservable = this.foodService.getAllFoodsBySearchTerm(params.searchTerm);
      // Check if a tag is provided in the route parameters
      else if (params.tag)
        foodObservable = this.foodService.getAllFoodsByTag(params.tag);
      // If no specific criteria is provided, fetch all foods
      else
        foodObservable = foodService.getAll();

      // Subscribe to the foodObservable to update the foods array
      foodObservable.subscribe((serverFoods) => this.foods = serverFoods);
    });
  }

  ngOnInit(): void {
    // ngOnInit is a lifecycle hook called after the component is initialized
  }
}
