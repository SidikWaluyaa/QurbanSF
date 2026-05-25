import React, { useEffect, useState, useMemo } from 'react';
import { fetchSheetData } from '../services/api';
import { Users, Activity, Award, PlusCircle, BarChart2, CheckCircle2, RefreshCw } from 'lucide-react';

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

  // --- STATS CALCULATION WITH USEMEMO FOR OPTIMAL INP (~0ms) ---
  const stats = useMemo(() => {
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

    return {
      totalMuqarrib,
      totalSapi,
      totalDomba,
      sapiTambahan,
      dombaTambahan,
      totalTambahan,
      completeSapiGroups,
      incompleteSapiMembers,
      pahaCount,
      dagingCount,
      lainnyaCount,
      pahaPct,
      dagingPct,
      lainnyaPct
    };
  }, [sapiData, dombaData]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center no-print pb-4 border-b border-slate-200/50">
        <div>
          <h1 className="text-3xl font-black text-slate-800 font-display flex items-center gap-3 tracking-tight">
            <Users className="text-qurban-600 w-9 h-9" />
            <span className="premium-gradient-text">Dashboard Analitik Qurban</span>
          </h1>
          <p className="text-slate-500 mt-1.5 font-medium text-sm">
            Panitia Masjid Sabilul Fitroh &middot; Real-time Insights 1446 H
          </p>
        </div>
        <button 
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white border border-slate-200 text-slate-700 hover:text-qurban-700 font-semibold text-xs rounded-xl shadow-sm hover:shadow transition-all duration-300 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-32 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-qurban-600"></div>
          <span className="text-sm font-semibold text-slate-500">Memuat data dari Google Sheets...</span>
        </div>
      ) : (
        <div className="space-y-8 no-print animate-[fadeIn_0.5s_ease-out]">
          {/* Stat Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat 1: Total Muqarrib */}
            <div className="glass-card glass-card-hover p-6 flex items-center justify-between border-l-4 border-qurban-600">
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Total Muqarrib</p>
                <h3 className="text-3xl font-black text-slate-800 font-display mt-1.5">{stats.totalMuqarrib} <span className="text-sm font-medium text-slate-500">Orang</span></h3>
                <p className="text-slate-500 text-[11px] font-bold mt-1.5 bg-qurban-50/50 px-2 py-0.5 rounded-md inline-block">
                  {sapiData.length} Sapi &middot; {dombaData.length} Domba
                </p>
              </div>
              <div className="w-12 h-12 bg-qurban-50 rounded-xl flex items-center justify-center text-qurban-600 shadow-inner">
                <Users size={22} className="stroke-[2.5]" />
              </div>
            </div>

            {/* Stat 2: Total Hewan */}
            <div className="glass-card glass-card-hover p-6 flex items-center justify-between border-l-4 border-amber-500">
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Total Hewan Qurban</p>
                <h3 className="text-3xl font-black text-slate-800 font-display mt-1.5">{stats.totalSapi + stats.totalDomba} <span className="text-sm font-medium text-slate-500">Ekor</span></h3>
                <p className="text-slate-500 text-[11px] font-bold mt-1.5 bg-amber-50/50 px-2 py-0.5 rounded-md inline-block">
                  {stats.totalSapi} Kelompok Sapi &middot; {stats.totalDomba} Domba
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shadow-inner">
                <Activity size={22} className="stroke-[2.5]" />
              </div>
            </div>

            {/* Stat 3: Cow Group Fill status */}
            <div className="glass-card glass-card-hover p-6 flex items-center justify-between border-l-4 border-blue-500">
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Rombongan Sapi</p>
                <h3 className="text-3xl font-black text-slate-800 font-display mt-1.5">{stats.completeSapiGroups} <span className="text-sm font-medium text-slate-500">Penuh</span></h3>
                <p className="text-slate-500 text-[11px] font-bold mt-1.5 bg-blue-50/50 px-2 py-0.5 rounded-md inline-block">
                  {stats.incompleteSapiMembers > 0 ? `${stats.incompleteSapiMembers}/7 kelompok baru` : 'Semua kelompok penuh'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-inner">
                <Award size={22} className="stroke-[2.5]" />
              </div>
            </div>

            {/* Stat 4: Additional Orders */}
            <div className="glass-card glass-card-hover p-6 flex items-center justify-between border-l-4 border-purple-500">
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Paket Tambahan</p>
                <h3 className="text-3xl font-black text-slate-800 font-display mt-1.5">{stats.totalTambahan} <span className="text-sm font-medium text-slate-500">Paket</span></h3>
                <p className="text-slate-500 text-[11px] font-bold mt-1.5 bg-purple-50/50 px-2 py-0.5 rounded-md inline-block">
                  Sapi ({stats.sapiTambahan}) &middot; Domba ({stats.dombaTambahan})
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shadow-inner">
                <PlusCircle size={22} className="stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Analytics Visual Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Panel 1: Meat Order Distribution Analysis */}
            <div className="glass-card p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart2 className="text-qurban-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-slate-850 font-display">Analisis Distribusi Paket Daging</h3>
                </div>
                <p className="text-xs text-slate-400 font-medium mb-6">
                  Distribusi persentase pesanan daging berdasarkan tipe potongan utama.
                </p>
              </div>
              
              <div className="space-y-6">
                {/* Daging Kiloan */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                    <span className="tracking-wide">PAKET DAGING UTAMA (KILOAN)</span>
                    <span className="font-display font-black text-slate-850">{stats.dagingCount} Pkt ({stats.dagingPct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-[1px]">
                    <div className="bg-gradient-to-r from-qurban-600 to-qurban-400 h-full rounded-full transition-all duration-500" style={{ width: `${stats.dagingPct}%` }}></div>
                  </div>
                </div>

                {/* Bagian Paha */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                    <span className="tracking-wide">PAHA (DEPAN/BELAKANG/KANAN)</span>
                    <span className="font-display font-black text-slate-850">{stats.pahaCount} Pkt ({stats.pahaPct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-[1px]">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full transition-all duration-500" style={{ width: `${stats.pahaPct}%` }}></div>
                  </div>
                </div>

                {/* Lainnya */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                    <span className="tracking-wide">LAINNYA (SIKI, BKS, JEROAN)</span>
                    <span className="font-display font-black text-slate-850">{stats.lainnyaCount} Pkt ({stats.lainnyaPct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-[1px]">
                    <div className="bg-gradient-to-r from-purple-500 to-violet-400 h-full rounded-full transition-all duration-500" style={{ width: `${stats.lainnyaPct}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 2: Sapi Rombongan fill rate status */}
            <div className="glass-card p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="text-qurban-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-slate-850 font-display">Status Kelompok Sapi (7 Qaribun per Sapi)</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
                  Tiap 1 Ekor Sapi harus dipenuhi oleh tepat 7 orang muqarrib agar kelompok sah dicetak.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[220px] overflow-y-auto pr-1">
                {Array.from({ length: stats.totalSapi }).map((_, idx) => {
                  const groupNum = idx + 1;
                  const isLast = groupNum === stats.totalSapi;
                  const members = (isLast && stats.incompleteSapiMembers > 0) ? stats.incompleteSapiMembers : 7;
                  const pct = Math.round((members / 7) * 100);

                  return (
                    <div key={idx} className="border border-slate-200/50 rounded-2xl p-4 bg-slate-50/60 flex flex-col items-center justify-between text-center transition-all duration-300 hover:border-qurban-200 hover:bg-white shadow-sm">
                      <div className="font-display font-bold text-[10px] text-slate-400 tracking-widest uppercase">SAPI {groupNum}</div>
                      <div className="text-2xl font-black font-display text-slate-850 my-1">{members} / 7</div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-qurban-600' : 'bg-blue-500 animate-pulse'}`} 
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <span className={`text-[8px] font-black tracking-widest mt-2.5 uppercase px-2 py-0.5 rounded-full ${
                        pct === 100 ? 'bg-qurban-100 text-qurban-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {pct === 100 ? 'Lengkap' : 'Kurang'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;

