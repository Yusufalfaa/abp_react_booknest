import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "./mybooks.css";
import { auth, db, collection, getDocs } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import BookService from "../../firebase/bookService"; // Import BookService

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bookService = new BookService();
  const navigate = useNavigate(); // For redirecting to book details

  useEffect(() => {
    document.title = "My Favorite Books - BookNest";

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        setUserId(uid);
        try {
          const userBooksRef = collection(db, "users", uid, "books");
          const snapshot = await getDocs(userBooksRef);
          const bookList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBooks(bookList);
        } catch (error) {
          console.error("Failed to fetch books:", error);
          setError("Failed to load your books.");
        } finally {
          setLoading(false);
        }
      } else {
        console.warn("User not logged in");
        setBooks([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteBook = async (bookId) => {
    if (!userId) {
      setError("User not logged in.");
      return;
    }

    try {
      await bookService.removeBook(userId, bookId);
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
      setError(null);
    } catch (err) {
      console.error("Error deleting book:", err);
      setError(err.message || "Failed to delete the book. Try again.");
    }
  };

  const handleBookClick = (isbn13) => {
    navigate(`/bookdetail/${isbn13}`);
  };

  return (
    <div className="mybooks-container">
      <h1>MyBooks</h1>

      {error && <div className="text-danger mb-3">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : books.length === 0 ? (
        <p>You haven't added any books yet.</p>
      ) : (
        <table className="book-table">
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Author(s)</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>
                  <img
                    src={
                      book.thumbnail || "https://via.placeholder.com/80x120"
                    }
                    alt={book.title || "Book cover"}
                    className="book-cover"
                    style={{ cursor: "pointer" }} // Indicate clickable
                    onClick={() => handleBookClick(book.isbn13 || book.id)}
                  />
                </td>
                <td>{book.title || "Untitled"}</td>
                <td>{book.authors || "Unknown Author"}</td>
                <td><strong>{book.average_rating || "-"}</strong></td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteBook(book.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyBooks;