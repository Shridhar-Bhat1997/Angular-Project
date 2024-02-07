import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  // Input property to control the visibility of the component
  @Input()
  visible = false;

  // Input property to set the not found message (default: "Nothing Found!")
  @Input()
  notFoundMessage = "Nothing Found!";

  // Input property to set the text for the reset link (default: "Reset")
  @Input()
  resetLinkText = "Reset";

  // Input property to set the route for the reset link (default: "/")
  @Input()
  resetLinkRoute = "/";

  constructor() { }

  ngOnInit(): void {
    // Initialization logic if needed
  }
}
