import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewsComponent } from "./pages/news/news.component";
import { HeaderComponent } from './header/header.component'; 



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NewsComponent, HeaderComponent],
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
