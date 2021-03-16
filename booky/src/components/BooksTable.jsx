import React, { Component } from "react";
import auth from "../services/authService";
import { Link } from "react-router-dom";
import Table from "./common/Table";
import Like from "./common/like";

class BooksTable extends Component {
  // refactor the first column
  columns = [
    {
      key: "cover",
      content: (book) => (
        <a
          href={book.selectedTextFile}
          onClick={() => this.props.increaceDowload(book)}
          download
        >
          <img src={book.selectedCoverFile} alt={book.title} />
        </a>
      ),
      display: false,
    },
    {
      path: "title",
      label: "Title",
      content: (book) => (
        <Link to={`/books/${book._id}`} className="links">
          {book.title}
        </Link>
      ),
      display: true,
    },
    { path: "author", label: "Author", display: true },
    { path: "genre.name", label: "Genre", display: false },
    { path: "downloads", label: "Downloads", display: false },
    {
      key: "like",
      content: (book) => (
        <Like likes={book.likes} onClick={() => this.props.onLike(book)} />
      ),
      display: true,
    },
  ];

  deleteColumn = {
    key: "delete",
    content: (book) => (
      <button
        onClick={() => this.props.onDelete(book)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    ),
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.isAdmin) this.columns.push(this.deleteColumn);
  }

  render() {
    const { books, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={books}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default BooksTable;
