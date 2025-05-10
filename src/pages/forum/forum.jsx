// src/pages/forum/Forum.js
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

function Forum() {
  const [forums, setForums] = useState([]);

  useEffect(() => {
    const fetchForums = async () => {
      const querySnapshot = await getDocs(collection(db, 'forums'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setForums(data);
    };

    fetchForums();
  }, []);

  return (
    <div>
      <h1>Forum List</h1>
      <ul>
        {forums.map(forum => (
          <li key={forum.id}>{forum.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Forum;
