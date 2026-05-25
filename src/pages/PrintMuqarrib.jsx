import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { fetchSheetData } from '../services/api';
import { Printer, RefreshCw } from 'lucide-react';

const PrintMuqarrib = () => {
  const [sapiRaw, setSapiRaw] = useState([]);
  const [dombaRaw, setDombaRaw] = useState([]);
  const [activeTab, setActiveTab] = useState('sapi');
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  const loadData = async () => {
    setLoading(true);
    const sapi = await fetchSheetData('Sapi');
    const domba = await fetchSheetData('Domba');
    setSapiRaw(sapi);
    setDombaRaw(domba);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- USEMEMO FOR INSTANT DATA GROUPING (INP ~0ms) ---
  const { sapiData, dombaData } = useMemo(() => {
    const groupedSapi = sapiRaw.reduce((acc, curr) => {
      if (!acc[curr.HEWAN_QURBAN]) {
        acc[curr.HEWAN_QURBAN] = [];
      }
      acc[curr.HEWAN_QURBAN].push(curr);
      return acc;
    }, {});
    return {
      sapiData: groupedSapi,
      dombaData: dombaRaw
    };
  }, [sapiRaw, dombaRaw]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: activeTab === 'sapi' ? 'Daftar Para Muqarrib Sapi' : 'Daftar Para Muqarrib Domba',
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-qurban-600"></div>
        <span className="text-sm font-semibold text-slate-500">Memuat data daftar muqarrib...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center no-print glass-card p-6 bg-white">
        <div>
          <h2 className="text-2xl font-black text-slate-800 font-display tracking-tight">
            Cetak Daftar Muqarrib
          </h2>
          <p className="text-slate-550 text-xs font-medium mt-1">Daftar nama resmi muqarrib {activeTab === 'sapi' ? 'Sapi' : 'Domba'} SabilulFitroh</p>
        </div>
        <button 
          onClick={handlePrint} 
          className="bg-gradient-to-r from-qurban-600 to-qurban-500 hover:from-qurban-700 hover:to-qurban-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-qurban-200 transition-all active:scale-95 duration-200"
        >
          <Printer size={16} className="stroke-[2.5]" />
          Cetak Dokumen
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 no-print">
        <button
          onClick={() => setActiveTab('sapi')}
          className={`px-5 py-2.5 font-bold text-sm rounded-xl transition-all duration-300 ${
            activeTab === 'sapi'
              ? 'bg-qurban-600 text-white shadow-md shadow-qurban-100'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Daftar Muqarrib Sapi
        </button>
        <button
          onClick={() => setActiveTab('domba')}
          className={`px-5 py-2.5 font-bold text-sm rounded-xl transition-all duration-300 ${
            activeTab === 'domba'
              ? 'bg-qurban-600 text-white shadow-md shadow-qurban-100'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Daftar Muqarrib Domba
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/50 overflow-auto">
        <div ref={printRef} className="print-container">
          <PrintHeader title={activeTab === 'sapi' ? "DAFTAR PARA MUQARRIB SAPI" : "DAFTAR PARA MUQARRIB DOMBA"} />
          
          {activeTab === 'sapi' ? (
            <div className="space-y-6 mt-6">
              {Object.keys(sapiData).map((sapiKey, index) => {
                const muqarribs = sapiData[sapiKey];
                return (
                  <div key={index} className="avoid-page-break border border-slate-200 rounded-xl p-4 bg-slate-50/30 mb-4 print:border-none print:p-0 print:bg-transparent">
                    <h4 className="font-display font-black text-base uppercase text-slate-800 bg-qurban-50 border border-qurban-200/50 px-3 py-1.5 rounded-lg inline-block mb-3 print:border-2 print:border-black print:bg-slate-100 print:text-black">
                      {sapiKey}
                    </h4>
                    <table className="w-full border-collapse border-2 border-black text-sm">
                      <thead>
                        <tr>
                          <th className="border-2 border-black p-2 text-center w-16 bg-slate-50 text-slate-700 font-bold uppercase text-xs">No</th>
                          <th className="border-2 border-black p-2 text-left bg-slate-50 text-slate-700 font-bold uppercase text-xs">Nama Muqorrib</th>
                        </tr>
                      </thead>
                      <tbody>
                        {muqarribs.map((m, mIdx) => (
                          <tr key={mIdx} className="avoid-page-break-row hover:bg-slate-50/50 transition-colors">
                            <td className="border border-black p-2.5 text-center font-bold text-slate-500">{m.NO || (mIdx + 1)}</td>
                            <td className="border border-black p-2.5 pl-4 uppercase font-semibold text-slate-900">{m.NAMA_MUQORRIB}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="avoid-page-break mt-6">
              <table className="w-full border-collapse border-2 border-black text-sm">
                <thead>
                  <tr>
                    <th className="border-2 border-black p-2.5 text-center w-16 bg-slate-50 text-slate-700 font-bold uppercase text-xs">NO</th>
                    <th className="border-2 border-black p-2.5 text-center w-40 bg-slate-50 text-slate-700 font-bold uppercase text-xs">NO. DOMBA</th>
                    <th className="border-2 border-black p-2.5 text-left bg-slate-50 text-slate-700 font-bold uppercase text-xs">NAMA MUQORRIB</th>
                  </tr>
                </thead>
                <tbody>
                  {dombaData.map((m, idx) => (
                    <tr key={idx} className="avoid-page-break-row hover:bg-slate-50/50 transition-colors">
                      <td className="border border-black p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="border border-black p-2.5 text-center font-bold text-amber-700">DOMBA NO. {m.NO || idx + 1}</td>
                      <td className="border border-black p-2.5 pl-4 uppercase font-semibold text-slate-900">{m.NAMA_MUQORRIB}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const PrintHeader = ({ title }) => (
  <div className="border-b-4 border-black pb-4 mb-4">
    <div className="flex items-center gap-4">
      <img src="/logo.png" className="w-20 h-20 object-contain shrink-0" alt="Logo Masjid" />
      <div>
        <div className="font-bold text-xs uppercase tracking-wider text-slate-500">Panitia Idul Adha 1446 H / 2025 M</div>
        <div className="font-black text-2xl uppercase tracking-wider leading-none mt-1 text-slate-900 font-display">DKM SABILUL FITROH</div>
        <div className="text-xs text-slate-400 mt-1 italic">Jl. Sriwijaya RW.10 Kel. Cigereleng - Kec. Regol, Kota Bandung</div>
      </div>
    </div>
    <div className="w-full h-1 bg-black mt-3"></div>
    <div className="w-full h-[2px] bg-black mt-1"></div>
    <h1 className="text-2xl font-black text-center mt-6 tracking-wide underline uppercase font-display">{title}</h1>
  </div>
);

export default PrintMuqarrib;

