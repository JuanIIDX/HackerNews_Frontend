import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../models/news.model';
import { News_List } from '../models/news_list.model';



@Injectable({
  providedIn: 'root'
})
export class NewsService {


  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getNews();
  }

  ngOnDestroy() {
    console.log('NewsService destroyed');
  }

  //Crea un metodo que llama el servicio de busqueda de noticias y el json que devuelve lo imprime en la cons

  getNews(): Observable<News_List> {
    return this.http.get<News_List>('http://hn.algolia.com/api/v1/search');
  }

  //Obtiene la busqueda de noticias igual que el metodo anterior, de la forma https://hn.algolia.com/api/v1/search_by_date?query=angular&page=0
  //Si el query es vacio, no se busca con query, y si no tiene page, se devuelve la primera pagina, osea la 0
  getNewsWithQuery(query: string, page: number, number_hits:number): Observable<News_List> {
    let new_url:string= 'https://hn.algolia.com/api/v1/search_by_date?'
    if (query != "") {
      new_url = new_url + 'query=' + query;
    }


    if (page > 0) {
      new_url = new_url + '&page=' + page;
    }
    else {
      new_url = new_url + '&page=0';
    }

    if (number_hits > 0) {
      new_url = new_url + '&hitsPerPage=' + number_hits;
    }
    else {
      new_url = new_url + '&hitsPerPage=1';
    }


    console.log('url de busqueda');
    console.log(new_url);

    return this.http.get<News_List>(new_url);






  }


}
