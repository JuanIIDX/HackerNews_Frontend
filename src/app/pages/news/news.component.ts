import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {

//test de impresion
  news= [
  {
    id: '1',
    source: { name: 'TechCrunch' },
    title: 'New AI Technology Revolutionizes Industry',
    description: 'A groundbreaking AI technology is set to revolutionize the industry, offering unprecedented capabilities and efficiency.',
    url: 'https://techcrunch.com/new-ai-technology'
  },
  {
    id: '2',
    source: { name: 'BBC News' },
    title: 'Global Markets Rally Amid Economic Optimism',
    description: 'Global markets are experiencing a significant rally as economic optimism continues to grow among investors.',
    url: 'https://bbc.com/global-markets-rally'
  },
  {
    id: '3',
    source: { name: 'The Verge' },
    title: 'Latest Smartphone Features Unveiled',
    description: 'The latest smartphone model has been unveiled, boasting cutting-edge features and improvements over its predecessor.',
    url: 'https://theverge.com/latest-smartphone-features'
  },
  {
    id: '4',
    source: { name: 'CNN' },
    title: 'Breakthrough in Renewable Energy Technology',
    description: 'A new breakthrough in renewable energy technology promises to make clean energy more accessible and affordable.',
    url: 'https://cnn.com/renewable-energy-breakthrough'
  },
  {
    id: '5',
    source: { name: 'Reuters' },
    title: 'Healthcare Advances: New Treatments on the Horizon',
    description: 'Recent advances in healthcare are paving the way for new treatments and therapies that could improve patient outcomes.',
    url: 'https://reuters.com/healthcare-advances'
  }
      ];







  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  selectedFilter = 'all';
  favorites: string[] = []; // Array para almacenar los IDs de las noticias favoritas



  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.getNews();
    //this.loadFavoritesFromLocalStorage();
  }

  ngOnDestroy() {
    console.log('NewsComponent destroyed');
  }

  //------------------------------------
  getNews(){

    this.newsService.getNews().subscribe(data => {
      console.log(data);
    });
  }

    pageChanged(event: any) {
    this.currentPage = event.page;
    this.getNews();
  }

  toggleFavorite(news: any) {
    const index = this.favorites.indexOf(news.id);
    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(news.id);
    }
    this.saveFavoritesToLocalStorage();
  }

  isFavorite(news: any) {
    return this.favorites.includes(news.id);
  }

  openNews(url: string) {
    window.open(url, '_blank');
  }

  saveFavoritesToLocalStorage() {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  loadFavoritesFromLocalStorage() {
    const favoritesString = localStorage.getItem('favorites');
    if (favoritesString) {
      this.favorites = JSON.parse(favoritesString);
    }


  }

  onMouseOver(event: MouseEvent) {
    (event.target as HTMLElement).style.opacity = '0.8';
  }

  onMouseOut(event: MouseEvent) {
    (event.target as HTMLElement).style.opacity = '1';
  }


}
