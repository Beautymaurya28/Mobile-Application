import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  message = 'The sky awaits your touch...';

  changeMessage() {
    this.message = '💫 The stars have answered, Nova. You are radiant.';
  }
}
