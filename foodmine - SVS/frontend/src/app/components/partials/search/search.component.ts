import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchTerm = '';  // Variable to store the search term

  // Constructor with ActivatedRoute and Router injections
  constructor(activatedRoute: ActivatedRoute, private router: Router) {
    // Subscribe to changes in the route parameters
    activatedRoute.params.subscribe((params) => {
      // If there is a 'searchTerm' parameter in the route, update the 'searchTerm' variable
      if (params.searchTerm) {
        this.searchTerm = params.searchTerm;
      }
    });
  }

  ngOnInit(): void {
    // Lifecycle hook ngOnInit
  }

  // Method to perform a search
  search(term: string): void {
    // If a search term is provided, navigate to the search route with the term
    if (term) {
      this.router.navigateByUrl('/search/' + term);
    }
  }
}
