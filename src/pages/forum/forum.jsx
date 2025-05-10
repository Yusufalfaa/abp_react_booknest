// src/pages/forum/Forum.js
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; 

function Forum() {
  const [forums, setForums] = useState([]);

  useEffect(() => {
    const fetchForums = async () => {
      // Ambil data dari koleksi 'forums' di Firestore
      const querySnapshot = await getDocs(collection(db, 'forums'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setForums(data);  // Set data forum ke state
    };

    fetchForums();  // Panggil fungsi untuk mengambil data
  }, []);  // Empty dependency array untuk hanya menjalankan sekali saat komponen dimuat

  return (
    <div>
      <h1>Forum List</h1>
      <ul>
        {/* Tampilkan daftar forum */}
        {forums.map(forum => (
          <li key={forum.id}>{forum.title}</li>  // Menampilkan judul forum
        ))}
      </ul>
    </div>
  );
}

export default Forum;
