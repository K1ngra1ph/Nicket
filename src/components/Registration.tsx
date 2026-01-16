import React, { useState, useEffect } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { EventOption } from '../App';

interface RegistrationProps {
  events: EventOption[];
}

const Registration: React.FC<RegistrationProps> = ({ events }) => {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedEventDetails, setSelectedEventDetails] = useState<EventOption | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', countryCode: '234' });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    localStorage.removeItem("userData");
    const preSelectedId = localStorage.getItem("preSelectedEventId");
    if (preSelectedId && events.length > 0) {
      const foundEvent = events.find(ev => ev._id === preSelectedId);
      if (foundEvent) {
        setSelectedEventId(preSelectedId);
        setSelectedEventDetails(foundEvent);
      }
    }
  }, [events]);

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
    localStorage.removeItem("preSelectedEventId");
    window.location.href = `game.html?event=${selectedEventId}`; 
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-lg bg-custom-card p-8 rounded-[32px] border border-custom shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-center font-bold text-gray-400 uppercase tracking-widest text-xs mb-4">Registration Form</h2>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input type="text" required placeholder="Full Name" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-custom focus:border-brand-light outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input type="email" required placeholder="Email Address" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-custom focus:border-brand-light outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
            <div className="flex gap-2">
              <select className="w-24 p-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-custom outline-none" value={formData.countryCode} onChange={e => setFormData({...formData, countryCode: e.target.value})}>
                <option value="234">+234</option>
                <option value="1">+1</option>
              </select>
              <input type="tel" required placeholder="Phone" className="flex-1 p-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-custom focus:border-brand-light outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Active Event</label>
            <div className="relative">
              <select required className="w-full p-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-custom outline-none appearance-none font-bold" value={selectedEventId} onChange={handleEventChange}>
                <option value="">-- Choose Event --</option>
                {events.filter(e => e.active).map(ev => (
                  <option key={ev._id} value={ev._id}>{ev.name}</option>
                ))}
              </select>
            </div>
            
            {/* Detailed Metadata box matches EventManager */}
            {selectedEventDetails && (
              <div className="mt-3 p-5 bg-brand-light/10 dark:bg-brand-dark/10 rounded-2xl text-xs sm:text-sm text-brand-light dark:text-brand-dark font-bold leading-relaxed border border-brand-light/20">
                <div className="mb-1">📍 LOCATION: {selectedEventDetails.location}</div> 
                <div className="mb-1">📅 DATE: {selectedEventDetails.date}</div> 
                <div>💰 TICKET: ₦{selectedEventDetails.price.toLocaleString()}</div>
              </div>
            )}
          </div>

          <button type="submit" className="w-full py-4 bg-custom-btn text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg flex justify-center items-center gap-2 uppercase">Proceed To Game <ArrowRight size={20} /></button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
          <div className="bg-custom-card p-8 rounded-[32px] max-w-lg w-full text-center shadow-2xl relative border border-custom">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
            <h3 className="text-3xl font-black mb-4 text-green-600 uppercase italic">Ready! 🎉</h3>
            <div className="text-gray-700 dark:text-gray-300 mb-6 space-y-2">
              <p>Entry confirmed for <span className="font-bold text-brand-light">{selectedEventDetails?.name}</span>.</p>
            </div>
            <button onClick={proceedToGame} className="w-full py-4 bg-custom-btn text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg uppercase tracking-widest">OK, Let's Play!</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;