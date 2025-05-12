import './createforum.css';
import { auth, db } from '../../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function CreateForum() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);

  const maxContentLength = 2500;
  const maxTitleLength = 100;

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to create a forum.');
      return;
    }

    if (content.trim().length < 10) {
      alert('Content must be at least 10 characters.');
      return;
    }

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
      alert('Forum successfully created!');
      setTitle('');
      setContent('');
      navigate('/forum'); 
    } catch (error) {
      console.error('Error creating forum:', error);
    }
  };

  return (
    <section id="forum-main" className="position-relative padding-large">
      <div className="container forum-main">
        <div className="section-title d-flex flex-column mb-2">
          <h3 className="mb-1">Let's Talk</h3>
          <p>Sharing, find support, and connect with the community</p>
        </div>
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
              <button type="submit" className="btn btn-sm rounded-3 btn-primary-custom">
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateForum;
