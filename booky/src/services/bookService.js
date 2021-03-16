import http from "./httpService";

const apiEndpoint = "/books";

function bookUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getBooks() {
  return http.get(apiEndpoint);
}

export function getBook(bookId) {
  return http.get(bookUrl(bookId));
}

export function saveBook(book) {
  if (book._id) {
    const body = { ...book };
    delete body._id;
    return http.put(bookUrl(book._id), body);
  }

  return http.post(apiEndpoint, book);
}

export function increaseDowloadsBook(book) {
  const body = { ...book };
  delete body._id;
  return http.put(bookUrl(book._id) + "/increase", body);
}

export function onLike(bookId, userId) {
  const body = { bookId, userId };
  return http.post(bookUrl("like"), body);
}

export function deleteBook(bookId) {
  return http.delete(bookUrl(bookId));
}
