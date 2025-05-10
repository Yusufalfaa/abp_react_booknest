import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { Link } from 'react-router-dom';
import './forum.css'; // pastikan file CSS-nya diimpor

function Forum() {
  const [forums, setForums] = useState([]);

  useEffect(() => {
    const fetchForums = async () => {
      const querySnapshot = await getDocs(collection(db, 'forums'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setForums(data);
    };

    fetchForums();
  }, []);

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
          {forums.map(forum => (
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
      </div>
    </section>
  );
}

export default Forum;
