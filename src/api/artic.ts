import axios from 'axios';
import type { Artwork } from '../types';



const BASE = 'https://api.artic.edu/api/v1/artworks';

export async function fetchArtworks(page = 1, limit = 10) {
  const fields = [
    'id', 'title', 'place_of_origin', 'artist_display',
    'inscriptions', 'date_start', 'date_end'
  ].join(',');

  const res = await axios.get(BASE, {
    params: { page, limit, fields }
  });

  // API returns data in res.data.data, pagination in res.data.pagination
  const data = res.data.data as Artwork[];
  const pagination = res.data.pagination || {};
  // pagination.total is usually available (total records). Fallback to total_pages*limit if needed.
  const total = pagination.total ?? (pagination.total_pages ? pagination.total_pages * (pagination.limit ?? limit) : 0);

  return { data, total };
}

export async function fetchArtworkById(id: number) {
  const res = await axios.get(`${BASE}/${id}`);
  return res.data.data as Artwork;


}
