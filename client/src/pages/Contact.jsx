import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formRef.current) return;

    emailjs
      .sendForm(
        'service_syby29s',      // EmailJS Service ID
        'template_rpjr5tn',     // EmailJS Template ID
        formRef.current,
        '6eg3hbmJ_xzdl7_6I'     // EmailJS Public Key
      )
      .then(
        () => setSubmitted(true),
        () => setError('Something went wrong. Please try again.')
      );
  };

  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-black text-white">
      {/* Optional background image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url(/images/home.jpg)' }}
      />
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-4 py-12">
        <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-lg text-center">
          <h1 className="text-4xl font-bold text-white mb-8">Contact</h1>

          {submitted ? (
            <div className="text-xl" role="status" aria-live="polite">
              ✅ Thank you for reaching out!
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
              <div>
                <label htmlFor="user_name" className="sr-only">Your Name</label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/30 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div>
                <label htmlFor="user_email" className="sr-only">Your Email</label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/30 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Your Message"
                  rows="5"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/30 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              {error && <div className="text-red-400 text-sm" role="alert" aria-live="assertive">{error}</div>}
              <button
                type="submit"
                className="w-full px-8 py-3 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold shadow transition-all duration-200"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}