import React, { useEffect, useState } from 'react';
import { fetchSheetData } from '../services/api';
import { Users, Activity, Award, PlusCircle, BarChart2, CheckCircle2 } from 'lucide-react';
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

  // --- STATS CALCULATION FOR DATA ANALYST ---
  const totalMuqarrib = sapiData.length + dombaData.length;
  
  // Extract number from HEWAN_QURBAN (e.g., "SAPI NO. 3" -> 3)
  const sapiNumbers = sapiData
    .map(d => parseInt((d.HEWAN_QURBAN || '').replace(/\D/g, '')))
    .filter(n => !isNaN(n));
  const totalSapi = sapiNumbers.length > 0 ? Math.max(...sapiNumbers) : 0;
  const totalDomba = dombaData.length;

  const sapiTambahan = sapiData.filter(d => d.PESANAN_TAMBAHAN && d.PESANAN_TAMBAHAN.trim() !== '' && d.PESANAN_TAMBAHAN !== '-').length;
  const dombaTambahan = dombaData.filter(d => d.PESANAN_TAMBAHAN && d.PESANAN_TAMBAHAN.trim() !== '' && d.PESANAN_TAMBAHAN !== '-').length;
  const totalTambahan = sapiTambahan + dombaTambahan;

  const completeSapiGroups = Math.floor(sapiData.length / 7);
  const incompleteSapiMembers = sapiData.length % 7;

  // --- ORDER TYPE DISTRIBUTION ---
  const allOrders = [...sapiData, ...dombaData].map(d => (d.PESANAN || '').toUpperCase());
  let pahaCount = 0;
  let dagingCount = 0;
  let lainnyaCount = 0;

  allOrders.forEach(o => {
    if (o.includes('PAHA')) {
      pahaCount++;
    } else if (o.includes('KG') || o.includes('DAGING')) {
      dagingCount++;
    } else {
      lainnyaCount++;
    }
  });

  const totalOrders = allOrders.length || 1;
  const pahaPct = Math.round((pahaCount / totalOrders) * 100);
  const dagingPct = Math.round((dagingCount / totalOrders) * 100);
  const lainnyaPct = Math.round((lainnyaCount / totalOrders) * 100);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <header className="flex justify-between items-center no-print pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <Users className="text-qurban-600 w-8 h-8" />
            Dashboard Analitik Qurban
          </h1>
          <p className="text-slate-500 mt-1 font-medium">DKM Sabilul Fitroh - Real-time Insight 1446 H / 2025 M</p>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-qurban-600"></div>
        </div>
      ) : (
        <div className="space-y-8 no-print">
          {/* Stat Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat 1: Total Muqarrib */}
            <div className="glass-card p-6 flex items-center justify-between border-l-4 border-qurban-500 bg-white">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Muqarrib</p>
                <h3 className="text-2xl font-black text-slate-850 mt-1">{totalMuqarrib} Orang</h3>
                <p className="text-slate-500 text-[10px] font-semibold mt-1">
                  {sapiData.length} Sapi · {dombaData.length} Domba
                </p>
              </div>
              <div className="w-12 h-12 bg-qurban-50 rounded-xl flex items-center justify-center text-qurban-600">
                <Users size={24} />
              </div>
            </div>

            {/* Stat 2: Total Hewan */}
            <div className="glass-card p-6 flex items-center justify-between border-l-4 border-amber-500 bg-white">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Hewan Qurban</p>
                <h3 className="text-2xl font-black text-slate-850 mt-1">{totalSapi + totalDomba} Ekor</h3>
                <p className="text-slate-500 text-[10px] font-semibold mt-1">
                  {totalSapi} Kelompok Sapi · {totalDomba} Domba
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <Activity size={24} />
              </div>
            </div>

            {/* Stat 3: Cow Group Fill status */}
            <div className="glass-card p-6 flex items-center justify-between border-l-4 border-blue-500 bg-white">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Rombongan Sapi</p>
                <h3 className="text-2xl font-black text-slate-850 mt-1">{completeSapiGroups} Penuh</h3>
                <p className="text-slate-500 text-[10px] font-semibold mt-1">
                  {incompleteSapiMembers > 0 ? `${incompleteSapiMembers}/7 orang di kelompok berjalan` : 'Semua kelompok penuh'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Award size={24} />
              </div>
            </div>

            {/* Stat 4: Additional Orders */}
            <div className="glass-card p-6 flex items-center justify-between border-l-4 border-purple-500 bg-white">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Paket Tambahan</p>
                <h3 className="text-2xl font-black text-slate-850 mt-1">{totalTambahan} Paket</h3>
                <p className="text-slate-500 text-[10px] font-semibold mt-1">
                  Sapi ({sapiTambahan}) · Domba ({dombaTambahan})
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <PlusCircle size={24} />
              </div>
            </div>
          </div>

          {/* Analytics Visual Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Panel 1: Meat Order Distribution Analysis */}
            <div className="glass-card p-6 bg-white">
              <div className="flex items-center gap-2 mb-6">
                <BarChart2 className="text-qurban-600 w-5 h-5" />
                <h3 className="text-lg font-bold text-slate-800">Analisis Distribusi Paket Daging</h3>
              </div>
              
              <div className="space-y-5">
                {/* Daging Kiloan */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                    <span>PAKET DAGING UTAMA (KILOAN)</span>
                    <span>{dagingCount} Pkt ({dagingPct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-qurban-600 h-full rounded-full transition-all duration-500" style={{ width: `${dagingPct}%` }}></div>
                  </div>
                </div>

                {/* Bagian Paha */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                    <span>PAHA (DEPAN/BELAKANG/KANAN)</span>
                    <span>{pahaCount} Pkt ({pahaPct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${pahaPct}%` }}></div>
                  </div>
                </div>

                {/* Lainnya */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                    <span>LAINNYA (SIKI, BKS, JEROAN)</span>
                    <span>{lainnyaCount} Pkt ({lainnyaPct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${lainnyaPct}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 2: Sapi Rombongan fill rate status */}
            <div className="glass-card p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="text-qurban-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-slate-800">Status Kelompok Sapi (7 Orang per Rombongan)</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
                  Setiap 1 Ekor Sapi harus dipenuhi oleh tepat 7 orang muqarrib agar rombongan sah dan penuh.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: totalSapi }).map((_, idx) => {
                  const groupNum = idx + 1;
                  // For each group, check how many members exist
                  // If it's not the last group, it's 7/7 (unless total length is not multiple)
                  const isLast = groupNum === totalSapi;
                  const members = (isLast && incompleteSapiMembers > 0) ? incompleteSapiMembers : 7;
                  const pct = Math.round((members / 7) * 100);

                  return (
                    <div key={idx} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex flex-col items-center">
                      <div className="font-bold text-xs text-slate-400">SAPI {groupNum}</div>
                      <div className="text-xl font-black text-slate-800 mt-2">{members} / 7</div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${pct === 100 ? 'bg-qurban-600' : 'bg-blue-500 animate-pulse'}`} 
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <span className={`text-[9px] font-bold mt-2 uppercase px-1.5 py-0.5 rounded-full ${
                        pct === 100 ? 'bg-qurban-100 text-qurban-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {pct === 100 ? 'Sah/Penuh' : 'Kurang'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DataCard title="Data Muqarrib Sapi" data={sapiData} type="sapi" onRefresh={loadData} />
            <DataCard title="Data Muqarrib Domba" data={dombaData} type="domba" onRefresh={loadData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
