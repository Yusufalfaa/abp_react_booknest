import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db, doc, getDoc, collection, getDocs, addDoc, serverTimestamp } from "../../firebase/firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import './reply.css';

import { Alert } from "../../components/Alerts/alert.jsx";

const ForumDetailPage = () => {
  useEffect(() => {
    document.title = "Reply to Discussion - BookNest";
  }, []);


  const [forum, setForum] = useState(null);
  const [replies, setReplies] = useState([]);
  const [allReplies, setAllReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxReplyLength = 2000;

  const queryParams = new URLSearchParams(useLocation().search);
  const forumId = queryParams.get("forumId");

  const [alertConfig, setAlertConfig] = useState({ show: false, type: '', title: '', message: '' });

  const [currentPage, setCurrentPage] = useState(1);  
  const pageSize = 5;  

  const [totalPages, setTotalPages] = useState(1);

  // Handle user authentication state change
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Fetch forum and replies data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const forumRef = doc(db, "forums", forumId);
        const forumSnap = await getDoc(forumRef);

        if (forumSnap.exists()) {
          setForum({ id: forumSnap.id, ...forumSnap.data() });
        } else {
          console.error("Forum not found");
        }
      } catch (error) {
        console.error("Error fetching forum:", error);
      } finally {
        setLoading(false);
      }
    };

    if (forumId) fetchData();
  }, [forumId]);

  // Fetch all replies (not paginated)
  useEffect(() => {
    const fetchReplies = async () => {
      const repliesRef = collection(doc(db, "forums", forumId), "replies");
      const replySnap = await getDocs(repliesRef);
      const replyList = replySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Sort replies by date (newest to oldest)
      replyList.sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0));

      setAllReplies(replyList); 
      const totalReplies = replyList.length;
      setTotalPages(Math.ceil(totalReplies / pageSize)); 

      // Get the replies for the current page (pagination)
      const displayedReplies = replyList.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      setReplies(displayedReplies);
    };

    if (forumId) fetchReplies();
  }, [forumId, currentPage]);


  // Submit reply handler
  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      showAlert('warning', 'Empty Reply', 'Reply cannot be empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const replyRef = collection(doc(db, "forums", forumId), "replies");
      await addDoc(replyRef, {
        content: replyContent,
        username: user.displayName || user.email || "Anonymous",
        userId: user.uid,
        date: serverTimestamp(),
      });

      setReplyContent('');

      // Update the replies list by fetching it again
      const updatedReplies = await fetchUpdatedReplies();
      setReplies(updatedReplies);

      // Directly update the number of replies displayed
      setAllReplies(prevReplies => [...prevReplies, { content: replyContent, username: user.displayName || user.email || "Anonymous", userId: user.uid, date: serverTimestamp() }]);
      setTotalPages(Math.ceil(allReplies.length / pageSize)); // Update total pages if needed

      showAlert('success', 'Success!', 'Reply successfully posted!');
    } catch (error) {
      console.error("Error posting reply:", error);
      showAlert('error', 'Error', 'Failed to post reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch updated replies after a new reply is posted
  const fetchUpdatedReplies = async () => {
    const repliesRef = collection(doc(db, "forums", forumId), "replies");
    const replySnap = await getDocs(repliesRef);
    const replyList = replySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const displayedReplies = replyList.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    return displayedReplies;
  };


  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  const showAlert = (type, title, message, duration = 2000) => {
    setAlertConfig({ show: true, type, title, message });
    setTimeout(() => {
      setAlertConfig({ show: false, type: '', title: '', message: '' });
    }, duration);
  };

  return (
    <div className="forum-detail">
      {alertConfig.show && (
        <Alert
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
        />
      )}

      {/* Forum main content */}
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

      {/* Reply form if user is logged in */}
      {user && (
        <div className="reply-wrapper">
          <form onSubmit={handleReplySubmit} className="mb-4">
            <div className="content card p-3 shadow bg-white rounded">
              <div className="content-form mb-2">
                <textarea
                  className="form-control forum-content input-default input-large"
                  placeholder="Write your reply here..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  maxLength={maxReplyLength}
                  required
                ></textarea>
              </div>
              <div className="d-flex justify-content-end align-items-end gap-2">
                <div className="char-count">{replyContent.length}/{maxReplyLength}</div>
                <button
                  type="submit"
                  className="btn btn-sm rounded-3 btn-primary-custom"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Reply'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="separator-container">
        <div className="separator-inner">
          <span className="reply-count-text">{allReplies.length} Replies</span>
          <hr className="custom-separator" />
        </div>
      </div>

      {/* Display replies */}
      <div className="replies-wrapper">
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
                  <p className={reply.content ? 'text-left' : 'text-center'}>
                    {reply.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <nav aria-label="Page navigation example" style={{ marginTop: '32px' }}>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Prev</button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li className={`page-item ${currentPage === index + 1 ? 'active' : ''}`} key={index}>
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ForumDetailPage;
