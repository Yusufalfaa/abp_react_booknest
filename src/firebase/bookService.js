import { db } from "../firebase/firebase";
import { collection, setDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from "firebase/firestore";

class BookService {
  getUserBooks(userId, callback) {
    if (!userId) {
      throw new Error("Invalid user ID");
    }

    const booksRef = collection(db, "users", userId, "books");
    return onSnapshot(
      booksRef,
      (snapshot) => {
        const books = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(books);
      },
      (error) => {
        console.error("Error fetching books:", error);
        callback([], error);
      }
    );
  }

  async addBook(userId, bookId, bookData) {
    if (!userId) {
      throw new Error("Invalid user ID");
    }

    if (!bookData.title || !bookData.isbn13) {
      throw new Error("Book data must include at least 'title' and 'isbn13'");
    }

    try {
      await setDoc(doc(db, "users", userId, "books", bookId), {
        ...bookData,
        addedAt: serverTimestamp(),
      });
      console.log(`Added book: ${bookData.title} to user: ${userId}`);
    } catch (error) {
      console.error("Error adding book:", error);
      throw error;
    }
  }

  async removeBook(userId, bookId) {
    if (!userId || !bookId) {
      throw new Error("Invalid user ID or book ID");
    }

    try {
      await deleteDoc(doc(db, "users", userId, "books", bookId));
      console.log(`Removed book: ${bookId} from user: ${userId}`);
    } catch (error) {
      console.error("Error removing book:", error);
      throw error;
    }
  }
}

export default BookService;