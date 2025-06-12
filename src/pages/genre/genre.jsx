import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import './genre.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar, faStarHalfAlt  } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";


const Genre = () => {
  const { genre } = useParams();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'books'));
        const fetchedBooks = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((book) =>
            (book.categories || '').toLowerCase().includes(genre.toLowerCase())
          );
        setBooks(fetchedBooks);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error fetching books: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [genre]);

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


  return (
    <div className="container">
      <h1 className="text-center" style={{ marginTop: '32px', fontWeight: 700 }}>{genre} Books</h1>

      {loading ? (
        <p className="text-center mt-4">Loading...</p>
      ) : books.length === 0 ? (
        <p className="text-center mt-4">No books found for this category</p>
      ) : (
        <>
          {/* Book Grid */}
          <div className="book-grid">
            {displayedBooks.map((book) => (
              <div
                key={book.id}
                className="book-card"
                onClick={() => navigate(`/bookdetail/${book.id}`)}
              >
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="book-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
                <div className="book-ratingg">
                    {renderStars(book.average_rating || 0)}
                    <span className="rating-number">
                      {(book.average_rating || 0).toFixed(1)}
                    </span>
                </div>
                <p className="book-title">{book.title}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <nav aria-label="Page navigation example" style={{ marginTop: '32px' }}>
            <div className="pagination-wrapper">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled previous' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Prev</button>
                </li>

                <li className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
                </li>

                {currentPage > 4 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}

                {generatePageNumbers().map((page) => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                  </li>
                ))}

                {currentPage < totalPages - 3 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}

                {totalPages > 1 && (
                  <li className={`page-item ${currentPage === totalPages ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(totalPages)}>
                      {totalPages}
                    </button>
                  </li>
                )}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                </li>
              </ul>
            </div>
          </nav>
        </>
      )}
    </div>
  );
};

export default Genre;
