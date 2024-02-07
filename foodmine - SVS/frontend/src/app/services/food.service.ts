import { Injectable } from '@angular/core';
import { sample_foods, sample_tags } from 'src/environments/data';
import { Food } from '../shared/models/Food';
import { Tag } from '../shared/models/Tag';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FOODS_BY_ID_URL, FOODS_BY_SEARCH_URL, FOODS_BY_TAG_URL, FOODS_URL } from '../shared/constants/urls';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) { }

  // Method to fetch all food items
  getAll(): Observable<Food[]> {
    return this.http.get<Food[]>(FOODS_URL);
  }

  // Method to fetch all food items based on a search term
  getAllFoodsBySearchTerm(searchTerm: string): Observable<Food[]> {
    return this.http.get<Food[]>(FOODS_BY_SEARCH_URL + searchTerm);
  }

  // Method to fetch all available tags
  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(FOODS_BY_TAG_URL);
  }

  // Method to fetch food items based on a specific tag
  getAllFoodsByTag(tag: string): Observable<Food[]> {
    // If the tag is "All", fetch all food items; otherwise, fetch based on the tag
    return tag === "All" ?
      this.getAll() :
      this.http.get<Food[]>(FOODS_BY_TAG_URL + tag);
  }

  // Method to fetch a specific food item by its ID
  getFoodById(foodId: string): Observable<Food> {
    return this.http.get<Food>(FOODS_BY_ID_URL + foodId);
  }
}
