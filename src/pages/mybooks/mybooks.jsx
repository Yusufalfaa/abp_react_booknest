import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./mybooks.css";
import { auth, db, collection, getDocs } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import BookService from "../../firebase/bookService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { Alert } from "../../components/Alerts/alert";

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const navigate = useNavigate();
  const bookService = new BookService();

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
      localStorage.removeItem(`book-${bookId}`);
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
      setError(null);
      showAlert("success", "Removed", "Book removed from your list.");
    } catch (err) {
      console.error("Error deleting book:", err);
      showAlert("error", "Failed", err.message || "Failed to delete the book. Try again.");
    }
  };

  const handleBookClick = (isbn13) => {
    navigate(`/bookdetail/${isbn13}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={solidStar} color="#ffd700" />);
    }

    if (hasHalfStar && fullStars < 5) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} color="#ffd700" />);
    }

    const remaining = 5 - stars.length;
    for (let i = 0; i < remaining; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={regularStar} color="#ffd700" />);
    }

    return stars;
  };

  const totalPages = Math.ceil(books.length / pageSize);
  const displayedBooks = books.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    for (
      let i = Math.max(2, currentPage - 2);
      i <= Math.min(currentPage + 2, totalPages - 1);
      i++
    ) {
      pages.push(i);
    }
    return pages;
  };

  const [alertConfig, setAlertConfig] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  const showAlert = (type, title, message, duration = 2000) => {
    setAlertConfig({ show: true, type, title, message });

    setTimeout(() => {
      setAlertConfig((prev) => ({ ...prev, show: false }));
    }, duration);
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
        <>
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
              {displayedBooks.map((book) => (
                <tr key={book.id}>
                  <td>
                    <img
                      src={book.thumbnail || "https://via.placeholder.com/80x120"}
                      alt={book.title || "Book cover"}
                      className="book-cover-mb"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleBookClick(book.isbn13 || book.id)}
                    />
                  </td>
                  <td>{book.title || "Untitled"}</td>
                  <td>{book.authors || "Unknown Author"}</td>
                  <td>
                    <div className="book-ratingg">
                      {renderStars(book.average_rating || 0)}
                      <span className="rating-number">
                        {(book.average_rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteBook(book.id)}
                    >
                      Remove Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Page navigation example" style={{ marginTop: "32px" }}>
              <div className="pagination-wrapper">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Prev
                    </button>
                  </li>

                  <li className={`page-item ${currentPage === 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(1)}>
                      1
                    </button>
                  </li>

                  {currentPage > 4 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}

                  {generatePageNumbers().map((page) => (
                    <li
                      key={page}
                      className={`page-item ${currentPage === page ? "active" : ""}`}
                    >
                      <button className="page-link" onClick={() => handlePageChange(page)}>
                        {page}
                      </button>
                    </li>
                  ))}

                  {currentPage < totalPages - 3 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}

                  {totalPages > 1 && (
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </li>
                  )}

                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            </nav>
          )}
        </>
      )}

      {alertConfig.show && (
        <Alert
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          onClose={() => setAlertConfig((prev) => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
};

export default MyBooks;
