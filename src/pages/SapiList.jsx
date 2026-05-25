import React, { useEffect, useState } from 'react';
import { fetchSheetData } from '../services/api';
import DataCard from '../components/DataCard'; // We'll create a simple DataCard wrapper or reuse existing DataCard component

export default function SapiList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const result = await fetchSheetData('Sapi');
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Data Sapi</h1>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-qurban-600" />
        </div>
      ) : (
        <DataCard title="Data Muqarrib Sapi" data={data} type="sapi" onRefresh={load} />
      )}
    </div>
  );
}
