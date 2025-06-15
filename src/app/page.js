"use client";


import { useEffect, useState } from "react";
import { Menu, X, Ticket, Loader2 } from "lucide-react";


export default function Home() {
 const [events, setEvents] = useState([]);
 const [loading, setLoading] = useState(true);
 const [bookingLoading, setBookingLoading] = useState(false);
 const [addEventLoading, setAddEventLoading] = useState(false);
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
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [registrations, setRegistrations] = useState([]);
 const [showRegistrations, setShowRegistrations] = useState(false);


 useEffect(() => {
   setLoading(true);
   fetch("https://quick-tickets-backend.onrender.com/api/events/")
     .then((res) => res.json())
     .then((data) => {
       setEvents(data);
       setLoading(false);
     })
     .catch((error) => {
       console.error(error);
       setLoading(false);
     });


   // Mock registrations data for demo
   setRegistrations([
     { id: 1, eventName: "Summer Music Festival", name: "John Doe", email: "john@example.com", seats: 2, date: "2025-07-15" },
     { id: 2, eventName: "Tech Conference 2025", name: "Jane Smith", email: "jane@example.com", seats: 1, date: "2025-08-20" },
   ]);
 }, []);


 const handleBook = (event) => {
   setSelectedEvent(event);
   setShowForm(true);
 };


 const handleSubmit = async (e) => {
   e.preventDefault();
   setBookingLoading(true);
  
   const booking = {
     ...formData,
     event_id: selectedEvent.id,
   };


   try {
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
       // Add to local registrations for demo
       const newRegistration = {
         id: Date.now(),
         eventName: selectedEvent.name,
         name: formData.name,
         email: formData.email,
         seats: formData.seats,
         date: selectedEvent.date
       };
       setRegistrations(prev => [...prev, newRegistration]);
       // Refresh events to update available seats
       window.location.reload();
     } else {
       alert("Booking failed.");
     }
   } catch (error) {
     console.error("Booking error:", error);
     alert("Booking failed.");
   } finally {
     setBookingLoading(false);
   }
 };


 const handleAddEvent = async (e) => {
   e.preventDefault();
   setAddEventLoading(true);
  
   try {
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
       window.location.reload();
     } else {
       alert("Failed to add event");
     }
   } catch (error) {
     console.error("Add event error:", error);
     alert("Failed to add event");
   } finally {
     setAddEventLoading(false);
   }
 };


 const toggleMenu = () => {
   setIsMenuOpen(!isMenuOpen);
 };


 return (
   <div className="min-h-screen relative overflow-hidden" style={{
     backgroundColor: '#0A2A2A',
     fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
   }}>
     {/* Simplified Background */}
     <div className="absolute inset-0 overflow-hidden pointer-events-none">
       <div
         className="absolute top-20 right-10 w-96 h-96 opacity-5 transform rotate-45"
         style={{backgroundColor: '#4ADE80'}}
       />
       <div
         className="absolute bottom-20 left-10 w-80 h-80 opacity-5 transform -rotate-12"
         style={{backgroundColor: '#22D3EE'}}
       />
     </div>


     {/* Simplified Navbar */}
     <nav className="shadow-lg sticky top-0 z-50 backdrop-blur-md" style={{backgroundColor: 'rgba(10, 42, 42, 0.9)'}}>
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex justify-between items-center h-16">
           {/* Mobile Menu Button */}
           <div className="md:hidden">
             <button
               onClick={toggleMenu}
               className="p-2 rounded-md transition-colors hover:bg-teal-700"
             >
               {isMenuOpen ? (
                 <X size={24} className="text-white" />
               ) : (
                 <Menu size={24} className="text-white" />
               )}
             </button>
           </div>


           {/* Logo */}
           <div className="font-bold text-xl tracking-wider text-white transform hover:scale-105 transition-transform duration-200">
             QuickTix
           </div>




           {/* Empty div for flexbox alignment */}
           <div className="w-10 md:w-0"></div>
         </div>
       </div>
     </nav>


     {/* Mobile Menu */}
     <div className={`fixed inset-y-0 left-0 z-40 w-64 shadow-xl transform transition-transform duration-300 ease-in-out ${
       isMenuOpen ? 'translate-x-0' : '-translate-x-full'
     } md:hidden`} style={{backgroundColor: '#0A2A2A'}}>
       <div className="h-full flex flex-col">
         <div className="p-4 bg-gradient-to-r from-teal-600 to-green-500">
           <h2 className="text-lg font-semibold text-white">Menu</h2>
         </div>
         <div className="flex-1 py-4">
           <button
             onClick={() => {
               setShowRegistrations(true);
               setIsMenuOpen(false);
             }}
             className="flex items-center space-x-3 px-6 py-4 w-full text-left text-white hover:text-green-400 hover:bg-teal-800 transition-colors"
           >
             <Ticket size={20} />
             <span className="font-medium">My Registrations</span>
           </button>
         </div>
       </div>
     </div>


     {/* Overlay */}
     {isMenuOpen && (
       <div
         className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
         onClick={() => setIsMenuOpen(false)}
       />
     )}


     {/* Main Content */}
     <div className="max-w-6xl mx-auto p-6 relative z-10">
       {/* Hero Section */}
       <div className="text-center py-20 mb-16">
         <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
           Invent what’s next.
         </h1>
         <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Ready to build, innovate, and compete?
         </p>
         <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
           Welcome to your one-stop platform for booking hackathon and tech event tickets! Whether you're a code wizard, design ninja, or startup hustler—register here, reserve your spot, and be part of the next big thing.
         </p>
       </div>


       {/* Events Section */}
       <div className="bg-teal-900 bg-opacity-30 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-teal-800">
         <div className="flex justify-between items-center mb-8">
           <h2 className="text-3xl font-bold text-white">Upcoming Events</h2>
           <button
             onClick={() => setShowAddForm(true)}
             className="px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg transition-all transform hover:scale-105"
           >
             + Add Event
           </button>
         </div>


         {loading ? (
           <div className="flex justify-center items-center p-12">
             <div className="flex flex-col items-center space-y-4">
               <Loader2 className="h-8 w-8 animate-spin text-green-400" />
               <p className="text-gray-300">Loading events...</p>
             </div>
           </div>
         ) : events.length === 0 ? (
           <p className="text-center p-8 text-gray-400 bg-teal-900 bg-opacity-50 rounded-xl">
             No events found.
           </p>
         ) : (
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {events.map((e) => (
               <div
                 key={e.id}
                 className="bg-teal-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-teal-700 hover:border-green-400 transition-all transform hover:-translate-y-2 hover:shadow-2xl"
               >
                 <h3 className="text-xl font-semibold text-white mb-3">{e.name}</h3>
                 <p className="text-gray-300 mb-2">{e.location} – {e.date}</p>
                 <p className="text-sm text-green-400 mb-4">Seats Available: {e.available_seats}</p>
                 <button
                   onClick={() => handleBook(e)}
                   className="w-full px-4 py-3 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg transition-all transform hover:scale-105"
                 >
                   Book Ticket
                 </button>
               </div>
             ))}
           </div>
         )}
       </div>


       {/* Registrations Modal */}
       {showRegistrations && (
         <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
           <div className="bg-teal-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden border border-teal-700">
             <div className="p-6 bg-gradient-to-r from-teal-600 to-green-500">
               <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-white">My Registrations</h2>
                 <button
                   onClick={() => setShowRegistrations(false)}
                   className="text-white hover:text-gray-300 transition-colors"
                 >
                   <X size={24} />
                 </button>
               </div>
             </div>
             <div className="p-6 overflow-y-auto max-h-96">
               {registrations.length === 0 ? (
                 <p className="text-center py-8 text-gray-400">No registrations found.</p>
               ) : (
                 <div className="space-y-4">
                   {registrations.map((reg) => (
                     <div key={reg.id} className="p-4 bg-teal-800 bg-opacity-50 rounded-lg border border-teal-700">
                       <h3 className="font-semibold text-green-400 mb-2">{reg.eventName}</h3>
                       <p className="text-gray-300">Name: {reg.name}</p>
                       <p className="text-gray-300">Email: {reg.email}</p>
                       <p className="text-gray-300">Seats: {reg.seats}</p>
                       <p className="text-sm text-green-400 mt-2">Date: {reg.date}</p>
                     </div>
                   ))}
                 </div>
               )}
             </div>
           </div>
         </div>
       )}


       {/* Add Event Modal */}
       {showAddForm && (
         <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
           <div className="bg-teal-900 rounded-2xl shadow-2xl w-full max-w-md border border-teal-700">
             <div className="p-6 bg-gradient-to-r from-teal-600 to-green-500 rounded-t-2xl">
               <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-white">Add New Event</h2>
                 <button
                   onClick={() => setShowAddForm(false)}
                   className="text-white hover:text-gray-300 transition-colors"
                 >
                   <X size={24} />
                 </button>
               </div>
             </div>
             <div className="p-6 space-y-4">
               <input
                 required
                 type="text"
                 placeholder="Event Name"
                 className="w-full p-4 rounded-lg bg-teal-800 border border-teal-700 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                 value={newEvent.name}
                 onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
               />
               <input
                 required
                 type="text"
                 placeholder="Location"
                 className="w-full p-4 rounded-lg bg-teal-800 border border-teal-700 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                 value={newEvent.location}
                 onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
               />
               <input
                 required
                 type="date"
                 className="w-full p-4 rounded-lg bg-teal-800 border border-teal-700 text-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                 value={newEvent.date}
                 onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
               />
               <input
                 required
                 type="number"
                 min={1}
                 className="w-full p-4 rounded-lg bg-teal-800 border border-teal-700 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                 placeholder="Available Seats"
                 value={newEvent.available_seats}
                 onChange={(e) => setNewEvent({ ...newEvent, available_seats: Number(e.target.value) })}
               />
               <div className="flex justify-end gap-3 pt-4">
                 <button
                   type="button"
                   onClick={() => setShowAddForm(false)}
                   className="px-6 py-3 border border-gray-500 text-gray-300 hover:text-white hover:border-gray-400 rounded-lg transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   type="button"
                   onClick={handleAddEvent}
                   disabled={addEventLoading}
                   className="px-8 py-3 bg-green-500 hover:bg-green-400 disabled:bg-green-700 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-all transform hover:scale-105 disabled:transform-none flex items-center justify-center"
                 >
                   {addEventLoading ? (
                     <>
                       <Loader2 className="h-4 w-4 animate-spin mr-2" />
                       Creating...
                     </>
                   ) : (
                     'Create'
                   )}
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}


       {/* Booking Modal */}
       {showForm && selectedEvent && (
         <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
           <div className="bg-teal-900 rounded-2xl shadow-2xl w-full max-w-md border border-teal-700">
             <div className="p-6 bg-gradient-to-r from-teal-600 to-green-500 rounded-t-2xl">
               <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-white">
                   Book for {selectedEvent.name}
                 </h2>
                 <button
                   onClick={() => setShowForm(false)}
                   className="text-white hover:text-gray-300 transition-colors"
                 >
                   <X size={24} />
                 </button>
               </div>
             </div>
             <div className="p-6 space-y-4">
               <input
                 required
                 type="text"
                 placeholder="Your Name"
                 className="w-full p-4 rounded-lg bg-teal-800 border border-teal-700 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                 value={formData.name}
                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
               />
               <input
                 required
                 type="email"
                 placeholder="Email"
                 className="w-full p-4 rounded-lg bg-teal-800 border border-teal-700 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                 value={formData.email}
                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
               />
               <input
                 required
                 type="number"
                 min={1}
                 max={selectedEvent.available_seats}
                 placeholder="Seats"
                 className="w-full p-4 rounded-lg bg-teal-800 border border-teal-700 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                 value={formData.seats}
                 onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
               />
               <div className="flex justify-end gap-3 pt-4">
                 <button
                   type="button"
                   onClick={() => setShowForm(false)}
                   className="px-6 py-3 border border-gray-500 text-gray-300 hover:text-white hover:border-gray-400 rounded-lg transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   type="button"
                   onClick={handleSubmit}
                   disabled={bookingLoading}
                   className="px-8 py-3 bg-green-500 hover:bg-green-400 disabled:bg-green-700 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-all transform hover:scale-105 disabled:transform-none flex items-center justify-center"
                 >
                   {bookingLoading ? (
                     <>
                       <Loader2 className="h-4 w-4 animate-spin mr-2" />
                       Booking...
                     </>
                   ) : (
                     'Confirm'
                   )}
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   </div>
 );
}


