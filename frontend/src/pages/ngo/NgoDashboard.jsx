import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import api from '../../services/api';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Check,
  X,
  Clock,
  MapPin,
  Search
} from 'lucide-react';

export default function NgoDashboard() {
  const { searchQuery } = useSearch();
  const [viewMode, setViewMode] = useState('Day');
  const [selectedPartners, setSelectedPartners] = useState([1, 2, 3, 4]);
  const [selectedCategories, setSelectedCategories] = useState([
    'cooked',
    'fresh',
    'dairy',
    'bakery'
  ]);
  const [activeCard, setActiveCard] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New entry form state
  const [newDonor, setNewDonor] = useState('');
  const [newType, setNewType] = useState('');
  const [newTime, setNewTime] = useState('11:00 am - 12:00 pm');
  const [newPartner, setNewPartner] = useState(1);

  // Partners matching reference image style
  const partners = [
    {
      id: 1,
      name: 'Darlene Robertson',
      isYou: true,
      role: 'Family Shelter Coordinator',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      name: 'Michael Thompson',
      isYou: false,
      role: 'Community Kitchen Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      name: 'Max Worthington',
      isYou: false,
      role: 'Logistics Supervisor',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      name: 'Dr. McCoy',
      isYou: false,
      role: 'Regional Food Inspector',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
  ];

  // Category filter
  const categories = [
    { id: 'cooked', label: 'Hot Cooked Meals' },
    { id: 'fresh', label: 'Fresh Produce & Fruits' },
    { id: 'dairy', label: 'Dairy & Refrigerated' },
    { id: 'bakery', label: 'Bakery & Bread' },
    { id: 'grains', label: 'Raw Staples & Grains' },
    { id: 'event', label: 'Banquet Surplus' },
  ];

  // Appointments / Rescues (Cards layout matching the reference image)
  const [scheduleItems, setScheduleItems] = useState([
    {
      id: 'it-1',
      colIndex: 2, // Michael Thompson
      timeSlot: '9 am',
      timeLabel: '09:00 am - 10:00 am',
      title: 'Ruby Jackson',
      subtitle: 'Private Consultation',
      dotColor: 'bg-indigo-300',
      striped: true,
      location: 'Grand Plaza Hall, Banquet 2',
      quantity: '65 Meals (Hot Vegetarian)',
    },
    {
      id: 'it-2',
      colIndex: 3, // Max Worthington
      timeSlot: '9 am',
      timeLabel: '09:00 am - 10:30 am',
      title: 'Darlene Robertson',
      subtitle: 'Group Consultation',
      dotColor: 'bg-sky-300',
      striped: true,
      location: 'City Convention Center',
      quantity: '80 Meal Boxes',
    },
    {
      id: 'it-3',
      colIndex: 1, // Darlene Robertson
      timeSlot: '10 am',
      timeLabel: '10:00 am - 11:10 am',
      title: 'Adam Bridges',
      subtitle: 'Private Consultation',
      dotColor: 'bg-indigo-300',
      striped: false,
      location: 'Haldiram Sweets & Dining',
      quantity: '40 kg Fresh Snack Trays',
    },
    {
      id: 'it-4',
      colIndex: 4, // Dr. McCoy
      timeSlot: '10 am',
      timeLabel: '10:00 am - 11:30 am',
      title: 'Max Worthington',
      subtitle: 'Group Consultation',
      dotColor: 'bg-sky-300',
      striped: false,
      location: 'Central Distribution Warehouse',
      quantity: '120 kg Apples & Oranges',
    },
    {
      id: 'it-5',
      colIndex: 1, // Darlene Robertson
      timeSlot: '11 am',
      timeLabel: '11:20 am - 12:20 am',
      title: 'Nichols Family',
      subtitle: 'Family Consultation',
      dotColor: 'bg-emerald-300',
      striped: false,
      location: 'Hyatt Regency Kitchen',
      quantity: '50 Cooked Lunch Packs',
    },
    {
      id: 'it-6',
      colIndex: 3, // Max Worthington
      timeSlot: '11 am',
      timeLabel: '11:00 am - 12:00 am',
      title: 'Darlene Robertson',
      subtitle: 'Group Consultation',
      dotColor: 'bg-sky-300',
      striped: false,
      location: 'Maurya Bakers Outlet',
      quantity: '35 Loaves & Buns',
    },
    {
      id: 'it-7',
      colIndex: 4, // Dr. McCoy
      timeSlot: '12 am',
      timeLabel: '12:00 am - 1:00 pm',
      title: 'Nichols Family',
      subtitle: 'Family Consultation',
      dotColor: 'bg-emerald-300',
      striped: false,
      location: 'Community Dairy Depot',
      quantity: '45 Liters Pasteurized Milk',
    },
    {
      id: 'it-8',
      colIndex: 1, // Darlene Robertson
      timeSlot: '1 pm',
      timeLabel: '12:30 am - 1:30 pm',
      title: 'Teresa Moore',
      subtitle: 'Private Consultation - Child',
      dotColor: 'bg-amber-300',
      striped: false,
      location: 'Blue Tokai Cafe & Kitchen',
      quantity: '30 Sandwiches & Yogurt',
    },
    {
      id: 'it-9',
      colIndex: 2, // Michael Thompson
      timeSlot: '1 pm',
      timeLabel: '12:30 am - 1:30 pm',
      title: 'Shirley Cummings',
      subtitle: 'Private Consultation',
      dotColor: 'bg-indigo-300',
      striped: false,
      location: 'ITC Rajputana Banquet Hall',
      quantity: '90 Meals (Rice & Dal)',
    },
    {
      id: 'it-10',
      colIndex: 3, // Max Worthington
      timeSlot: '1 pm',
      timeLabel: '1:00 pm - 2:00 pm',
      title: 'Sean Duncan',
      subtitle: 'Private Consultation',
      dotColor: 'bg-indigo-300',
      striped: false,
      location: 'Subway Central Prep Hub',
      quantity: '50 Fresh Wraps',
    },
    {
      id: 'it-11',
      colIndex: 1, // Darlene Robertson
      timeSlot: '2 pm',
      timeLabel: '02:00 pm - 03:00 pm',
      title: 'Nichols Family',
      subtitle: 'Family Consultation',
      dotColor: 'bg-sky-300',
      striped: false,
      location: 'Marriott Cafe Buffet',
      quantity: '75 Hot Dinner Portions',
    },
  ]);

  const hours = ['9 am', '10 am', '11 am', '12 am', '1 pm', '2 pm'];

  const toggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const togglePartner = (partnerId) => {
    setSelectedPartners((prev) =>
      prev.includes(partnerId) ? prev.filter((p) => p !== partnerId) : [...prev, partnerId]
    );
  };

  const handleAddNew = (e) => {
    e.preventDefault();
    if (!newDonor) return;

    const newItem = {
      id: `it-${Date.now()}`,
      colIndex: Number(newPartner),
      timeSlot: '11 am',
      timeLabel: newTime,
      title: newDonor,
      subtitle: newType || 'Scheduled Dispatch',
      dotColor: 'bg-sky-300',
      striped: false,
      location: 'Scheduled Pickup Site',
      quantity: newType,
    };

    setScheduleItems((prev) => [...prev, newItem]);
    setNewDonor('');
    setNewType('');
    setShowAddModal(false);
  };

  useEffect(() => {
    async function loadLiveDonations() {
      try {
        const res = await api.getDonations();
        if (res && res.donations && res.donations.length > 0) {
          const liveItems = res.donations.map((d, i) => ({
            id: `live-don-${d.id}`,
            colIndex: (i % 4) + 1,
            timeSlot: '11 am',
            timeLabel: '11:00 am - 12:30 pm',
            title: d.donorName || 'Live Surplus Donation',
            subtitle: d.foodTitle,
            dotColor: 'bg-emerald-400',
            striped: false,
            location: d.pickupAddress,
            quantity: d.quantity,
          }));
          setScheduleItems((prev) => [...liveItems, ...prev.filter((p) => !p.id.startsWith('live-don-'))]);
        }
      } catch (e) {
        console.warn('Notice loading live donations:', e);
      }
    }
    loadLiveDonations();
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* ======================================================== */}
      {/* MAIN SCHEDULE / APPOINTMENTS GRID */}
      {/* ======================================================== */}
      <div className="w-full">
        <div className="w-full rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-5 sm:p-7 shadow-sm">

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Appointments</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Stay organized and on track with calendar
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <Link
                to="/ngo/restaurants"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 shadow-sm transition active:scale-95"
              >
                <MapPin className="w-3.5 h-3.5 text-sky-500" />
                <span>Nearby Restaurants</span>
              </Link>

              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#151c2e] hover:bg-slate-800 text-white text-xs font-semibold shadow-md shadow-slate-900/10 transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span> Add new</span>
              </button>
            </div>
          </div>

          {/* Date & View Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6">

            {/* Date Display */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-full bg-white hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-500 transition">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-7 h-7 rounded-full bg-white hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-500 transition">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm font-bold text-slate-800">22 August 2024</span>
            </div>

            {/* View Switchers */}
            <div className="flex items-center gap-3">
              <div className="flex items-center p-1 rounded-full bg-slate-100/80 border border-slate-200/60 text-xs">
                {['Day', 'Week', 'Month'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3.5 py-1 rounded-full font-semibold transition ${viewMode === mode
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-400 hover:text-slate-700'
                      }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Date Badge */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-sm">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>22 Aug</span>
              </div>
            </div>

          </div>

          {/* Schedule Grid Table */}
          <div className="overflow-x-auto">
            <div className="min-w-[720px] relative">

              {/* Partner Columns Header */}
              <div className="grid grid-cols-[4rem_1fr_1fr_1fr_1fr] border-b border-slate-100 pb-3">
                <div className="w-16"></div>
                {partners.map((partner) => (
                  <div key={partner.id} className="flex items-center gap-2.5 px-3">
                    <img
                      src={partner.avatar}
                      alt={partner.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shadow-sm"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{partner.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{partner.role}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Time Tracker Line (Across grid at 10 am) */}
              <div
                className="absolute left-16 right-0 z-20 pointer-events-none flex items-center"
                style={{ top: '128px' }}
              >
                <div className="w-3 h-3 rounded-full bg-sky-400 ring-4 ring-sky-200 shadow-md -ml-1.5" />
                <div className="h-[2px] bg-sky-400 flex-1 shadow-sm" />
              </div>

              {/* Hour Rows */}
              <div className="divide-y divide-slate-100/80">
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-[4rem_1fr_1fr_1fr_1fr] min-h-[92px] items-stretch">

                    {/* Time Label */}
                    <div className="w-16 py-3 text-xs font-semibold text-slate-400 select-none">
                      {hour}
                    </div>

                    {/* Columns */}
                    {[1, 2, 3, 4].map((colIndex) => {
                      const q = (searchQuery || '').toLowerCase().trim();
                      const matchedCards = scheduleItems.filter(
                        (c) =>
                          c.colIndex === colIndex &&
                          c.timeSlot === hour &&
                          (!q ||
                            c.title?.toLowerCase().includes(q) ||
                            c.subtitle?.toLowerCase().includes(q) ||
                            c.location?.toLowerCase().includes(q) ||
                            c.quantity?.toLowerCase().includes(q))
                      );

                      return (
                        <div
                          key={colIndex}
                          className="border-l border-slate-100/70 p-1.5 flex flex-col gap-1.5 relative group hover:bg-slate-50/40 transition"
                        >
                          {matchedCards.map((card) => (
                            <div
                              key={card.id}
                              onClick={() => setActiveCard(card)}
                              className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01] flex flex-col justify-between ${card.striped
                                  ? 'bg-striped-pattern border-sky-200/80'
                                  : 'bg-white border-slate-100 hover:border-sky-300'
                                }`}
                            >
                              <div>
                                <div className="text-xs font-bold text-slate-800 line-clamp-1">
                                  {card.title}
                                </div>
                                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                  {card.subtitle}
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/60">
                                <span className="text-[10px] text-slate-400">
                                  {card.timeLabel}
                                </span>

                                <div className="flex items-center gap-1.5">
                                  <span className={`w-3.5 h-3.5 rounded-full ${card.dotColor} shadow-sm`} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}

                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Appointment Detail Modal */}
      {activeCard && (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{activeCard.title}</h3>
                <p className="text-xs text-slate-400">{activeCard.subtitle}</p>
              </div>
              <button
                onClick={() => setActiveCard(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Time Window</span>
                <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {activeCard.timeLabel}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Location</span>
                <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {activeCard.location}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Details</span>
                <p className="font-semibold text-slate-700">{activeCard.quantity}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveCard(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#151c2e] hover:bg-slate-800 text-white font-medium text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddNew} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Entry</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Donor or Contact Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Plaza Banquet"
                  value={newDonor}
                  onChange={(e) => setNewDonor(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400/50"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Details & Quantity</label>
                <input
                  type="text"
                  placeholder="e.g. 50 Cooked Meals / 20 kg Rice"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400/50"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Assigned Partner</label>
                <select
                  value={newPartner}
                  onChange={(e) => setNewPartner(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400/50"
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Time Slot</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400/50"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#151c2e] hover:bg-slate-800 text-white font-medium text-xs transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-xs transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
