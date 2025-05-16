import './mybooks.css';
import { useEffect } from 'react';

const MyBooks = () => {
  useEffect(() => {
    document.title = "My Favorite Books - BookNest";
  }, []);

  const books = [
    "Cats", "Elephants", "Dogs", "Tigers", "Birds",
    "Hamsters", "Lions", "Giraffes", "Zebras", "Rabbits"
  ];

  return (
    <div className="mybooks-container">
      <h1>MyBooks</h1>
      <table className="book-table">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>Rating</th>
            <th>Read Status</th>
          </tr>
        </thead>
        <tbody>
          {books.map((animal, index) => (
            <tr key={index}>
              <td>
                <div className="book-cover">Book Cover</div>
              </td>
              <td>Water for {animal}</td>
              <td>SARA GRUEN</td>
              <td><strong>4.0</strong></td>
              <td><input type="text" placeholder="Enter your review" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyBooks;
