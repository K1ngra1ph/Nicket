import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2, X } from 'lucide-react';

interface EventOption {
  _id: string;
  name: string;
  location: string;
  date: string;
  price: number;
  currency: string;
}

const Registration: React.FC = () => {
  const [events, setEvents] = useState<EventOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedEventDetails, setSelectedEventDetails] = useState<EventOption | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '234'
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/events?active=true');
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedEventId(id);
    const evt = events.find(ev => ev._id === id) || null;
    setSelectedEventDetails(evt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventDetails) return;

    localStorage.setItem("userData", JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: `${formData.countryCode}${formData.phone}`,
      eventName: selectedEventDetails.name,
      eventValue: selectedEventDetails._id,
      price: selectedEventDetails.price,
      currency: selectedEventDetails.currency || 'NGN'
    }));

    setShowModal(true);
  };

  const proceedToGame = () => {
    window.location.href = "game.html";
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-lg bg-custom-card p-8 rounded-[32px] border border-custom shadow-xl">

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input 
              type="text" 
              required
              placeholder="Enter your full name"
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-custom focus:border-brand-light outline-none transition-colors"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input 
              type="email" 
              required
              placeholder="Enter your email"
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-custom focus:border-brand-light outline-none transition-colors"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
            <div className="flex gap-2">
              <select 
                className="w-24 p-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-custom outline-none"
                value={formData.countryCode}
                onChange={e => setFormData({...formData, countryCode: e.target.value})}
              >
                <option value="234">+234</option>
                <option value="1">+1</option>
                <option value="44">+44</option>
              </select>
              <input 
                type="tel" 
                required
                placeholder="Phone number"
                className="flex-1 p-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-custom focus:border-brand-light outline-none transition-colors"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Event</label>
            <div className="relative">
              <select 
                required
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-custom outline-none appearance-none"
                value={selectedEventId}
                onChange={handleEventChange}
              >
                <option value="">-- Choose Event --</option>
                {loading ? (
                  <option>Loading events...</option>
                ) : (
                  events.map(ev => (
                    <option key={ev._id} value={ev._id}>{ev.name}</option>
                  ))
                )}
              </select>
              {loading && <Loader2 size={20} className="absolute right-4 top-4 animate-spin text-gray-400"/>}
            </div>
            
            {selectedEventDetails && (
              <div className="mt-3 p-4 bg-brand-light/10 dark:bg-brand-dark/10 rounded-xl text-sm text-brand-light dark:text-brand-dark font-medium">
                📍 {selectedEventDetails.location} <br/>
                📅 {selectedEventDetails.date}
              </div>
            )}
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-custom-btn text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg flex justify-center items-center gap-2"
          >
            I Don Ready <ArrowRight size={20} />
          </button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
          <div className="bg-custom-card p-8 rounded-[32px] max-w-lg w-full text-center shadow-2xl relative border border-custom">
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold mb-4 text-green-600 font-albert">Registration Successful 🎉</h3>
            
            <div className="text-gray-700 dark:text-gray-300 mb-6 space-y-2">
              <p>Thank you, <strong>{formData.name}</strong>!</p>
              <p>You’ve successfully registered for <span className="font-bold text-brand-light dark:text-brand-dark">{selectedEventDetails?.name}</span>.</p>
            </div>

            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl mb-6 text-left border border-custom">
              <h4 className="font-bold mb-3 text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">🎮 Game Rules:</h4>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <li>Pick your numbers carefully — once submitted, you can’t change them.</li>
                <li>Winners will be announced before the event day.</li>
                <li>Ensure your contact details are correct to receive your VIP/Backstage ticket.</li>
                <li>Incomplete or invalid registrations may be disqualified.</li>
              </ul>
            </div>

            <p className="mb-6 text-sm font-medium text-gray-500">
              Click <span className="font-bold text-gray-800 dark:text-white">OK</span> to continue to the game page.
            </p>

            <button 
              onClick={proceedToGame}
              className="w-full py-4 bg-custom-btn text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg"
            >
              OK, Let's Play!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;