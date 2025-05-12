import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase'; // Import auth dari Firebase
import { onAuthStateChanged } from 'firebase/auth'; // Import untuk cek status login

import './forum.css';

function Forum() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sort = searchParams.get('sort') || 'latest';

  const [forums, setForums] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State untuk status login
  const pageSize = 5;

  const navigate = useNavigate(); // Hook untuk navigasi

  useEffect(() => {
    const fetchForums = async () => {
      const querySnapshot = await getDocs(collection(db, 'forums'));
      let data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Sorting
      if (sort === 'popular') {
        data.sort((a, b) => (b.replies || 0) - (a.replies || 0));
      } else {
        // default: latest
        data.sort((a, b) => {
          const dateA = a.date?.seconds || 0;
          const dateB = b.date?.seconds || 0;
          return dateB - dateA;
        });
      }

      setForums(data);
      setCurrentPage(1); 
    };

    fetchForums();
  }, [sort]);

  useEffect(() => {
    // Mengecek apakah pengguna sudah login
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Jika ada user, setIsLoggedIn ke true
    });

    return () => unsubscribe(); // Cleanup saat komponen dibersihkan
  }, []);

  const totalPages = Math.ceil(forums.length / pageSize);
  const displayedForums = forums.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  const handleNewDiscussionClick = () => {
    if (!isLoggedIn) {
      alert('You must be logged in to create a new discussion.');
      navigate('/login'); // Redirect ke halaman login
    }
  };

  return (
    <section id="forum-main" className="position-relative padding-large forum-main">
      <div className="container">
        <div className="top-discuss">
          <div className="section-title d-flex flex-column mb-2">
            <h3 className="mb-1 mt-3">Let's Talk</h3>
            <p>Sharing, find support, and connect with the community</p>
          </div>

          <div className="mb-4">
            {/* Jika belum login, tampilkan pesan atau redirect ke login */}
            {isLoggedIn ? (
              <Link to="/createforum" className="btn btn-sm btn-new-discussion rounded-3">
                New Discussion
              </Link>
            ) : (
              <button 
                className="btn btn-sm btn-new-discussion rounded-3"
                onClick={handleNewDiscussionClick}
              >
                New Discussion
              </button>
            )}
          </div>

          <div className="sort-toggle-wrapper p-1 mb-3 d-inline-flex rounded-3">
            <Link
              to="/forum?sort=popular"
              className={`sort-toggle-button ${sort === 'popular' ? 'active' : ''}`}
            >
              Popular
            </Link>
            <Link
              to="/forum?sort=latest"
              className={`sort-toggle-button ${sort === 'latest' ? 'active' : ''}`}
            >
              Latest
            </Link>
          </div>
        </div>

        <div className="bottom-discuss">
          {displayedForums.map(forum => (
            <div className="card mb-3 border shadow-sm" key={forum.id}>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="avatar-reply me-3">
                    <img
                      src="/assets/avt.jpg"
                      alt="Avatar"
                      className="rounded-circle"
                    />
                  </div>
                  <div className="forum-profile">
                    <h6 className="text-bold mt-1">{forum.username || 'Unknown User'}</h6>
                    <small className="date-forum">
                      {forum.date?.seconds
                        ? new Date(forum.date.seconds * 1000).toLocaleString()
                        : 'Unknown Date'}
                    </small>
                  </div>
                </div>

                <Link
                  to={`/discuss?forumId=${forum.id}`}
                  className="card-title fw-bold text-decoration-none"
                >
                  {forum.title}
                </Link>

                <p className="post-content">{forum.content}</p>

                <div className="post-footer d-flex justify-content-start align-items-center">
                  <Link
                    to={`/discuss?forumId=${forum.id}`}
                    className="btn-link discuss-link p-0 d-flex align-items-center"
                  >
                    <span className="reply-count">
                      <i className="bi bi-chat-left-text me-2"></i>
                      <strong>{forum.replies || 0}</strong> Reply(s)
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <nav aria-label="Page navigation example" style={{ marginTop: '32px' }}>
          <div className='pagination-wrapper'>
            <ul className="pagination justify-content-center">
              {/* Previous */}
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Prev</button>
              </li>

              {/* First Page */}
              <li className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
              </li>

              {/* ... */}
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

              {/* ... */}
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

              {/* Next */}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </section>
  );
}

export default Forum;
