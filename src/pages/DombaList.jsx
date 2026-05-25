import React, { useEffect, useState } from 'react';
import { fetchSheetData } from '../services/api';
import DataCard from '../components/DataCard';

export default function DombaList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const result = await fetchSheetData('Domba');
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Data Domba</h1>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-qurban-600" />
        </div>
      ) : (
        <DataCard title="Data Muqarrib Domba" data={data} type="domba" onRefresh={load} />
      )}
    </div>
  );
}
