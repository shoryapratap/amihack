import React from 'react';
import { useParams } from 'react-router-dom';

export default function NgoDonationDetail() {
  const { id } = useParams();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Donation Details</h1>
      <p className="text-slate-400">Viewing donation ID: {id}</p>
    </div>
  );
}
