import "./bookdetail.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Untuk mendapatkan ID dari URL
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // Pastikan Firebase sudah dikonfigurasi di sini
import { Helmet } from "react-helmet";

const BookDetail = () => {
  const { id } = useParams(); // Mendapatkan ID buku dari URL params
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const docRef = doc(db, "books", id); // Mendapatkan referensi dokumen berdasarkan ID buku
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBook(docSnap.data()); // Menyimpan data buku ke state
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [id]); // Menjalankan useEffect hanya ketika `id` berubah

  if (!book) {
    return <div>Loading...</div>; // Menampilkan loading jika data belum ada
  }

  return (
    <section id="forum-main" className="position-relative padding-large">
      <div className="container">
        <Helmet>
          <title>{book.title} - BookNest</title>
        </Helmet>
        <h1>
          <strong>{book.title}</strong>
        </h1>
        <div className="book-info">
          <img
            src={book.thumbnail}
            alt={book.title}
            className="book-thumbnail"
          />
          <div className="book-details">
            <p>
              <strong>Author:</strong> {book.authors}
            </p>
            <p>
              <strong>Pages:</strong> {book.num_pages}
            </p>
            <p>
              <strong>Published Year:</strong> {book.published_year}
            </p>
            <p>
              <strong>Average Rating:</strong> {book.average_rating}
            </p>
            <p>
              <strong>Categories:</strong> {book.categories}
            </p>
          </div>
        </div>
        <div className="book-description">
          <h3>
            <strong>Description</strong>
          </h3>
          <p>{book.description}</p>
        </div>
      </div>
    </section>
  );
};

export default BookDetail;
