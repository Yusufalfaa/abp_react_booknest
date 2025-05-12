import './home.css'
import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    document.title = "Home - BookNest";
  }, []);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
    </div>
  );
};

export default Home;
