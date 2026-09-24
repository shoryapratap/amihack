import React, { useState } from 'react';
import { Truck, MapPin, Clock, ShieldCheck, CheckCircle2, Navigation, AlertTriangle, Phone } from 'lucide-react';

export default function DriverDashboard() {
  const [pickups, setPickups] = useState([
    {
      id: 'PK-901',
      donorName: 'The Grand Palace Banquet',
      address: 'Plot 42, Civil Lines, Jaipur',
      shelterName: 'Green Future Shelter',
      foodType: 'Cooked Meals (80 Pax) - Hot Insulated Carts',
      timeSlot: '09:00 am - 10:00 am',
      urgency: 'Immediate (< 45m left)',
      status: 'In Transit',
      distance: '2.4 km',
      temperatureLog: '68°C (Safe Warm Hold)',
      dotColor: 'bg-indigo-400',
    },
    {
      id: 'PK-902',
      donorName: 'Marriott Grand Cafe',
      address: 'Ashram Marg, Near Airport, Jaipur',
      shelterName: 'Seva Rasoi Night Shelter',
      foodType: 'Fresh Salad & Continental Trays',
      timeSlot: '10:00 am - 11:15 am',
      urgency: 'Scheduled',
      status: 'Assigned',
      distance: '3.1 km',
      temperatureLog: '4°C (Chilled)',
      dotColor: 'bg-sky-400',
    },
    {
      id: 'PK-903',
      donorName: 'BigBasket Distribution Center',
      address: 'Warehouse Zone B, Mansarovar',
      shelterName: 'Hope Child Care',
      foodType: 'Fresh Apples & Dairy Packs (70 kg)',
      timeSlot: '11:30 am - 12:45 pm',
      urgency: 'Scheduled',
      status: 'Assigned',
      distance: '4.5 km',
      temperatureLog: 'Ambient/Chilled',
      dotColor: 'bg-emerald-400',
    },
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    setPickups((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200/60 flex items-center justify-center text-sky-600">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">3</div>
            <div className="text-xs text-slate-400 font-medium">Assigned Pickups Today</div>
          </div>
        </div>

        <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">195</div>
            <div className="text-xs text-slate-400 font-medium">Meals Rescued Today</div>
          </div>
        </div>

        <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">Section 24 FSSAI</div>
            <div className="text-xs text-slate-400 font-medium">Full Driver Protection</div>
          </div>
        </div>
      </div>

      {/* Main Pickups List */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Rescue Manifest</h2>
            <p className="text-xs text-slate-400">Step-by-step pickup and drop-off instructions</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
            Refrigerated Van: MH-12-AB-1234
          </span>
        </div>

        <div className="space-y-4 pt-2">
          {pickups.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-100/90 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className={`w-3.5 h-3.5 rounded-full ${item.dotColor} shadow-sm`} />
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.id}</span>
                    <h3 className="text-base font-bold text-slate-900">{item.donorName}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">ETA: {item.distance}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Pickup Location</span>
                  <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {item.address}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Drop-off Shelter</span>
                  <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {item.shelterName}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Food Cargo & Temp</span>
                  <p className="font-semibold text-slate-700">{item.foodType}</p>
                  <p className="text-[11px] text-sky-600 font-medium">🌡️ {item.temperatureLog}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Window: <span className="font-semibold text-slate-700">{item.timeSlot}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Opening GPS Navigation to ${item.donorName}...`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                  >
                    <Navigation className="w-3.5 h-3.5 text-slate-600" />
                    <span>Navigate</span>
                  </button>

                  {item.status !== 'Delivered' && (
                    <button
                      onClick={() => handleUpdateStatus(item.id, item.status === 'Assigned' ? 'In Transit' : 'Delivered')}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#151c2e] hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{item.status === 'Assigned' ? 'Mark Picked Up' : 'Confirm Delivery'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
