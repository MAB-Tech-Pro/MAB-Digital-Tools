export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-700 mb-4">Have questions or feedback? Reach out to us using the form below.</p>

      <form className="flex flex-col gap-4">
        <input type="text" placeholder="Your Name" className="border border-gray-300 rounded px-3 py-2 w-full"/>
        <input type="email" placeholder="Your Email" className="border border-gray-300 rounded px-3 py-2 w-full"/>
        <textarea placeholder="Your Message" className="border border-gray-300 rounded px-3 py-2 w-full"></textarea>
        <button type="submit" className="btn-primary w-full sm:w-auto">Send Message</button>
      </form>
    </div>
  )
}
