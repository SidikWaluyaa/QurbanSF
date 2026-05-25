import React from 'react';

const DataCard = ({ title, data = [], type }) => {
  return (
    <div className="glass-card p-6 flex flex-col h-full w-full bg-white/80">
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-black text-slate-800 font-display tracking-tight">{title}</h2>
        <span className="px-4 py-1.5 bg-gradient-to-r from-qurban-600 to-qurban-500 text-white text-xs font-black tracking-wider uppercase rounded-full shadow-sm">
          {data.length} Muqarrib
        </span>
      </div>
      
      <div className="flex-1 overflow-x-auto rounded-2xl border border-slate-200/50 shadow-sm bg-white/40">
        <table className="w-full text-left text-sm text-slate-650 min-w-[850px] border-collapse">
          <thead className="bg-slate-50/80 backdrop-blur-sm text-slate-700 font-bold sticky top-0 border-b border-slate-200/60 z-10">
            <tr>
              <th className="p-4 w-24 text-center font-display uppercase tracking-wider text-[11px] text-slate-400">No. Urut</th>
              {type === 'sapi' ? (
                <th className="p-4 w-36 font-display uppercase tracking-wider text-[11px] text-slate-500">Kelompok Sapi</th>
              ) : (
                <th className="p-4 w-36 font-display uppercase tracking-wider text-[11px] text-slate-500">Nomor Domba</th>
              )}
              <th className="p-4 w-72 font-display uppercase tracking-wider text-[11px] text-slate-500">Nama Lengkap Muqorrib</th>
              <th className="p-4 w-44 font-display uppercase tracking-wider text-[11px] text-slate-500">Nama Panggilan</th>
              <th className="p-4 w-60 font-display uppercase tracking-wider text-[11px] text-slate-500">Alamat</th>
              <th className="p-4 w-44 font-display uppercase tracking-wider text-[11px] text-slate-500 text-center">Pesanan Utama</th>
              <th className="p-4 w-44 font-display uppercase tracking-wider text-[11px] text-slate-500 text-center">Tambahan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/70">
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-400 font-medium italic">
                  Belum ada data muqorrib terdaftar.
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors duration-200">
                  <td className="p-4 text-center font-display font-black text-slate-400 text-xs">{row.NO}</td>
                  {type === 'sapi' ? (
                    <td className="p-4 font-display font-black text-qurban-700 uppercase tracking-wider text-[11px]">
                      <span className="bg-qurban-100/60 px-2.5 py-1 rounded-lg border border-qurban-200/50">
                        {row.HEWAN_QURBAN}
                      </span>
                    </td>
                  ) : (
                    <td className="p-4 font-display font-black text-amber-700 uppercase tracking-wider text-[11px]">
                      <span className="bg-amber-100/60 px-2.5 py-1 rounded-lg border border-amber-200/50">
                        DOMBA NO. {row.NO}
                      </span>
                    </td>
                  )}
                  <td className="p-4 font-semibold text-slate-850 uppercase tracking-wide text-xs leading-normal">{row.NAMA_MUQORRIB}</td>
                  <td className="p-4 uppercase text-slate-500 font-bold text-xs">{row.NAMA_PENDEK || '-'}</td>
                  <td className="p-4 uppercase text-slate-400 text-[10px] leading-relaxed max-w-[200px] truncate font-medium" title={row.ALAMAT}>
                    {row.ALAMAT || '-'}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-block bg-slate-100 text-slate-700 font-black text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-wider border border-slate-200/40">
                      {row.PESANAN || '-'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {row.PESANAN_TAMBAHAN && row.PESANAN_TAMBAHAN.trim() !== '' && row.PESANAN_TAMBAHAN !== '-' ? (
                      <span className="inline-block bg-purple-100 text-purple-700 font-black text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-wider border border-purple-200/40 animate-pulse">
                        {row.PESANAN_TAMBAHAN}
                      </span>
                    ) : (
                      <span className="text-slate-300 font-bold text-xs">-</span>
                    )}
                  </td>
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

