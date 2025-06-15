"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    seats: 1,
  });
  const [showAddForm, setShowAddForm] = useState(false);
const [newEvent, setNewEvent] = useState({
  name: '',
  location: '',
  date: '',
  available_seats: 10,
});


  useEffect(() => {
    fetch("https://quick-tickets-backend.onrender.com/api/events/")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
      })
      .catch(console.error);
  }, []);

  const handleBook = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const booking = {
      ...formData,
      event_id: selectedEvent.id,
    };

    const res = await fetch("https://quick-tickets-backend.onrender.com/api/book/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    });

    if (res.ok) {
      alert("Booking successful!");
      setShowForm(false);
      setFormData({ name: "", email: "", seats: 1 });
    } else {
      alert("Booking failed.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">🎟️ Upcoming Events</h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events found.</p>
      ) : (
        events.map((e) => (
          <div
            key={e.id}
            className="border border-gray-200 p-4 rounded-lg mb-4 shadow-sm bg-white"
          >
            <h2 className="text-xl font-semibold">{e.name}</h2>
            <p className="text-gray-600">{e.location} – {e.date}</p>
            <p className="text-sm text-gray-500">Seats Available: {e.available_seats}</p>
            <button
              onClick={() => handleBook(e)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Book Ticket
            </button>
          </div>
        ))
      )}

<div className="text-center mt-6">
  <button
    onClick={() => setShowAddForm(true)}
    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
  >
    + Add Event
  </button>
</div> 

{showAddForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await fetch('https://quick-tickets-backend.onrender.com/api/events/add/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvent),
        });

        if (res.ok) {
          alert("Event added!");
          setShowAddForm(false);
          setNewEvent({ name: '', location: '', date: '', available_seats: 10 });
          window.location.reload(); // or re-fetch events
        } else {
          alert("Failed to add event");
        }
      }}
      className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4"
    >
      <h2 className="text-lg font-bold mb-2">Add New Event</h2>
      <input
        required
        type="text"
        placeholder="Event Name"
        className="w-full p-2 border rounded"
        value={newEvent.name}
        onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
      />
      <input
        required
        type="text"
        placeholder="Location"
        className="w-full p-2 border rounded"
        value={newEvent.location}
        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
      />
      <input
        required
        type="date"
        className="w-full p-2 border rounded"
        value={newEvent.date}
        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
      />
      <input
        required
        type="number"
        min={1}
        className="w-full p-2 border rounded"
        placeholder="Available Seats"
        value={newEvent.available_seats}
        onChange={(e) => setNewEvent({ ...newEvent, available_seats: Number(e.target.value) })}
      />
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => setShowAddForm(false)}
          className="px-3 py-1 text-sm bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>
    </form>
  </div>
)}



      {showForm && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-lg w-80 space-y-4"
          >
            <h2 className="text-lg font-bold mb-2">
              Book for {selectedEvent.name}
            </h2>
            <input
              required
              type="text"
              placeholder="Your Name"
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              required
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              required
              type="number"
              min={1}
              max={selectedEvent.available_seats}
              placeholder="Seats"
              className="w-full p-2 border rounded"
              value={formData.seats}
              onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-3 py-1 text-sm bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}


