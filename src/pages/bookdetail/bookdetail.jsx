import "./bookdetail.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Helmet } from "react-helmet";
import { getAuth } from "firebase/auth";
import BookService from "../../firebase/bookService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { Alert } from '../../components/Alerts/alert';

const BookDetail = () => {
  const { id } = useParams(); // This is isbn13 from AllBooks
  const [book, setBook] = useState(null);
  const [isBookInList, setIsBookInList] = useState(false);
  const [error, setError] = useState(null);
  const bookService = new BookService();
  const auth = getAuth();


  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const docRef = doc(db, "books", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const bookData = { id: docSnap.id, ...docSnap.data() };
          bookData.isbn13 = bookData.isbn13 || id; // Ensure isbn13
          setBook(bookData);
        } else {
          console.log("No such book document!");
          setError("Book not found.");
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("Failed to load book details.");
      }
    };

    const checkIfBookInList = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const bookRef = doc(db, "users", user.uid, "books", id); // Check by isbn13
          const bookSnap = await getDoc(bookRef);
          setIsBookInList(bookSnap.exists());
        } catch (err) {
          console.error("Error checking book in user collection:", err);
          setError("Failed to check book status.");
        }
      } else {
        setIsBookInList(false); // Reset if no user
      }
    };

    fetchBookDetails();
    checkIfBookInList();
  }, [id, auth.currentUser]); // Re-run when id or user changes

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={solidStar} color="#ffd700" />);
    }

    if (hasHalfStar && fullStars < 5) {
      stars.push(
        <FontAwesomeIcon key="half" icon={faStarHalfAlt} color="#ffd700" />
      );
    }

    const remaining = 5 - stars.length;
    for (let i = 0; i < remaining; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`empty-${i}`}
          icon={regularStar}
          color="#ffd700"
        />
      );
    }

    return stars;
  };

  const [alertConfig, setAlertConfig] = useState({ show: false, type: '', title: '', message: '' });

const showAlert = (type, title, message, duration = 2000) => {
  setAlertConfig({ show: true, type, title, message });
  setTimeout(() => {
    setAlertConfig({ show: false, type: '', title: '', message: '' });
  }, duration);
};

const handleToggleBook = async () => {
  const user = auth.currentUser;
  if (!user) {
    showAlert("warning", "Not Logged In", "You must be logged in to modify your book list.");
    return;
  }

  try {
    if (isBookInList) {
      await bookService.removeBook(user.uid, id);
      setIsBookInList(false);
      showAlert("success", "Removed", "Book removed from your list!");
    } else {
      if (!book?.title) {
        showAlert("warning", "Missing Title", "Book title is missing.");
        return;
      }

      const bookData = {
        title: book.title,
        isbn13: book.isbn13,
        authors: book.authors || "Unknown",
        num_pages: book.num_pages || 0,
        published_year: book.published_year || "",
        average_rating: book.average_rating || 0,
        categories: book.categories || "",
        thumbnail: book.thumbnail || "",
        description: book.description || "",
      };

      await bookService.addBook(user.uid, id, bookData);
      setIsBookInList(true);
      showAlert("success", "Added", "Book added to your list!");
    }
  } catch (err) {
    console.error("Error modifying book list:", err);
    showAlert("error", "Error", err.message || "Failed to modify the book list. Try again.");
  }
};


  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <section id="forum-main" className="position-relative padding-large">
      <div
        className="hero-section"
        style={{ backgroundImage: "url('/assets/bgDarker.png')" }}
      ></div>
      <div className="book-detail-container container">
        <Helmet>
          <title>{book.title || "Book"} - BookNest</title>
        </Helmet>
        <div className="book-info">
          <img
            src={
              book.thumbnail ||
              "https://m.media-amazon.com/images/I/51DPUA--50L._SY445_SX342_.jpg"
            }
            alt={book.title || "Book"}
            className="book-thumbnail"
          />
          <div className="book-details">
            <p className="title">{book.title || "Untitled"}</p>
            <p className="author">{book.authors || "Unknown"}</p>
            <div className="rating">
              {renderStars(book.average_rating || 0)}
              <span className="rating-number">
                {(book.average_rating || 0).toFixed(1)}
              </span>
            </div>
            <p className="desc">
              {book.description || "No description available."}
            </p>
            <div className="genre-hero">
              Genres: <p className="genre">{book.categories || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="book-button">
          <button
            className="btn btn-primary"
            onClick={handleToggleBook}
            disabled={!auth.currentUser}
          >
            {isBookInList ? "Remove from MyBook List" : "Add to MyBook List"}
          </button>

          {alertConfig.show && (
            <Alert
              type={alertConfig.type}
              title={alertConfig.title}
              message={alertConfig.message}
            />
          )}
          {error && <div className="text-danger mt-2">{error}</div>}

          <div className="book-button-info">
            <p className="page">{book.num_pages || "N/A"} Pages</p>
            <p className="year">Released in {book.published_year || "N/A"}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookDetail;
