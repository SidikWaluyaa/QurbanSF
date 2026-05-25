import React, { useEffect, useState } from 'react';
import { fetchSheetData } from '../services/api';
import { Settings, Users, Printer, FileText } from 'lucide-react';
import DataCard from '../components/DataCard';

const Dashboard = () => {
  const [sapiData, setSapiData] = useState([]);
  const [dombaData, setDombaData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const sapi = await fetchSheetData('Sapi');
    const domba = await fetchSheetData('Domba');
    setSapiData(sapi);
    setDombaData(domba);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10 flex justify-between items-center no-print">
        <div>
          <h1 className="text-3xl font-bold text-qurban-950 flex items-center gap-3">
            <Users className="text-qurban-500 w-8 h-8" />
            Sistem Manajemen Qurban
          </h1>
          <p className="text-slate-500 mt-2">DKM Sabilul Fitroh - 1446 H / 2025 M</p>
        </div>
        <div className="flex gap-4">
          <button className="px-5 py-2.5 bg-qurban-50 text-qurban-700 font-semibold rounded-xl hover:bg-qurban-100 transition-colors flex items-center gap-2 border border-qurban-200 shadow-sm">
            <Settings className="w-5 h-5" />
            Pengaturan
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-qurban-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 no-print">
          <DataCard title="Data Muqarrib Sapi" data={sapiData} type="sapi" onRefresh={loadData} />
          <DataCard title="Data Muqarrib Domba" data={dombaData} type="domba" onRefresh={loadData} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;

