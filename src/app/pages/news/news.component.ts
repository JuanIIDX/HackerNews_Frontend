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
  news_list_favorites: News[] = [];


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
      this.loadLikedNews();
      this.getNewsQuery(this.selectedFilter, this.currentPage);
    });

    this.loadLikedNews();
    this.getNewsQuery('', this.currentPage);

  }

  ngOnDestroy() {
    console.log('NewsComponent destroyed');
  }


  

  //Metodo que carga las noticias con like en el localStorage en la variable likedNews, revisa primero si existe en el local storage, si no existe, se crea y se deja vacio el vector
  loadLikedNews(): void {
    //imprime en consola el localStorage
    console.log(localStorage.getItem('likedNews'));
    const likedNews = localStorage.getItem('likedNews');
    this.likedNews = likedNews ? JSON.parse(likedNews) : [];
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


  select_favorite(id_noticia:string): void {

    //Se comprueba primero si en el localStorage ya existe la likedNews, si no existe, se crea
    if (localStorage.getItem('likedNews') === null) {
      localStorage.setItem('likedNews', JSON.stringify(this.likedNews));
    } else {
      //Si ya existe las likedNews en el localStorage, se agregan mas datos, sino
      const likedNewsString = localStorage.getItem('likedNews');
      this.likedNews = likedNewsString ? JSON.parse(likedNewsString) : [];
    }


    //Se toma la lista de likedNews y se busca si ya existe el id_noticia, si no existe, se agrega, si existe se elimina
    const index = this.likedNews.indexOf(id_noticia.toString());
    if (index === -1) {
      this.likedNews.push(id_noticia.toString());

      //Se agrega en el localStorage
      localStorage.setItem('likedNews', JSON.stringify(this.likedNews));

    } else {
      this.likedNews.splice(index, 1);

      //Se elimina el item del localStorage
      localStorage.setItem('likedNews', JSON.stringify(this.likedNews));

    }


    //Se imprime en consola el localStorage
    console.log(localStorage.getItem('likedNews'));
    
  }

  navigateToUrl(url: string): void {

    window.location.href = url;

  }

  isFavoriteNews(id_noticia:string): boolean {
    //Se busca si el id_noticia esta en la lista de likedNews, si esta, se retorna true, si no esta, se retorna false
    return this.likedNews.includes(id_noticia.toString());
  }

  //Metodo que se encarga de decir si se puede mostrar o no una noticia favorita, compara el showFavorites con isFavoriteNews y retorna true o false
  canShowNews(id_noticia:string): boolean {
    if (this.showFavorites === false) {
      return true;
    }
    return this.isFavoriteNews(id_noticia);
  }

  //retorna la lista de noticias
  getNews(): News[] {
    //si mostrar favoritos es true se retorna la lista de noticias filtrada por likedNews
    if(this.showFavorites === true) {
      return this.news_list.filter(news => this.likedNews.includes(news.objectID));
    }

    return this.news_list;
  }




}
