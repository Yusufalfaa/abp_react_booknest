import './home.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebase';
import { getAuth } from 'firebase/auth';
import BookService from '../../firebase/bookService';

const Home = () => {
  const [randomBooks, setRandomBooks] = useState([]);
  const [genreBooks, setGenreBooks] = useState({}); // Store books by genre
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const bookService = new BookService();
  const authInstance = getAuth();

  // Define genres array here
  const genres = [
    'Fiction',
    'Biography & Autobiography',
    'Religion',
    'Philosophy',
    'Juvenile Fiction',
    'Social Science',
  ]; // <--- Update this array with genres from your book dataset

  useEffect(() => {
    document.title = 'Home - BookNest';

    // Fetch random books
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

    // Fetch books for each genre
    const fetchGenreBooks = async () => {
      const genreData = {};
      for (const genre of genres) {
        try {
          const q = query(
            collection(db, 'books'),
            where('categories', '==', genre), // Adjust if categories is an array
            limit(8) // Match template's 8 books
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
  }, []);

  const handleAddBook = async (book) => {
    const user = authInstance.currentUser;
    if (!user) {
      setError('You must be logged in to add a book.');
      return;
    }

    try {
      const bookData = {
        title: book.title || 'Untitled',
        isbn13: book.isbn13 || book.id,
        authors: book.authors || 'Unknown',
        num_pages: book.num_pages || 0,
        published_year: book.published_year || '',
        average_rating: book.average_rating || 0,
        categories: book.categories || '',
        thumbnail: book.thumbnail || '',
        description: book.description || '',
      };

      await bookService.addBook(user.uid, book.isbn13 || book.id, bookData);
      setError(null);
    } catch (err) {
      console.error('Error adding book:', err);
      setError(err.message || 'Failed to add book. Try again.');
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
          {randomBooks.map((book) => (
            <div className="book-card featured" key={book.isbn13 || book.id}>
              <div className="book-cover">
                <img
                  src={book.thumbnail || 'https://via.placeholder.com/80x120'}
                  alt={book.title || 'Book Cover'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleBookClick(book.isbn13 || book.id)}
                />
              </div>
              <div className="book-desc">
                <p><strong>{book.title || 'Untitled'}</strong></p>
                <p>{book.description?.substring(0, 100) || 'No description available.'}...</p>
                <button
                  className="add-btn"
                  onClick={() => handleAddBook(book)}
                  disabled={!authInstance.currentUser}
                >
                  Add to List
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {genres.map((genre) => (
        <section className="book-section" key={genre}>
          <div className="section-header">
            <h2>{genre}</h2>
            <button className="see-more-btn">See More</button>
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