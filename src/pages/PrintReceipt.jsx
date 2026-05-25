import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { fetchSheetData } from '../services/api';
import { Printer } from 'lucide-react';

const PrintReceipt = () => {
  const [sapiData, setSapiData] = useState([]);
  const [dombaData, setDombaData] = useState([]);
  const [activeTab, setActiveTab] = useState('sapi');
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const sapi = await fetchSheetData('Sapi');
      const domba = await fetchSheetData('Domba');
      
      const grouped = sapi.reduce((acc, curr) => {
        if (!acc[curr.HEWAN_QURBAN]) {
          acc[curr.HEWAN_QURBAN] = [];
        }
        acc[curr.HEWAN_QURBAN].push(curr);
        return acc;
      }, {});
      
      setSapiData(grouped);
      setDombaData(domba);
      setLoading(false);
    };
    loadData();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: activeTab === 'sapi' ? 'Tanda Terima Pesanan Sapi' : 'Tanda Terima Pesanan Domba',
  });

  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  if (loading) return <div className="p-8">Loading data...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6 no-print glass-card p-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Cetak Tanda Terima {activeTab === 'sapi' ? 'Sapi' : 'Domba'}
          </h2>
          <p className="text-slate-500 text-sm">Format cetak tanda terima tanda tangan untuk petugas</p>
        </div>
        <button onClick={handlePrint} className="bg-qurban-600 hover:bg-qurban-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-qurban-200 transition-all">
          <Printer size={18} />
          Cetak Dokumen
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 no-print">
        <button
          onClick={() => setActiveTab('sapi')}
          className={`px-5 py-2.5 font-bold rounded-xl transition-all ${
            activeTab === 'sapi'
              ? 'bg-qurban-600 text-white shadow-md shadow-qurban-100'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tanda Terima Sapi
        </button>
        <button
          onClick={() => setActiveTab('domba')}
          className={`px-5 py-2.5 font-bold rounded-xl transition-all ${
            activeTab === 'domba'
              ? 'bg-qurban-600 text-white shadow-md shadow-qurban-100'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tanda Terima Domba
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 overflow-auto">
        <div ref={printRef} className="print-container">
          {activeTab === 'sapi' ? (
            Object.keys(sapiData).map((sapiKey, index) => {
              const muqarribs = sapiData[sapiKey];
              return (
                <div key={index} className="break-after-page pt-8 first:pt-0">
                  <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <img src="/logo.png" className="w-16 h-16 object-contain" alt="Logo Masjid" />
                      <div className="text-left">
                        <div className="font-bold text-xs">Panitia Idul Adha 1446 H / 2025 M</div>
                        <div className="font-black text-sm uppercase">DKM SABILUL FITROH</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <h2 className="text-xs font-black uppercase tracking-wide leading-none">Tanda Terima Pesanan</h2>
                      <h4 className="text-lg font-black uppercase text-slate-800 leading-none mt-1.5">SAPI ({sapiKey})</h4>
                    </div>
                  </div>
                  
                  <div>
                    <table className="w-full border-collapse border-2 border-black text-sm">
                      <thead>
                        <tr>
                          <th className="border-2 border-black p-3 w-12 text-center">No</th>
                          <th className="border-2 border-black p-3 text-center">NAMA QARIBUN</th>
                          <th className="border-2 border-black p-3 text-center w-48">PESANAN</th>
                          <th className="border-2 border-black p-3 text-center w-48">ALAMAT</th>
                          <th className="border-2 border-black p-3 text-center w-32">Tanda Tangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {muqarribs.map((m, mIdx) => (
                          <tr key={mIdx}>
                            <td className="border border-black p-3 text-center font-medium">{m.NO || (mIdx + 1)}</td>
                            <td className="border border-black p-3 uppercase font-semibold">{m.NAMA_MUQORRIB}</td>
                            <td className="border border-black p-3 text-center font-medium uppercase">{m.PESANAN}</td>
                            <td className="border border-black p-3 text-xs uppercase">{m.ALAMAT}</td>
                            <td className="border border-black p-3"></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-between mt-12 px-12">
                    <div className="text-center">
                      <p className="font-bold mb-20 text-base">Ketua PANITIA</p>
                      <p className="font-bold text-base underline decoration-2 underline-offset-4">Ihsanudin Suhanda</p>
                    </div>
                    <div className="text-center flex flex-col justify-between">
                      <p className="font-bold text-base">PETUGAS</p>
                      <div className="border-b-2 border-black w-48 mt-20"></div>
                      <p className="text-[10px] text-right italic mt-2 text-slate-500">Tertib Administrasi 2025 - Panitia</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            chunkArray(dombaData, 8).map((chunk, index) => (
              <div key={index} className="break-after-page pt-8 first:pt-0">
                  <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <img src="/logo.png" className="w-16 h-16 object-contain" alt="Logo Masjid" />
                      <div className="text-left">
                        <div className="font-bold text-xs">Panitia Idul Adha 1446 H / 2025 M</div>
                        <div className="font-black text-sm uppercase">DKM SABILUL FITROH</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <h2 className="text-xs font-black uppercase tracking-wide leading-none">Tanda Terima Pesanan</h2>
                      <h4 className="text-lg font-black uppercase text-slate-800 leading-none mt-1.5">DOMBA (Halaman {index + 1})</h4>
                    </div>
                  </div>
                
                <div>
                  <table className="w-full border-collapse border-2 border-black text-sm">
                    <thead>
                      <tr>
                        <th className="border-2 border-black p-3 w-12 text-center">No</th>
                        <th className="border-2 border-black p-3 text-center">NAMA QARIBUN</th>
                        <th className="border-2 border-black p-3 text-center w-48">PESANAN</th>
                        <th className="border-2 border-black p-3 text-center w-48">ALAMAT</th>
                        <th className="border-2 border-black p-3 text-center w-32">Tanda Tangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chunk.map((m, mIdx) => (
                        <tr key={mIdx}>
                          <td className="border border-black p-3 text-center font-medium">{m.NO || (index * 8 + mIdx + 1)}</td>
                          <td className="border border-black p-3 uppercase font-semibold">{m.NAMA_MUQORRIB}</td>
                          <td className="border border-black p-3 text-center font-medium uppercase">{m.PESANAN}</td>
                          <td className="border border-black p-3 text-xs uppercase">{m.ALAMAT}</td>
                          <td className="border border-black p-3"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between mt-12 px-12">
                  <div className="text-center">
                    <p className="font-bold mb-20 text-base">Ketua PANITIA</p>
                    <p className="font-bold text-base underline decoration-2 underline-offset-4">Ihsanudin Suhanda</p>
                  </div>
                  <div className="text-center flex flex-col justify-between">
                    <p className="font-bold text-base">PETUGAS</p>
                    <div className="border-b-2 border-black w-48 mt-20"></div>
                    <p className="text-[10px] text-right italic mt-2 text-slate-500">Tertib Administrasi 2025 - Panitia</p>
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
