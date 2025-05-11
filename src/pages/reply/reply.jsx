import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db, doc, getDoc, collection, getDocs } from "../../firebase/firebase";
import './reply.css';

const ForumDetailPage = () => {
  const [forum, setForum] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(useLocation().search);
  const forumId = queryParams.get("forumId");

  useEffect(() => {
  const fetchData = async () => {
    try {
      // Mengambil data forum berdasarkan forumId
      const forumRef = doc(db, "forums", forumId);
      const forumSnap = await getDoc(forumRef);

      if (forumSnap.exists()) {
        setForum({ id: forumSnap.id, ...forumSnap.data() });

        // Mengambil balasan (replies) dari subcollection "replies" dalam forum tersebut
        const repliesRef = collection(forumRef, "replies");
        const replySnap = await getDocs(repliesRef);

        const replyList = replySnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setReplies(replyList);
      } else {
        console.error("Forum not found");
      }
    } catch (error) {
      console.error("Error fetching forum or replies:", error);
    } finally {
      setLoading(false);
    }
  };

  if (forumId) fetchData();
}, [forumId]);


  if (loading) return <div className="loading">Loading...</div>;

  return (
  <div className="forum-detail">
    {/* Top container for forum */}
    <div className="container-top card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="fw-bold">{forum.title}</h5>
        <p className="mb-1">
          {forum.username || 'Unknown User'} -{" "}
          {forum.date?.seconds
            ? new Date(forum.date.seconds * 1000).toLocaleString()
            : 'Unknown Date'}
        </p>
        <p>{forum.content}</p>
      </div>
    </div>

    {/* Bottom container for replies */}
    <div className="container-bottom">
      {replies.length === 0 ? (
        <p className="text-center">No replies yet.</p>
      ) : (
        replies.map(reply => (
          <div className="card mb-3 border shadow-sm" key={reply.id}>
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <div className="avatar-reply me-2">
                  <img
                    src="/assets/avt.jpg"
                    alt="Avatar"
                    className="rounded-circle"
                  />
                </div>
                <div>
                  <strong>{reply.username || "Anonymous"}</strong>
                  <br />
                  <small>
                    {reply.date?.seconds
                      ? new Date(reply.date.seconds * 1000).toLocaleString()
                      : "Unknown date"}
                  </small>
                </div>
              </div>
              {/* Conditionally add 'text-center' or 'text-left' */}
              <p className={reply.content ? 'text-left' : 'text-center'}>
                {reply.content}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
  );

};

export default ForumDetailPage;
