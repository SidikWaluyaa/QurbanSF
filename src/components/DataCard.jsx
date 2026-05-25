import React from 'react';

const DataCard = ({ title, data = [], type }) => {
  return (
    <div className="glass-card p-6 flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <span className="px-3 py-1 bg-qurban-100 text-qurban-700 text-sm font-semibold rounded-full shadow-sm">
          {data.length} Orang
        </span>
      </div>
      
      <div className="flex-1 overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white bg-opacity-40">
        <table className="w-full text-left text-sm text-slate-600 min-w-[800px] border-collapse">
          <thead className="bg-slate-50 text-slate-700 font-semibold sticky top-0 border-b border-slate-200">
            <tr>
              <th className="p-4 w-20 text-center">No. Urut</th>
              {type === 'sapi' ? (
                <th className="p-4 w-32">Hewan</th>
              ) : (
                <th className="p-4 w-32">No. Domba</th>
              )}
              <th className="p-4 w-64">Nama Lengkap Muqorrib</th>
              <th className="p-4 w-40">Nama Pendek</th>
              <th className="p-4 w-52">Alamat</th>
              <th className="p-4 w-40">Pesanan Utama</th>
              <th className="p-4 w-40">Pesanan Tambahan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={type === 'sapi' ? 7 : 7} className="p-8 text-center text-slate-400 italic">
                  Belum ada data muqorrib
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 text-center font-bold text-slate-400 text-xs">{row.NO}</td>
                  {type === 'sapi' ? (
                    <td className="p-4 font-bold text-qurban-700 uppercase tracking-wide text-xs">{row.HEWAN_QURBAN}</td>
                  ) : (
                    <td className="p-4 font-bold text-qurban-700 uppercase tracking-wide text-xs">DOMBA NO. {row.NO}</td>
                  )}
                  <td className="p-4 font-semibold text-slate-900 uppercase tracking-wide">{row.NAMA_MUQORRIB}</td>
                  <td className="p-4 uppercase text-slate-500 font-medium">{row.NAMA_PENDEK || '-'}</td>
                  <td className="p-4 uppercase text-slate-500 text-xs leading-relaxed max-w-[200px] truncate" title={row.ALAMAT}>{row.ALAMAT || '-'}</td>
                  <td className="p-4 font-semibold text-slate-800 uppercase tracking-wide text-xs">{row.PESANAN}</td>
                  <td className="p-4 text-slate-500 uppercase text-xs font-medium">{row.PESANAN_TAMBAHAN || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataCard;
