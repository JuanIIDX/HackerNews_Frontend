import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NewsService } from '../../services/news.service';
import { News } from '../../models/news.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {

  //Lista de noticias
  news_list: News[] = [];


  //Variables de paginacion
  currentPage: number = 0;
  totalPages: number = 0;

  //Variables de filtrado
  selectedFilter = '';



  likedNews: string[] = [];
  favorites: string[] = []; // Array para almacenar los IDs de las noticias favoritas

  newsList: News[] = [];
  displayedNews: News[] = [];
  showFavorites: boolean = false;
  showingFaves: boolean = false;

  constructor(private newsService: NewsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    //Esta atento a cuando se cambia el parametro de la url, y si cambia el parametro de la pagina, se actualiza la pagina
    this.route.queryParams.subscribe(params => {
      this.currentPage = params['page'] || 1;
      this.selectedFilter = params['query'] || '';
      this.getNewsQuery(this.selectedFilter, this.currentPage);
    });
    this.getNewsQuery('', this.currentPage);

  }

  ngOnDestroy() {
    console.log('NewsComponent destroyed');
  }


  /**
   * Fetches news articles based on a search query and page number.
   * 
   * @param query - The search query string to filter news articles.
   * @param page - The page number for pagination of the news articles.
   * 
   * @returns void
   */
  getNewsQuery(query: string, page: number): void {
    this.newsService.getNewsWithQuery(query, page, 8).subscribe(data => {
      this.totalPages = data.nbPages;
      this.news_list = data.hits;
    
    }
    );
  }

  /**
   * Handles the page change event and updates the current page.
   * Fetches the news data for the new page.
   *
   * @param event - The event object containing the new page information.
   */
  pageChanged(event: any) {
    this.currentPage = event.page;
    this.getNewsQuery('', this.currentPage);
  }

  goToPage(sum: string): void {


    let newPage = this.currentPage;

    if (sum === 'next') {
      newPage++;
    }
    if (sum === 'prev') {
      newPage--;
    }
    if (sum === 'first') {
      newPage = 1;
    }
    if (sum === 'last') {
      newPage = this.totalPages;
    }



    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { 'page': newPage },
      queryParamsHandling: 'merge'
    });

  }



  seleccionarOpcion(event: Event): void {
    if ((event.target as HTMLSelectElement).value === '') {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { 'page': 0 },
      });
    }
    else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { 'page': 0, 'query': (event.target as HTMLSelectElement).value },
        queryParamsHandling: 'merge'
      });
      const valorSeleccionado = (event.target as HTMLSelectElement).value;
      console.log('Opción seleccionada:', valorSeleccionado);
    }
  }





    mostrarTodos() {
      this.showFavorites = false;
    }

    mostrarFavoritos() {
      this.showFavorites = true;
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

    toggleLike(newsId: string): void {
      if(this.likedNews.includes(newsId)) {
      this.likedNews = this.likedNews.filter(id => id !== newsId);
    } else {
      this.likedNews.push(newsId);
    }
    localStorage.setItem('likedNews', JSON.stringify(this.likedNews));
  }

  isLiked(newsId: string): boolean {
    return this.likedNews.includes(newsId);
  }

  onRowClick(url: string): void {
    window.open(url, '_blank');
  }

  //---------------------------



  //---------------------------
  applyFilter(): void {
    if (this.showingFaves) {
      this.displayedNews = this.newsList.filter(news => this.likedNews.includes(news.objectID));
    } else if (this.selectedFilter !== 'All') {
      this.displayedNews = this.newsList.filter(news => news.tags.includes(this.selectedFilter));
    } else {
      this.displayedNews = this.newsList;
    }
  }

  toggleFaves(): void {
    this.showingFaves = !this.showingFaves;
    this.applyFilter();
  }

  onFilterChange(): void {
    this.applyFilter();
  }




}
