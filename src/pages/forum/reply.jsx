import { useState, useEffect } from "react";
import { Link } from "react-router-dom";  // Pastikan Link dari react-router-dom diimpor
import { db, collection, getDocs } from "../../firebase/firebase";  // Pastikan sudah diimpor dari firebase
import './reply.css';  // Pastikan untuk menggunakan file CSS yang sesuai

const ForumPage = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const forumsRef = collection(db, "forums");
        const querySnapshot = await getDocs(forumsRef);
        const forumsList = querySnapshot.docs.map((doc) => doc.data());
        setForums(forumsList);
      } catch (error) {
        console.error("Error fetching forums: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForums();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForumPage;
