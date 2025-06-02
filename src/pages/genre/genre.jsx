import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import "./genre.css";

const Genre = () => {
  const { genre } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "books"));
        const fetchedBooks = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((book) =>
            (book.categories || "").toLowerCase().includes(genre.toLowerCase())
          );
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Error fetching books: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [genre]);

  return (
    <div className="genre-container">
      <h1 className="genre-title">{genre} Books</h1>
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : books.length === 0 ? (
        <p className="no-books">No books found for this category</p>
      ) : (
        <div className="grid-container">
          {books.map((book) => (
            <div
              key={book.id}
              className="book-card"
              onClick={() => navigate(`/bookdetail/${book.id}`)}
            >
              <img
                src={book.thumbnail}
                alt={book.title}
                className="book-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
              <p className="book-title">{book.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Genre;
