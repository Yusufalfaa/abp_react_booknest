import './home.css';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import BookService from '../../firebase/bookService';

const Home = () => {
  const [randomBooks, setRandomBooks] = useState([]);
  const [genreBooks, setGenreBooks] = useState({});
  const [userBooksSet, setUserBooksSet] = useState(new Set());
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const authRef = useRef(getAuth());
  const navigate = useNavigate();
  const bookService = new BookService();



  const genres = useMemo(() => [
    'Fiction',
    'Biography & Autobiography',
    'Religion',
    'Philosophy',
    'Juvenile Fiction',
    'Social Science',
  ], []);

  useEffect(() => {
    document.title = 'Home - BookNest';

    const unsubscribe = onAuthStateChanged(authRef.current, (firebaseUser) => {
      setUser(firebaseUser);
    });

    const fetchRandomBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'books'));
        const allBooks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isbn13: doc.data().isbn13 || doc.id,
        }));
        const shuffled = allBooks.sort(() => 0.5 - Math.random());
        setRandomBooks(shuffled.slice(0, 6));
      } catch (err) {
        console.error('Error fetching random books:', err);
        setError('Failed to load random books.');
      }
    };

    const fetchGenreBooks = async () => {
      const genreData = {};
      for (const genre of genres) {
        try {
          const q = query(
            collection(db, 'books'),
            where('categories', '==', genre),
            limit(8)
          );
          const querySnapshot = await getDocs(q);
          const books = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            isbn13: doc.data().isbn13 || doc.id,
          }));
          genreData[genre] = books;
        } catch (err) {
          console.error(`Error fetching books for ${genre}:`, err);
          setError(`Failed to load books for ${genre}.`);
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
        console.log('Fetched user books set:', userBookIdsSet);
        setUserBooksSet(userBookIdsSet);
      } catch (err) {
        console.error('Error fetching user books:', err);
      }
    };

    fetchUserBooks();
  }, [user]);

  const handleToggleBook = async (book) => {
    if (!user) {
      setError('You must be logged in to manage your list.');
      return;
    }

    const bookId = (book.isbn13 || book.id).toString();

    try {
      if (userBooksSet.has(bookId)) {
        await bookService.removeBook(user.uid, bookId);
        const newSet = new Set(userBooksSet);
        newSet.delete(bookId);
        setUserBooksSet(newSet);
        console.log(`Removed bookId ${bookId}`);
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
        console.log(`Added bookId ${bookId}`);
      }

      setError(null);
    } catch (err) {
      console.error('Error managing book list:', err);
      setError(err.message || 'Failed to update book list.');
    }
  };

  const handleBookClick = (isbn13) => {
    navigate(`/bookdetail/${isbn13}`);
  };

  return (
    <div className="home-page">
      <div className="hero-section" style={{ backgroundImage: "url('/assets/bgDarker.png')" }}>
        <h1>Find and rate your best book</h1>
      </div>

      <section className="book-section">
        <h2>Explore Random Books</h2>
        {error && <div className="text-danger mb-3">{error}</div>}
        <div className="book-grid horizontal-scroll">
          {randomBooks.map((book) => {
            const bookId = (book.isbn13 || book.id).toString();
            const isInList = userBooksSet.has(bookId);

            return (
              <div className="book-card featured" key={bookId}>
                <div className="book-cover">
                  <img
                    src={book.thumbnail || 'https://via.placeholder.com/80x120'}
                    alt={book.title || 'Book Cover'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleBookClick(bookId)}
                  />
                </div>
                <div className="book-desc">
                  <p><strong>{book.title || 'Untitled'}</strong></p>
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
        <section className="book-section" key={genre}>
          <div className="section-header">
            <h2>{genre}</h2>
            <button
              className="see-more-btn"
              onClick={() => navigate(`/genre/${encodeURIComponent(genre)}`)}
            >
              See More
            </button>
          </div>
          <div className="book-gridg">
            {(genreBooks[genre] || Array.from({ length: 8 }).map((_, idx) => ({ id: `placeholder-${idx}` }))).slice(0, 8).map((book) => (
            <div className="book-cardg" key={book.isbn13 || book.id}>
              <div className="book-cover">
                <img
                  src={book.thumbnail || '/assets/placeholder.png'}
                  alt={book.title || 'Book Cover'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => book.isbn13 && handleBookClick(book.isbn13 || book.id)}
                />
              </div>
              <div className="book-title" title={book.title}>
                {book.title || 'Untitled'}
              </div>
            </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;
