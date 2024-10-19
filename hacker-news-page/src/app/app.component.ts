import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NewsComponent } from "./pages/news/news.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NewsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hacker-news-page';



  ngOnInit() {
    console.log('AppComponent initialized');
  }

  ngOnDestroy() {
    console.log('AppComponent destroyed');
  }



}
