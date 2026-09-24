import React from 'react';
import { useParams } from 'react-router-dom';

export default function DriverPickupDetail() {
  const { id } = useParams();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Pickup Assignment Detail</h1>
      <p className="text-slate-400">Viewing assignment ID: {id}</p>
    </div>
  );
}
