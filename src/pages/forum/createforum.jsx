import './createforum.css';
import { auth, db } from '../../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../../components/Alerts/alert';

function CreateForum() {
  useEffect(() => {
    document.title = "Create Forum - BookNest";
  }, []);


  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ show: false, type: '', title: '', message: '' });

  const maxContentLength = 2500;
  const maxTitleLength = 100;

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const showAlert = (type, title, message, duration = 2000) => {
    setAlertConfig({ show: true, type, title, message });
    setTimeout(() => {
      setAlertConfig({ show: false, type: '', title: '', message: '' });
    }, duration);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showAlert('warning', 'Warning', 'You must be logged in to create a forum.');
      return;
    }

    if (content.trim().length < 10) {
      showAlert('warning', 'Content Too Short', 'Content must be at least 10 characters.');
      return;
    }

    setIsSubmitting(true);

    const forumData = {
      title,
      content,
      date: serverTimestamp(),
      replies: 0,
      userId: user.uid,
      username: user.displayName || user.email || 'Anonymous',
    };

    try {
      await addDoc(collection(db, 'forums'), forumData);
      showAlert('success', 'Success!', 'Forum successfully created!');
      setTitle('');
      setContent('');

      setTimeout(() => {
        navigate('/forum');
      }, 2000);
    } catch (error) {
      console.error('Error creating forum:', error);
      showAlert('error', 'Error', 'Failed to create forum. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="forum-main" className="position-relative padding-large">
      <div className="container forum-main">
        <div className="section-title d-flex flex-column mb-2">
          <h3 className="mb-1">Let's Talk</h3>
          <p>Sharing, find support, and connect with the community</p>
        </div>

        {/* Alert Pop-up */}
        {alertConfig.show && (
          <Alert
            type={alertConfig.type}
            title={alertConfig.title}
            message={alertConfig.message}
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="title card p-3 shadow bg-white rounded mb-3">
            <input
              type="text"
              className="form-control forum-title input-default"
              placeholder="Write your forum title here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={maxTitleLength}
              required
            />
            <div className="d-flex justify-content-end">
              <div className="char-count-title">{title.length}/{maxTitleLength}</div>
            </div>
          </div>

          <div className="content card p-3 shadow bg-white rounded">
            <div className="content-form mb-2">
              <textarea
                className="form-control forum-content input-default input-large"
                placeholder="Write down your interesting thoughts or theories here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={maxContentLength}
                required
              ></textarea>
            </div>
            <div className="d-flex justify-content-end align-items-end gap-2">
              <div className="char-count">{content.length}/{maxContentLength}</div>
              <button
                type="submit"
                className="btn btn-sm rounded-3 btn-primary-custom"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateForum;
