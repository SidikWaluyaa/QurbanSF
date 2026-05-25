import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { fetchSheetData } from '../services/api';
import { Printer, RefreshCw } from 'lucide-react';

const PrintReceipt = () => {
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

  // --- USEMEMO FOR HEAVY STATS & CHUNKING (INP ~0ms) ---
  const { sapiData, dombaChunks } = useMemo(() => {
    const groupedSapi = sapiRaw.reduce((acc, curr) => {
      if (!acc[curr.HEWAN_QURBAN]) {
        acc[curr.HEWAN_QURBAN] = [];
      }
      acc[curr.HEWAN_QURBAN].push(curr);
      return acc;
    }, {});

    const chunkArray = (arr, size) => {
      return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
      );
    };

    return {
      sapiData: groupedSapi,
      dombaChunks: chunkArray(dombaRaw, 7) // 7 per page is highly safe to avoid print overflow
    };
  }, [sapiRaw, dombaRaw]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: activeTab === 'sapi' ? 'Tanda Terima Pesanan Sapi' : 'Tanda Terima Pesanan Domba',
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-qurban-600"></div>
        <span className="text-sm font-semibold text-slate-500">Memuat data cetak tanda terima...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center no-print glass-card p-6 bg-white">
        <div>
          <h2 className="text-2xl font-black text-slate-800 font-display tracking-tight">
            Cetak Tanda Terima
          </h2>
          <p className="text-slate-550 text-xs font-medium mt-1">Lembar tanda tangan tanda terima resmi DKM SabilulFitroh</p>
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
          Tanda Terima Sapi
        </button>
        <button
          onClick={() => setActiveTab('domba')}
          className={`px-5 py-2.5 font-bold text-sm rounded-xl transition-all duration-300 ${
            activeTab === 'domba'
              ? 'bg-qurban-600 text-white shadow-md shadow-qurban-100'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Tanda Terima Domba
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/50 overflow-auto">
        <div ref={printRef} className="print-container">
          {activeTab === 'sapi' ? (
            Object.keys(sapiData).map((sapiKey, index) => {
              const muqarribs = sapiData[sapiKey];
              return (
                <div key={index} className="break-after-page pt-6 first:pt-0">
                  <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <img src="/logo.png" className="w-16 h-16 object-contain" alt="Logo Masjid" />
                      <div className="text-left">
                        <div className="font-bold text-[10px] uppercase tracking-wider text-slate-500">Panitia Idul Adha 1446 H</div>
                        <div className="font-black text-base uppercase text-slate-900 font-display tracking-wide">DKM SABILUL FITROH</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <h2 className="text-[10px] font-black uppercase tracking-wider text-slate-400 leading-none">Tanda Terima Pesanan</h2>
                      <h4 className="text-base font-black uppercase text-slate-800 leading-none mt-1.5 font-display">{sapiKey}</h4>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <table className="w-full border-collapse border-2 border-black text-xs">
                      <thead>
                        <tr>
                          <th className="border-2 border-black p-2.5 w-12 text-center bg-slate-50 font-bold uppercase text-[10px]">No</th>
                          <th className="border-2 border-black p-2.5 text-left bg-slate-50 font-bold uppercase text-[10px]">NAMA QARIBUN</th>
                          <th className="border-2 border-black p-2.5 text-center w-40 bg-slate-50 font-bold uppercase text-[10px]">PESANAN</th>
                          <th className="border-2 border-black p-2.5 text-left w-48 bg-slate-50 font-bold uppercase text-[10px]">ALAMAT</th>
                          <th className="border-2 border-black p-2.5 text-center w-36 bg-slate-50 font-bold uppercase text-[10px]">Tanda Tangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {muqarribs.map((m, mIdx) => (
                          <tr key={mIdx} className="avoid-page-break-row">
                            <td className="border border-black p-2.5 text-center font-bold text-slate-500">{m.NO || (mIdx + 1)}</td>
                            <td className="border border-black p-2.5 uppercase font-semibold text-slate-900">{m.NAMA_MUQORRIB}</td>
                            <td className="border border-black p-2.5 text-center font-bold uppercase text-slate-800">{m.PESANAN || '-'}</td>
                            <td className="border border-black p-2.5 text-[10px] uppercase text-slate-600">{m.ALAMAT || '-'}</td>
                            <td className="border border-black p-2.5 text-slate-300 relative text-left pl-3 text-[10px]">
                              {mIdx + 1}....................
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-between mt-8 px-12 avoid-page-break">
                    <div className="text-center">
                      <p className="font-bold text-xs uppercase tracking-wide mb-16 text-slate-600">Ketua Panitia</p>
                      <p className="font-black text-xs underline decoration-2 underline-offset-4 text-slate-900 uppercase">Ihsanudin Suhanda</p>
                    </div>
                    <div className="text-center flex flex-col justify-between">
                      <p className="font-bold text-xs uppercase tracking-wide text-slate-600">Petugas Lapangan</p>
                      <div className="border-b-2 border-black w-40 mt-16"></div>
                      <p className="text-[9px] text-right italic mt-2 text-slate-400 font-medium">Masjid Sabilul Fitroh 2026</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            dombaChunks.map((chunk, index) => (
              <div key={index} className="break-after-page pt-6 first:pt-0">
                <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" className="w-16 h-16 object-contain" alt="Logo Masjid" />
                    <div className="text-left">
                      <div className="font-bold text-[10px] uppercase tracking-wider text-slate-500">Panitia Idul Adha 1446 H</div>
                      <div className="font-black text-base uppercase text-slate-900 font-display tracking-wide">DKM SABILUL FITROH</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-[10px] font-black uppercase tracking-wider text-slate-400 leading-none">Tanda Terima Pesanan</h2>
                    <h4 className="text-base font-black uppercase text-slate-800 leading-none mt-1.5 font-display">DOMBA (Hlm {index + 1})</h4>
                  </div>
                </div>
                
                <div className="mt-4">
                  <table className="w-full border-collapse border-2 border-black text-xs">
                    <thead>
                      <tr>
                        <th className="border-2 border-black p-2.5 w-12 text-center bg-slate-50 font-bold uppercase text-[10px]">No</th>
                        <th className="border-2 border-black p-2.5 text-left bg-slate-50 font-bold uppercase text-[10px]">NAMA QARIBUN</th>
                        <th className="border-2 border-black p-2.5 text-center w-40 bg-slate-50 font-bold uppercase text-[10px]">PESANAN</th>
                        <th className="border-2 border-black p-2.5 text-left w-48 bg-slate-50 font-bold uppercase text-[10px]">ALAMAT</th>
                        <th className="border-2 border-black p-2.5 text-center w-36 bg-slate-50 font-bold uppercase text-[10px]">Tanda Tangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chunk.map((m, mIdx) => {
                        const rowNo = index * 7 + mIdx + 1;
                        return (
                          <tr key={mIdx} className="avoid-page-break-row">
                            <td className="border border-black p-2.5 text-center font-bold text-slate-500">{m.NO || rowNo}</td>
                            <td className="border border-black p-2.5 uppercase font-semibold text-slate-900">{m.NAMA_MUQORRIB}</td>
                            <td className="border border-black p-2.5 text-center font-bold uppercase text-slate-800">{m.PESANAN || '-'}</td>
                            <td className="border border-black p-2.5 text-[10px] uppercase text-slate-600">{m.ALAMAT || '-'}</td>
                            <td className="border border-black p-2.5 text-slate-300 relative text-left pl-3 text-[10px]">
                              {mIdx + 1}....................
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between mt-8 px-12 avoid-page-break">
                  <div className="text-center">
                    <p className="font-bold text-xs uppercase tracking-wide mb-16 text-slate-600">Ketua Panitia</p>
                    <p className="font-black text-xs underline decoration-2 underline-offset-4 text-slate-900 uppercase">Ihsanudin Suhanda</p>
                  </div>
                  <div className="text-center flex flex-col justify-between">
                    <p className="font-bold text-xs uppercase tracking-wide text-slate-600">Petugas Lapangan</p>
                    <div className="border-b-2 border-black w-40 mt-16"></div>
                    <p className="text-[9px] text-right italic mt-2 text-slate-400 font-medium">Masjid Sabilul Fitroh 2026</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintReceipt;

