import React from "react";
import Joi from "joi-browser";
import Form from "./common/Form";
import { toast } from "react-toastify";
import { getBook, saveBook } from "../services/bookService";
import { getGenres } from "../services/genreService";

class BookForm extends Form {
  state = {
    data: {
      title: "",
      author: "",
      genreId: "",
      selectedTextFile: "",
      selectedCoverFile: "",
    },
    sizeValidationText: false,
    sizeValidationImg: false,
    genres: [],
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string().required().min(5).max(50).label("Title"),
    genreId: Joi.string().required().label("Genre"),
    author: Joi.string().required().min(5).max(50).label("Author"),
    selectedTextFile: Joi.string().required(),
    selectedCoverFile: Joi.string().required(),
  };

  async populateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }

  async populateBook() {
    try {
      const bookId = this.props.match.params.id;
      if (bookId === "new") return;

      const { data: book } = await getBook(bookId);
      this.setState({ data: this.mapToViewModel(book) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateGenres();
    await this.populateBook();
  }

  mapToViewModel(book) {
    return {
      _id: book._id,
      author: book.author,
      title: book.title,
      genreId: book.genre._id,
    };
  }

  doSubmit = async () => {
    if (this.state.sizeValidation) {
      alert("too big");
    } else {
      await saveBook(this.state.data);

      this.props.history.push("/books");
    }
  };

  setFileData = (data) => {
    this.validateSize(data);
    this.setState({ data });
  };

  validateSize(file) {
    const { selectedCoverFile, selectedTextFile } = file;
    const sizeTextFile =
      selectedTextFile && Math.round(selectedTextFile.length * (3 / 4) - 2);

    const sizeImgFile =
      selectedCoverFile && Math.round(selectedCoverFile.length * (3 / 4) - 2);

    if (selectedTextFile && sizeTextFile > 3000000) {
      this.setState({
        sizeValidationText: true,
      });
      toast.error("The Text file is too big!");
    }
    if (selectedTextFile && sizeTextFile < 3000000) {
      this.setState({
        sizeValidationText: false,
      });
    }
    if (selectedCoverFile && sizeImgFile > 3000000) {
      this.setState({
        sizeValidationImg: true,
      });
      toast.error("The Image file is too big!");
    }

    if (selectedCoverFile && sizeImgFile < 3000000) {
      this.setState({
        sizeValidationImg: false,
      });
    }
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <h1>Book Form</h1>
          {this.renderInput("title", "Title")}
          {this.renderInput("author", "Author")}
          {this.renderSelect("genreId", "Genre", this.state.genres)}
          {this.renderUploadFile("selectedTextFile", "Text File")}
          {this.renderUploadFile("selectedCoverFile", "Cover Image")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default BookForm;
