import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  PhoneCall,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../../services/api';

// Custom Leaflet Icons using SVG DivIcons
const createCustomIcon = (bgColor, iconChar) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: ${bgColor};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        border: 2px solid white;
      ">
        ${iconChar}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

const ngoIcon = createCustomIcon('#0ea5e9', '🌱');
const restaurantIcon = createCustomIcon('#1e293b', '🍽️');
const activeIcon = createCustomIcon('#10b981', '✓');

import { useSearch } from '../../context/SearchContext';

export default function NearbyRestaurantsPage() {
  const { searchQuery: globalQuery } = useSearch();
  const [restaurants, setRestaurants] = useState([]);
  const [ngoCenter, setNgoCenter] = useState({ lat: 26.914, lng: 75.788, name: 'Green Future Foundation' });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Outreach drawer state
  const [activeRestaurant, setActiveRestaurant] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [outreachResult, setOutreachResult] = useState(null);
  const [simulatingReply, setSimulatingReply] = useState(false);
  const [replyResult, setReplyResult] = useState(null);
  const [addedToSchedule, setAddedToSchedule] = useState(false);
  const [certifying, setCertifying] = useState(false);
  const [certificateResult, setCertificateResult] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await api.getNearbyRestaurants();
      if (res.restaurants) {
        setRestaurants(res.restaurants);
      }
      if (res.ngo_center) {
        setNgoCenter(res.ngo_center);
      }
    } catch (err) {
      console.error('Error fetching nearby restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (restaurant, channel = 'both') => {
    setActiveRestaurant(restaurant);
    setConnecting(true);
    setOutreachResult(null);
    setReplyResult(null);
    setAddedToSchedule(false);
    setCertificateResult(restaurant.certificate || null);

    try {
      const res = await api.connectRestaurant(restaurant.id, {
        channel,
        ngo_name: 'Green Future Foundation',
        custom_phone: restaurant.phone,
      });
      setOutreachResult(res);

      // Update local state
      setRestaurants((prev) =>
        prev.map((r) =>
          r.id === restaurant.id
            ? { ...r, status: 'Outreach Sent', last_outreach: res }
            : r
        )
      );
    } catch (err) {
      console.error('Failed to trigger outreach:', err);
      alert('Failed to connect: ' + err.message);
    } finally {
      setConnecting(false);
    }
  };

  const handleSimulateReply = async (restaurantId) => {
    setSimulatingReply(true);
    try {
      const res = await api.simulateRestaurantReply(restaurantId, {
        reply_text: 'Namaste! Yes, we have about 45 meal portions of hot paneer curry & roti packed in clean trays. Please send a volunteer before 3:00 PM.',
      });
      setReplyResult(res);

      // Update local state
      setRestaurants((prev) =>
        prev.map((r) =>
          r.id === restaurantId
            ? { ...r, status: 'Surplus Confirmed', surplus_data: res.parsed_reply }
            : r
        )
      );
    } catch (err) {
      console.error('Failed to simulate reply:', err);
    } finally {
      setSimulatingReply(false);
    }
  };

  const handleAcceptAndCertify = async (restaurantId) => {
    setCertifying(true);
    try {
      const res = await api.acceptAndCertifyDonation(restaurantId, {
        volunteer_name: 'Aman (Field Volunteer ID #GF-402)',
        ngo_name: 'Green Future Foundation',
        pickup_notes: 'Sanitized food containers inspected and verified.'
      });
      setCertificateResult(res.certificate);

      // Update local state
      setRestaurants((prev) =>
        prev.map((r) =>
          r.id === restaurantId
            ? { ...r, status: 'Certificate Issued & Protected', certificate: res.certificate }
            : r
        )
      );
    } catch (err) {
      console.error('Failed to certify donation:', err);
      alert('Certification failed: ' + err.message);
    } finally {
      setCertifying(false);
    }
  };

  const activeSearch = (search || globalQuery || '').toLowerCase().trim();

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      !activeSearch ||
      r.name?.toLowerCase().includes(activeSearch) ||
      r.cuisine?.toLowerCase().includes(activeSearch) ||
      r.address?.toLowerCase().includes(activeSearch);
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Live Food Recovery Radar
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Nearby Restaurants & Outreach
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Restaurants never need to register. Simply click to connect — reach the manager via WhatsApp or call to coordinate surplus food donations.
          </p>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Restaurant Directory */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left 7 Columns: Interactive Map with Pins */}
        <div className="xl:col-span-7 space-y-4">
          <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between px-2 pt-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <MapPin className="w-4 h-4 text-sky-500" />
                <span>Jaipur Shelter Zone (2.5 km Radius)</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {filteredRestaurants.length} Donors on Radar
              </span>
            </div>

            {/* Leaflet Map Container */}
            <div className="w-full h-[440px] rounded-2xl overflow-hidden shadow-inner border border-slate-200/80 relative z-10">
              <MapContainer
                center={[ngoCenter.lat, ngoCenter.lng]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* NGO Shelter Pin */}
                <Marker position={[ngoCenter.lat, ngoCenter.lng]} icon={ngoIcon}>
                  <Popup>
                    <div className="text-xs p-1">
                      <span className="font-bold text-sky-700 block">🌱 {ngoCenter.name} (Your Shelter)</span>
                      <span className="text-slate-500 text-[10px]">{ngoCenter.address}</span>
                    </div>
                  </Popup>
                </Marker>

                {/* Restaurant Pins */}
                {filteredRestaurants.map((restaurant) => {
                  const isConfirmed = restaurant.status === 'Surplus Confirmed';
                  return (
                    <Marker
                      key={restaurant.id}
                      position={[restaurant.lat, restaurant.lng]}
                      icon={isConfirmed ? activeIcon : restaurantIcon}
                    >
                      <Popup>
                        <div className="text-xs p-1 space-y-1.5 min-w-[160px]">
                          <div className="font-bold text-slate-900">{restaurant.name}</div>
                          <div className="text-[10px] text-slate-500">{restaurant.cuisine}</div>
                          <div className="text-[10px] text-sky-600 font-medium">📍 {restaurant.distance} away</div>
                          <div className="text-[10px] text-slate-600">Surplus: {restaurant.avg_daily_surplus}</div>
                          <div className="pt-1 flex gap-1">
                            <button
                              onClick={() => handleConnect(restaurant, 'whatsapp')}
                              className="w-full py-1 rounded bg-[#151c2e] text-white text-[10px] font-semibold"
                            >
                              WhatsApp
                            </button>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>

            {/* Map Legend */}
            <div className="flex flex-wrap items-center justify-between text-xs px-2 pt-1 text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-sky-500 inline-block ring-2 ring-sky-200" />
                  Your NGO Shelter
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-800 inline-block ring-2 ring-slate-300" />
                  Nearby Restaurant
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-200" />
                  Surplus Confirmed
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Click any pin to inspect</span>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Restaurant List & 1-Click Connect Cards */}
        <div className="xl:col-span-5 space-y-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by restaurant name or cuisine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white/90 border border-white shadow-sm text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* Restaurant Cards Container */}
          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredRestaurants.map((item) => {
              const isOutreachSent = item.status === 'Outreach Sent';
              const isConfirmed = item.status === 'Surplus Confirmed';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-3xl bg-white/90 backdrop-blur-xl border transition-all duration-200 shadow-sm hover:shadow-md space-y-3 ${
                    isConfirmed
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : isOutreachSent
                      ? 'border-sky-300 bg-sky-50/20'
                      : 'border-white/80 hover:border-sky-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                        {item.is_test && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm">
                            Your Test Phone
                          </span>
                        )}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {item.distance}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.cuisine} • ⭐ {item.rating}</p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        isConfirmed
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isOutreachSent
                          ? 'bg-sky-100 text-sky-800 border border-sky-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-100 space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Manager</span>
                      <p className="font-semibold text-slate-700 truncate">{item.contact_person.split(' ')[0]}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-100 space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Phone</span>
                      <p className="font-mono font-semibold text-slate-800 truncate">{item.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Est. Surplus: <strong className="text-slate-800">{item.avg_daily_surplus}</strong></span>
                  </div>

                  {/* 1-Click Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {item.certificate ? (
                      <Link
                        to={`/verify/${item.certificate.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>View FSSAI Certificate ({item.certificate.id})</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => handleConnect(item, 'whatsapp')}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#151c2e] hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition active:scale-95"
                          title="Send WhatsApp Outreach"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp</span>
                        </button>

                        <button
                          onClick={() => handleConnect(item, 'call')}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 shadow-sm transition active:scale-95"
                          title="Initiate Voice Call"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
                          <span>Call</span>
                        </button>

                        <button
                          onClick={() => handleConnect(item, 'both')}
                          className="inline-flex items-center justify-center py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs border border-sky-200 shadow-sm transition"
                          title="Send Both Call & WhatsApp"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* DRAWER / MODAL: LIVE AI OUTREACH & CONVERSATION LOG */}
      {/* ======================================================== */}
      {activeRestaurant && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
                  Direct Outreach
                </span>
                <h3 className="text-lg font-bold text-slate-900">{activeRestaurant.name}</h3>
              </div>
              <button
                onClick={() => setActiveRestaurant(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Connecting Spinner */}
            {connecting && (
              <div className="py-8 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-sky-500 animate-spin mx-auto" />
                <p className="text-xs font-semibold text-slate-700">
                  Preparing outreach message & dispatching...
                </p>
                <p className="text-[11px] text-slate-400">Target: {activeRestaurant.phone}</p>
              </div>
            )}

            {/* Outreach Sent Report */}
            {!connecting && outreachResult && (
              <div className="space-y-4 text-xs">
                
                {/* Status Bar */}
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Outreach Dispatched to Manager</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                    {outreachResult.target_phone}
                  </span>
                </div>

                {/* Message Bubble */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <span className="flex items-center gap-1.5 font-bold text-slate-700">
                      Outreach Message
                    </span>
                    <span className="text-[10px] text-slate-400">Channel: {outreachResult.channel}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-800 leading-relaxed font-sans text-xs">
                    "{outreachResult.ai_generated_message}"
                  </div>
                </div>

                {/* In-App Automated Delivery Status (No Redirection) */}
                {outreachResult.whatsapp_status?.mode === 'live_twilio' ? (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Automated message delivered to {outreachResult.target_phone} via Twilio! (SID: {outreachResult.whatsapp_status?.sid})</span>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs space-y-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800">
                      <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Twilio Sandbox Verification Needed for {outreachResult.target_phone}</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      On your Twilio Trial account, to receive automated messages directly on WhatsApp without redirect, send your Twilio sandbox join code (from Twilio Console) to <strong className="font-mono text-slate-900">+1 415 523 8886</strong> once. After that, all AI messages will deliver directly to your phone.
                    </p>
                  </div>
                )}

                {/* Delivery Mode details */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">WhatsApp Status</span>
                    <span className="font-semibold text-slate-700">
                      {outreachResult.whatsapp_status?.status || 'Sent'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Call Status</span>
                    <span className="font-semibold text-slate-700">
                      {outreachResult.call_status?.status || 'Call Queued'}
                    </span>
                  </div>
                </div>

                {/* Simulate Manager Reply Section */}
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-900 text-xs">Manager Response Simulator</span>
                    <span className="text-[10px] text-sky-700">Two-way Demo</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Test what happens when the manager replies on WhatsApp saying they have surplus food ready for collection.
                  </p>

                  <button
                    onClick={() => handleSimulateReply(activeRestaurant.id)}
                    disabled={simulatingReply || !!replyResult}
                    className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-emerald-600 text-white font-semibold text-xs transition flex items-center justify-center gap-2"
                  >
                    {simulatingReply ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Parsing Incoming Response with Gemini...</span>
                      </>
                    ) : replyResult ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Surplus Confirmed by Manager!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Simulate Restaurant Reply: "Yes, 45 meals ready"</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Step 2: Dual-Party Confirmation & FSSAI 2019 Certificate Generation */}
                {(replyResult || activeRestaurant.surplus_data) && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-sky-50 border-2 border-emerald-300 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Donor Trust & Legal Protection Layer
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">FSSAI 2019</span>
                    </div>

                    <div className="text-[11px] text-slate-700 space-y-1 bg-white/80 p-3 rounded-xl border border-emerald-100">
                      <p>
                        <strong>Donor Offer:</strong> "{replyResult?.restaurant?.surplus_data?.reply_text || activeRestaurant.surplus_data?.reply_text || '45 meals of hot cooked food ready'}"
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Server Timestamp 1 (Donor Offer): <span className="font-mono text-slate-700 font-semibold">{replyResult?.restaurant?.surplus_data?.confirmed_at || activeRestaurant.surplus_data?.confirmed_at || 'Recorded'}</span>
                      </p>
                    </div>

                    {/* Certificate Status or Action */}
                    {certificateResult || activeRestaurant.certificate ? (
                      <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Official Certificate Issued & Protected!
                          </span>
                          <span className="font-mono text-[11px] text-slate-800 font-bold">
                            {(certificateResult || activeRestaurant.certificate).id}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Dual-confirmed tamper-proof record locked in database. WhatsApp proof link automatically dispatched to {activeRestaurant.phone}.
                        </p>
                        <div className="pt-1 flex gap-2">
                          <Link
                            to={`/verify/${(certificateResult || activeRestaurant.certificate).id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs text-center transition flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View Public Certificate & QR</span>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Accepting this donation will record server timestamp 2 (NGO Acceptance) and immediately issue the official FSSAI 2019 Liability Protection Certificate to the donor over WhatsApp.
                        </p>
                        <button
                          onClick={() => handleAcceptAndCertify(activeRestaurant.id)}
                          disabled={certifying}
                          className="w-full py-2.5 rounded-xl bg-[#151c2e] hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
                        >
                          {certifying ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Dual-Confirming & Generating Certificate...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                              <span>Accept & Issue FSSAI Liability Protection Certificate</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setAddedToSchedule(true);
                        alert(`Surplus from ${activeRestaurant.name} has been added to your schedule!`);
                      }}
                      disabled={addedToSchedule}
                      className="w-full mt-2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:bg-emerald-100 text-slate-800 disabled:text-emerald-800 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{addedToSchedule ? '✓ Scheduled on Board' : 'Add to Rescue Schedule'}</span>
                    </button>
                  </div>
                )}

              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveRestaurant(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
