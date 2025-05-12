import './mybooks.css'
import { useEffect } from 'react';

const MyBooks = () => {
  useEffect(() => {
    document.title = "My Favorite Books - BookNest";
  }, []);
  
  return (
    <div>
      <h1>Welcome to the MyBooks Page</h1>
    </div>
  );
};

export default MyBooks;
