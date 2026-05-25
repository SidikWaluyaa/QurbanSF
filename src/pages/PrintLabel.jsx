import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { fetchSheetData } from '../services/api';
import { Printer } from 'lucide-react';

const PrintLabel = () => {
  const [sapiData, setSapiData] = useState([]);
  const [dombaData, setDombaData] = useState([]);
  const [labelType, setLabelType] = useState('utama'); // 'utama' | 'tambahan'
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const sapi = await fetchSheetData('Sapi');
      const domba = await fetchSheetData('Domba');
      setSapiData(sapi);
      setDombaData(domba);
      setLoading(false);
    };
    loadData();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: labelType === 'utama' ? 'Label Pesanan Utama' : 'Label Pesanan Tambahan',
  });

  if (loading) return <div className="p-8">Loading data...</div>;

  // Combine both for labels
  const allData = [
    ...sapiData.map(item => ({ ...item, type: 'SAPI' })),
    ...dombaData.map(item => ({ ...item, type: 'DOMBA' }))
  ];

  // Filter based on selected label type
  const filteredData = allData.filter(item => {
    if (labelType === 'utama') return true;
    return item.PESANAN_TAMBAHAN && item.PESANAN_TAMBAHAN.trim() !== '' && item.PESANAN_TAMBAHAN !== '-';
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6 no-print glass-card p-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Cetak Label {labelType === 'utama' ? 'Pesanan Utama' : 'Pesanan Tambahan'}
          </h2>
          <p className="text-slate-500 text-sm">Label siap tempel untuk pembagian paket daging qurban</p>
        </div>
        <button onClick={handlePrint} className="bg-qurban-600 hover:bg-qurban-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-qurban-200 transition-all">
          <Printer size={18} />
          Cetak Label
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 no-print">
        <button
          onClick={() => setLabelType('utama')}
          className={`px-5 py-2.5 font-bold rounded-xl transition-all ${
            labelType === 'utama'
              ? 'bg-qurban-600 text-white shadow-md shadow-qurban-100'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Label Pesanan Utama
        </button>
        <button
          onClick={() => setLabelType('tambahan')}
          className={`px-5 py-2.5 font-bold rounded-xl transition-all ${
            labelType === 'tambahan'
              ? 'bg-qurban-600 text-white shadow-md shadow-qurban-100'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Label Pesanan Tambahan ({allData.filter(i => i.PESANAN_TAMBAHAN && i.PESANAN_TAMBAHAN.trim() !== '' && i.PESANAN_TAMBAHAN !== '-').length})
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 overflow-auto">
        <div ref={printRef} className="print-container">
          {filteredData.length === 0 ? (
            <div className="text-center py-12 text-slate-400 italic">
              Tidak ada data pesanan tambahan untuk dicetak.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map((item, index) => (
                <div
                  key={index}
                  className={`border-2 border-dashed p-4 rounded-xl flex flex-col justify-between break-inside-avoid relative overflow-hidden ${
                    labelType === 'utama'
                      ? 'border-slate-400 bg-white'
                      : 'border-amber-500 bg-amber-50 bg-opacity-30'
                  }`}
                  style={{ minHeight: '160px' }}
                >
                  {/* Watermark Logo Background */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.12] select-none">
                    <img src="/logo.png" className="w-28 h-28 object-contain" alt="Watermark" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-base leading-tight uppercase max-w-[70%] text-slate-900">
                        {item.NAMA_MUQORRIB}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          labelType === 'utama'
                            ? 'bg-slate-800 text-white'
                            : 'bg-amber-600 text-white shadow-sm'
                        }`}
                      >
                        {item.type} ({item.NO})
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase mb-2 line-clamp-2 leading-normal">
                      {item.ALAMAT}
                    </p>
                  </div>
                  <div
                    className={`mt-2 pt-2 border-t relative z-10 ${
                      labelType === 'utama' ? 'border-slate-200' : 'border-amber-200'
                    }`}
                  >
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center mb-0.5">
                      {labelType === 'utama' ? 'PESANAN UTAMA' : 'PESANAN TAMBAHAN'}
                    </div>
                    <p
                      className={`font-black text-lg text-center uppercase tracking-wide ${
                        labelType === 'utama' ? 'text-slate-900' : 'text-amber-700'
                      }`}
                    >
                      {labelType === 'utama' ? item.PESANAN : item.PESANAN_TAMBAHAN}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintLabel;
