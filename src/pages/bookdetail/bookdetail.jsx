import "./bookdetail.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Helmet } from "react-helmet";
import { getAuth } from "firebase/auth";
import BookService from "../../firebase/bookService";

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

  const handleToggleBook = async () => {
    const user = auth.currentUser;

    if (!user) {
      setError("You must be logged in to modify your book list.");
      return;
    }

    try {
      if (isBookInList) {
        // Remove book using isbn13 as document ID
        await bookService.removeBook(user.uid, id);
        setIsBookInList(false);
        setError(null);
      } else {
        // Validate required fields
        if (!book?.title) {
          setError("Book title is missing.");
          return;
        }
        const bookData = {
          title: book.title,
          isbn13: book.isbn13 || id,
          authors: book.authors || "Unknown",
          num_pages: book.num_pages || 0,
          published_year: book.published_year || "",
          average_rating: book.average_rating || 0,
          categories: book.categories || "",
          thumbnail: book.thumbnail || "",
          description: book.description || "",
        };

        // Add book using isbn13 as document ID
        await bookService.addBook(user.uid, id, bookData);
        setIsBookInList(true);
        setError(null);
      }
    } catch (err) {
      console.error("Error modifying book list:", err);
      setError(err.message || "Failed to modify the book list. Try again.");
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <section id="forum-main" className="position-relative padding-large">
      <div className="container">
        <Helmet>
          <title>{book.title || "Book"} - BookNest</title>
        </Helmet>
        <h1>
          <strong>{book.title || "Untitled"}</strong>
        </h1>
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
            <p><strong>Author:</strong> {book.authors || "Unknown"}</p>
            <p><strong>Pages:</strong> {book.num_pages || "N/A"}</p>
            <p><strong>Published Year:</strong> {book.published_year || "N/A"}</p>
            <p><strong>Average Rating:</strong> {book.average_rating || "N/A"}</p>
            <p><strong>Categories:</strong> {book.categories || "N/A"}</p>
          </div>
        </div>

        <div className="mt-4">
          <button
            className="btn btn-primary"
            onClick={handleToggleBook}
            disabled={!auth.currentUser}
          >
            {isBookInList ? "Remove from MyBook List" : "Add to MyBook List"}
          </button>
          {error && <div className="text-danger mt-2">{error}</div>}
        </div>

        <div className="book-description mt-4">
          <h3><strong>Description</strong></h3>
          <p>{book.description || "No description available."}</p>
        </div>
      </div>
    </section>
  );
};

export default BookDetail;