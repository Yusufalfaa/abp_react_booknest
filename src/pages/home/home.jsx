import './home.css';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import BookService from '../../firebase/bookService';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { Alert } from '../../components/Alerts/alert';

const Home = () => {
  const [randomBooks, setRandomBooks] = useState([]);
  const [genreBooks, setGenreBooks] = useState({});
  const [userBooksSet, setUserBooksSet] = useState(new Set());
  const [user, setUser] = useState(null);
  const [alertConfig, setAlertConfig] = useState({ show: false, type: '', title: '', message: '' });

  const authRef = useRef(getAuth());
  const navigate = useNavigate();
  const bookService = new BookService();

  const genres = useMemo(() => [
    'Fiction',
    'Biography & Autobiography',
    'Religion',
    'Philosophy',
    'Juvenile Fiction',
    'History',
  ], []);

  useEffect(() => {
    document.title = "Home - BookNest";

    const unsubscribe = onAuthStateChanged(authRef.current, (firebaseUser) => {
      setUser(firebaseUser);
    });

    const fetchRandomBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "books"));
        const allBooks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isbn13: doc.data().isbn13 || doc.id,
        }));
        const shuffled = allBooks.sort(() => 0.5 - Math.random());
        setRandomBooks(shuffled.slice(0, 6));
      } catch (err) {
        showAlert('error', 'Error', 'Failed to load random books.');
      }
    };

    const fetchGenreBooks = async () => {
      const genreData = {};
      for (const genre of genres) {
        try {
          const q = query(
            collection(db, 'books'),
            where('categories', '==', genre),
            limit(10)
          );
          const querySnapshot = await getDocs(q);
          const books = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            isbn13: doc.data().isbn13 || doc.id,
          }));
          genreData[genre] = books;
        } catch (err) {
          showAlert('error', 'Error', `Failed to load books for ${genre}.`);
        }
      }
      setGenreBooks(genreData);
    };

    fetchRandomBooks();
    fetchGenreBooks();

    return () => unsubscribe();
  }, [genres]);

  useEffect(() => {
    const fetchUserBooks = async () => {
      if (!user) return;

      try {
        const userBooksSnapshot = await getDocs(collection(db, 'users', user.uid, 'books'));
        const userBookIdsSet = new Set(userBooksSnapshot.docs.map(doc => doc.id.toString()));
        setUserBooksSet(userBookIdsSet);
      } catch (err) {
        showAlert('error', 'Error', 'Failed to fetch user book list.');
      }
    };

    fetchUserBooks();
  }, [user]);

  const showAlert = (type, title, message, duration = 2000) => {
    setAlertConfig({ show: true, type, title, message });
    setTimeout(() => {
      setAlertConfig({ show: false, type: '', title: '', message: '' });
    }, duration);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={solidStar} color="#ffd700" />);
    }

    if (hasHalfStar && fullStars < 5) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} color="#ffd700" />);
    }

    for (let i = stars.length; i < 5; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={regularStar} color="#ffd700" />);
    }

    return stars;
  };

  const handleToggleBook = async (book) => {
    if (!user) {
      showAlert('warning', 'Login Required', 'You must be logged in to manage your list.');
      return;
    }

    const bookId = (book.isbn13 || book.id).toString();

    try {
      if (userBooksSet.has(bookId)) {
        await bookService.removeBook(user.uid, bookId);
        const newSet = new Set(userBooksSet);
        newSet.delete(bookId);
        setUserBooksSet(newSet);
        showAlert('success', 'Removed', 'Book removed from your list.');
      } else {
        const bookData = {
          title: book.title || 'Untitled',
          isbn13: bookId,
          authors: book.authors || 'Unknown',
          num_pages: book.num_pages || 0,
          published_year: book.published_year || '',
          average_rating: book.average_rating || 0,
          categories: book.categories || '',
          thumbnail: book.thumbnail || '',
          description: book.description || '',
        };
        await bookService.addBook(user.uid, bookId, bookData);
        const updatedSet = new Set(userBooksSet);
        updatedSet.add(bookId);
        setUserBooksSet(updatedSet);
        showAlert('success', 'Added!', 'Book added to your list!');
      }
    } catch (err) {
      showAlert('error', 'Error', 'Failed to update book list.');
    }
  };

  const handleBookClick = (isbn13) => {
    navigate(`/bookdetail/${isbn13}`);
  };

  return (
    <div className="home-page">
      <div
        className="hero-section"
        style={{ backgroundImage: "url('/assets/bgDarker.png')" }}
      >
        <h1>Find and rate your best book</h1>
      </div>

      {/* Alert section */}
      {alertConfig.show && (
        <Alert
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
        />
      )}

      <section className="random-book-section">
        <h2>Explore Random Books</h2>
        <div className="random-book-scroll">
          {randomBooks.map((book) => {
            const bookId = (book.isbn13 || book.id).toString();
            const isInList = userBooksSet.has(bookId);

            return (
              <div className="random-book-card" key={bookId}>
                <div className="random-book-cover">
                  <img
                    src={book.thumbnail || 'https://via.placeholder.com/150x200'}
                    alt={book.title || 'Book Cover'}
                    onClick={() => handleBookClick(bookId)}
                  />
                </div>
                <div className="random-book-desc">
                  <p><strong>{book.title || 'Untitled'}</strong></p>
                  <div className="book-ratingg">
                    {renderStars(book.average_rating || 0)}
                    <span className="rating-number">
                      {(book.average_rating || 0).toFixed(1)}
                    </span>
                  </div>
                  <p>{book.description?.substring(0, 100) || 'No description available.'}...</p>
                  <button
                    className="add-btn"
                    onClick={() => handleToggleBook(book)}
                    disabled={!user}
                  >
                    {isInList ? 'Remove from List' : 'Add to List'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {genres.map((genre) => (
        <section className="book-sectiong" key={genre}>
          <div className="section-headerg">
            <h2>{genre}</h2>
            <button
              className="see-more-btng"
              onClick={() => navigate(`/genre/${encodeURIComponent(genre)}`)}
            >
              See More
            </button>
          </div>
          <div className="book-gridg">
            {(genreBooks[genre] || []).slice(0, 10).map((book) => (
              <div className="book-cardg" key={book.isbn13 || book.id}>
                <div className="book-coverg">
                  <img
                    src={book.thumbnail || '/assets/placeholder.png'}
                    alt={book.title || 'Book Cover'}
                    className="book-imageg"
                    onClick={() => handleBookClick(book.isbn13 || book.id)}
                  />
                </div>
                <div className="book-ratingg">
                  {renderStars(book.average_rating || 0)}
                  <span className="rating-number">
                    {(book.average_rating || 0).toFixed(1)}
                  </span>
                </div>
                <a href={`/bookdetail/${book.isbn13}`} className="book-titleg" title={book.title}>
                  {book.title || 'Untitled'}
                </a>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;
