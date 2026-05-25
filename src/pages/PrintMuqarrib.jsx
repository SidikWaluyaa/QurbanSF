import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { fetchSheetData } from '../services/api';
import { Printer } from 'lucide-react';

const PrintMuqarrib = () => {
  const [sapiData, setSapiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const sapi = await fetchSheetData('Sapi');
      
      // Group sapi by HEWAN_QURBAN
      const grouped = sapi.reduce((acc, curr) => {
        if (!acc[curr.HEWAN_QURBAN]) {
          acc[curr.HEWAN_QURBAN] = [];
        }
        acc[curr.HEWAN_QURBAN].push(curr);
        return acc;
      }, {});
      
      setSapiData(grouped);
      setLoading(false);
    };
    loadData();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Daftar Para Muqarrib Sapi',
  });

  if (loading) return <div className="p-8">Loading data...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8 no-print glass-card p-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Cetak Daftar Muqarrib Sapi</h2>
          <p className="text-slate-500 text-sm">Sesuai format cetak Gambar 1</p>
        </div>
        <button onClick={handlePrint} className="bg-qurban-600 hover:bg-qurban-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-qurban-200 transition-all">
          <Printer size={18} />
          Cetak Dokumen
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 overflow-auto">
        <div ref={printRef} className="print-container">
          <PrintHeader title="DAFTAR PARA MUQARRIB SAPI" />
          
          <table className="w-full border-collapse border-2 border-black mt-4 text-sm">
            <thead>
              <tr>
                <th className="border-2 border-black p-2 text-center w-1/3" colSpan="2">HEWAN QURBAN</th>
                <th className="border-2 border-black p-2 text-center w-2/3">NAMA MUQORRIB</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(sapiData).map((sapiKey, index) => {
                const muqarribs = sapiData[sapiKey];
                return (
                  <React.Fragment key={index}>
                    {muqarribs.map((m, mIdx) => (
                      <tr key={mIdx}>
                        {mIdx === 0 && (
                          <td className="border border-black p-2 font-bold text-center text-lg uppercase" rowSpan={muqarribs.length}>
                            {sapiKey}
                          </td>
                        )}
                        <td className="border border-black p-2 text-center w-12 font-medium">{m.NO || (mIdx + 1)}</td>
                        <td className="border border-black p-2 pl-4 uppercase font-medium">{m.NAMA_MUQORRIB}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const PrintHeader = ({ title }) => (
  <div className="border-b-4 border-black pb-4 mb-4 print-only-header">
    <div className="flex items-center gap-4">
      <img src="/logo.png" className="w-20 h-20 object-contain shrink-0" alt="Logo Masjid" />
      <div>
        <div className="font-bold text-lg leading-tight">Panitia Idul Adha 1446 H./2025 M.</div>
        <div className="font-black text-2xl uppercase tracking-wider leading-tight">DKM SABILUL FITROH</div>
        <div className="text-sm italic">Jl. Sriwijaya RW.10 Kel. Cigereleng-Kec. Regol Kota Bandung</div>
      </div>
    </div>
    <div className="w-full h-1 bg-black mt-2"></div>
    <div className="w-full h-0.5 bg-black mt-1"></div>
    <h1 className="text-3xl font-black text-center mt-6 tracking-wide underline uppercase">{title}</h1>
  </div>
);

export default PrintMuqarrib;
