import "./faq.css";
import { useEffect } from "react";

const FAQ = () => {
  useEffect(() => {
    document.title = "My Favorite Books - BookNest";
  }, []);

  return (
    <div>
      <section className="faq-section">
        <div className="faq-header">
          <div className="image-container">
            <img
              src="/assets/bgDarker.png"
              alt="Background"
              className="hero-image"
            />
            <div className="overlay-text">
              <h3>Frequently Asked Questions</h3>
              <p>
                Frequently asked questions about our services, features and
                platform guidelines.
              </p>
            </div>
          </div>
        </div>

        <div className="faq-container">
          <div className="faq-item">
            <div className="icon">
              <img src="/assets/question.png" alt="Question Icon" />
            </div>
            <div className="faq-text">
              <h4>Are there any free books accessible?</h4>
              <p>We have a collection of free books available for all users.</p>
            </div>
          </div>
          <div className="faq-item">
            <div className="icon">
              <img src="/assets/question.png" alt="Question Icon" />
            </div>
            <div className="faq-text">
              <h4>How to contact customer service?</h4>
              <p>
                You can contact our customer service by clicking the Contact Us
                button below. Our team will respond to your inquiry shortly.
              </p>
            </div>
          </div>
          <div className="faq-item">
            <div className="icon">
              <img src="/assets/question.png" alt="Question Icon" />
            </div>
            <div className="faq-text">
              <h4>How do I search for the book I want?</h4>
              <p>
                You can use the search field at the top of the page. Enter the
                title, author name, or book category to find the book you are
                looking for.
              </p>
            </div>
          </div>
          <div className="faq-item">
            <div className="icon">
              <img src="/assets/question.png" alt="Question Icon" />
            </div>
            <div className="faq-text">
              <h4>How do I join the reader community on this website?</h4>
              <p>
                You can join our community of readers through our forum. Click
                on the Forum menu in the main navigation to join and start a
                discussion.
              </p>
            </div>
          </div>
        </div>

        <div className="button-container">
          <a href="/contact" className="contact-button" id="contactButton">
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
};

export default FAQ;