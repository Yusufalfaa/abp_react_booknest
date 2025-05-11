import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { Link } from 'react-router-dom';
import './forum.css';

function Forum() {
  const [forums, setForums] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchForums = async () => {
      const querySnapshot = await getDocs(collection(db, 'forums'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setForums(data);
    };
    fetchForums();
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

  return (
    <section id="forum-main" className="position-relative padding-large forum-main">
      <div className="container">
        <div className="top-discuss">
          <div className="section-title d-flex flex-column mb-2">
            <h3 className="mb-1 mt-3">Let's Talk</h3>
            <p>Sharing, find support, and connect with the community</p>
          </div>

          <div className="mb-4">
            <Link to="/newForum" className="btn btn-sm btn-new-discussion rounded-3">
              New Discussion
            </Link>
          </div>

          <div className="mb-3">
            <Link to="/forum?sort=popular" className="btn btn-sm me-3 rounded-3">
              Popular
            </Link>
            <Link to="/forum?sort=latest" className="btn btn-sm rounded-3">
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
