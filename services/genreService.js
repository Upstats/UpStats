import http from "./httpService";

export function getGenres() {
  return http.get("/genres");
}
