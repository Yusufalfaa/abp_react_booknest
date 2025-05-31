<<<<<<< HEAD
import './home.css';
import { useEffect } from 'react';
=======
import "./home.css";
import { useEffect } from "react";
>>>>>>> 07bfb76098a95343fe59b5a4f4e2086c8c4da870

const Home = () => {
  useEffect(() => {
    document.title = "Home - BookNest";
  }, []);

  const featuredBooks = [
    {
      title: "Sample Featured Book",
      descShort: "Just to put it out there, I’ll admit straight off the bat that I’m one of the people who enjoyed this book. It was a fast ...",
      descLong: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis ..."
    },
    {
      title: "Another Great Read",
      descShort: "This book kept me turning the pages! Suspenseful and moving ...",
      descLong: "Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus ..."
    }
  ];

  return (
    <div className="home-page">
      <div className="hero-section" style={{ backgroundImage: "url('/assets/bgDarker.png')" }}>
        <h1>Find and rate your best book</h1>
      </div>

      <section className="book-section">
        <h2>We sorted the best for you</h2>
        <div className="book-grid horizontal-scroll">
          {featuredBooks.map((book, idx) => (
            <div className="book-card featured" key={idx}>
              <div className="book-cover">
                <img src="/assets/placeholder.png" alt="Book Cover" />
              </div>
              <div className="book-desc">
                <p><strong>{book.descShort}</strong></p>
                <p>{book.descLong}</p>
                <button className="add-btn">Add to List</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="book-section">
        <div className="section-header">
          <h2>Genre</h2>
          <button className="see-more-btn">See More</button>
        </div>
        <div className="book-gridg">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div className="book-cardg" key={idx}>
              <div className="book-cover">
                <img src="/assets/placeholder.png" alt="Book Cover" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="book-section">
        <div className="section-header">
          <h2>Genre lain</h2>
          <button className="see-more-btn">See More</button>
        </div>
        <div className="book-gridg">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div className="book-cardg" key={idx}>
              <div className="book-cover">
                <img src="/assets/placeholder.png" alt="Book Cover" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
