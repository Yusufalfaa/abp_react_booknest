import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

import './allbooks.css';

const AllBooks = ({ selectedGenre }) => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(db, 'books'));
      const allBooks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(allBooks);
    };
    fetchBooks();
  }, []);

  const totalPages = Math.ceil(books.length / pageSize);
  const displayedBooks = books.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const generatePageNumbers = () => {
  const pages = [];

  // Hanya tampilkan halaman di sekitar currentPage (tanpa 1 dan totalPages)
  for (
    let i = Math.max(2, currentPage - 2);
    i <= Math.min(currentPage + 2, totalPages - 1);
    i++
  ) {
    pages.push(i);
  }

  return pages;
};


  return (
    <section id="latest-posts" className="padding-large">
      <div className="container">
        {/* Title */}
        <div className="section-title d-flex justify-content-center align-items-center mb-4">
          <h1 style={{ textAlign: 'center', width: '100%' }}>
            {selectedGenre ? `Books in ${selectedGenre}` : 'All Books'}
          </h1>
        </div>

        {/* Grid of Books */}
        <div className="book-grid">
          {displayedBooks.map((book) => (
            <div key={book.isbn13} className="book-card">
              <a href={`/bookdetail/${book.isbn13}`}>
                <img
                  src={book.thumbnail || 'https://m.media-amazon.com/images/I/51DPUA--50L._SY445_SX342_.jpg'}
                  alt={book.title}
                  className="book-cover"
                />
              </a>
              <a  href={`/bookdetail/${book.isbn13}`} className="book-title" title={book.title}>
                {book.title}
              </a>
            </div>
          ))}
        </div>

        {/* Pagination */}
{/* Pagination */}
<nav aria-label="Page navigation example" style={{ marginTop: '32px' }}>
  <div className="pagination-wrapper">
    <ul className="pagination justify-content-center">
      {/* Previous Button */}
      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
          Prev
        </button>
      </li>

      {/* Page 1 */}
      <li className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
        <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
      </li>

      {/* ... after 1 */}
      {currentPage > 4 && (
        <li className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      )}

      {/* Middle Pages */}
      {generatePageNumbers().map((page) => (
        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
        </li>
      ))}

      {/* ... before last page */}
      {currentPage < totalPages - 3 && (
        <li className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      )}

      {/* Last Page */}
      {totalPages > 1 && (
        <li className={`page-item ${currentPage === totalPages ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </button>
        </li>
      )}

      {/* Next Button */}
      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
          Next
        </button>
      </li>
    </ul>
  </div>
</nav>

      </div>
    </section>
  );
};

export default AllBooks;