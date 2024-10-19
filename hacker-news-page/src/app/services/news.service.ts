import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NewsService {


  constructor(private http:HttpClient) { }

  ngOnInit() {
    this.getNews();  
  }

  ngOnDestroy() {
    console.log('NewsService destroyed');
  }

  //Crea un metodo que llama el servicio de busqueda de noticias y el json que devuelve lo imprime en la cons

  getNews(): Observable<any> {
    return this.http.get('http://hn.algolia.com/api/v1/search');
  }

}
