import React, { useState, useEffect } from "react";
import "./mybooks.css";
import { auth, db, collection, getDocs } from "../../firebase/firebase"; // Your working firebase path
import { onAuthStateChanged } from "firebase/auth";

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "My Favorite Books - BookNest";

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        setUserId(uid);
        try {
          const userBooksRef = collection(db, "users", uid, "books");
          const snapshot = await getDocs(userBooksRef);
          const bookList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setBooks(bookList);
        } catch (error) {
          console.error("Failed to fetch books:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.warn("User not logged in");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="mybooks-container">
      <h1>MyBooks</h1>

      {loading ? (
        <p>Loading...</p>
      ) : books.length === 0 ? (
        <p>You haven't added any books yet.</p>
      ) : (
        <table className="book-table">
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Author(s)</th>
              <th>Rating</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={book.thumbnail || "https://via.placeholder.com/80x120"}
                    alt={book.title || "Book cover"}
                    className="book-cover"
                  />
                </td>
                <td>{book.title || "Untitled"}</td>
                <td>{book.authors || "Unknown Author"}</td>
                <td><strong>{book.rating || "-"}</strong></td>
                <td><input type="text" placeholder="Enter your review" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyBooks;
