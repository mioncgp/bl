import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BooksTable from "./BooksTable";
import ListGroup from "./common/ListGroup";
import Pagination from "./common/Pagination";
import { getBooks, deleteBook } from "../services/bookService";
import { getGenres } from "../services/genreService";
import { paginate } from "../utils/paginate";
import { increaseDowloadsBook, onLike } from "../services/bookService";
import { getCurrentUser } from "../services/authService";
import Loader from "react-loader-spinner";
import SearchBox from "./SearchBox";
import _ from "lodash";

class Books extends Component {
  state = {
    books: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" },
    dataLoaded: false,
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: "", name: "All Genres" }, ...data];

    const { data: books } = await getBooks();
    this.setState({ books, genres, dataLoaded: true });
  }

  handleDelete = async (book) => {
    const originalBooks = this.state.books;
    const books = originalBooks.filter((m) => m._id !== book._id);
    this.setState({ books });

    try {
      await deleteBook(book._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This book has already been deleted.");

      this.setState({ books: originalBooks });
    }
  };

  handleLike = async (book) => {
    const books = [...this.state.books];
    const index = books.indexOf(book);
    books[index] = { ...books[index] };
    books[index].liked = !books[index].liked;
    this.setState({ books });
    const userId = getCurrentUser();
    await onLike(book._id, userId._id);
    window.location.reload();
  };

  increaceDowload = async (book) => {
    const addedBook = { ...book };
    addedBook.genreId = book.genre._id;
    delete addedBook.genre;
    await increaseDowloadsBook(addedBook);
    window.location.reload();
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedGenre,
      searchQuery,
      books: allBooks,
    } = this.state;

    let filtered = allBooks;
    if (searchQuery)
      filtered = allBooks.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allBooks.filter((m) => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const books = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: books };
  };

  render() {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      dataLoaded,
      currentImage,
    } = this.state;
    const { user } = this.props;

    if (!dataLoaded) {
      return (
        <Loader
          type="Puff"
          color="#00BFFF"
          height={200}
          width={100}
          timeout={30000000}
        />
      );
    }

    const { totalCount, data: books } = this.getPagedData();

    return (
      <React.Fragment>
        <div className="row">
          <div className="container">
            <ListGroup
              items={this.state.genres}
              selectedItem={this.state.selectedGenre}
              onItemSelect={this.handleGenreSelect}
            />
          </div>
        </div>
        <div className="row">
          <div className="container">
            <div className="col-sm">
              {user && (
                <Link
                  to="/books/new"
                  className="btn btn-primary "
                  style={{ marginBottom: 20 }}
                >
                  New Book
                </Link>
              )}
            </div>
            <div className="col-sm">
              <p>Showing {totalCount} books in the database.</p>
            </div>
          </div>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <BooksTable
            currentImage={currentImage}
            increaceDowload={this.increaceDowload}
            books={books}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Books;
