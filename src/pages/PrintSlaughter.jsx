import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { fetchSheetData } from '../services/api';
import { Printer } from 'lucide-react';
import { PrintHeader } from './PrintMuqarrib';

const PrintSlaughter = () => {
  const [sapiData, setSapiData] = useState({});
  const [dombaData, setDombaData] = useState([]);
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
    documentTitle: 'Daftar Sembelih Qurban',
  });

  if (loading) return <div className="p-8">Loading data...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8 no-print glass-card p-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Cetak Daftar Sembelih</h2>
          <p className="text-slate-500 text-sm">Panduan petugas sembelih (Sapi & Domba)</p>
        </div>
        <button onClick={handlePrint} className="bg-qurban-600 hover:bg-qurban-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-qurban-200 transition-all">
          <Printer size={18} />
          Cetak Dokumen
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 overflow-auto">
        <div ref={printRef} className="print-container">
          <PrintHeader title="DAFTAR SEMBELIH HEWAN QURBAN" />
          
          <h3 className="text-xl font-bold mt-8 mb-4 underline">A. DAFTAR SEMBELIH SAPI</h3>
          <table className="w-full border-collapse border-2 border-black text-sm">
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

          <div className="page-break-before mt-12"></div>

          <h3 className="text-xl font-bold mt-8 mb-4 underline">B. DAFTAR SEMBELIH DOMBA</h3>
          <table className="w-full border-collapse border-2 border-black text-sm">
            <thead>
              <tr>
                <th className="border-2 border-black p-2 text-center w-16">NO</th>
                <th className="border-2 border-black p-2 text-center">NAMA MUQORRIB</th>
                <th className="border-2 border-black p-2 text-center w-48">PESANAN</th>
              </tr>
            </thead>
            <tbody>
              {dombaData.map((m, idx) => (
                <tr key={idx}>
                  <td className="border border-black p-2 text-center font-medium">{idx + 1}</td>
                  <td className="border border-black p-2 pl-4 uppercase font-medium">{m.NAMA_MUQORRIB}</td>
                  <td className="border border-black p-2 text-center uppercase text-xs">{m.PESANAN}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrintSlaughter;
