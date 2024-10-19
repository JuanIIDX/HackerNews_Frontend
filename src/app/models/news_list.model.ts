

import { News } from './news.model';

export interface News_List {
    hits: News[];
    page: number;
    nbPages: number;
    nbHits: number;
    hitsPerPage: number;
    exhaustiveNbHits: boolean;
    query: string;
    params: string;
    processingTimeMS: number;
}