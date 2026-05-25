import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Loader2 } from 'lucide-react';
import { deleteRow } from '../services/api';

const DataCard = ({ title, data = [], type, onRefresh }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    setDeletingId(id);
    try {
      const sheetName = type === 'sapi' ? 'Sapi' : 'Domba';
      const res = await deleteRow(sheetName, id);
      if (res.status === 'success' || res.deleted) {
        if (onRefresh) onRefresh();
      } else {
        alert('Gagal menghapus data: ' + (res.message || 'Error tidak diketahui'));
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus data. Silakan coba lagi.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <span className="px-3 py-1 bg-qurban-100 text-qurban-700 text-sm font-semibold rounded-full shadow-sm">
          {data.length} Orang
        </span>
      </div>
      
      <div className="flex-1 overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white bg-opacity-40">
        <table className="w-full text-left text-sm text-slate-600 min-w-[900px] border-collapse">
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
              <th className="p-4 w-24 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={type === 'sapi' ? 8 : 8} className="p-8 text-center text-slate-400 italic">
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
                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center gap-1.5">
                      <Link
                        to={`/${type}/edit/${row.NO}`}
                        className="p-1.5 text-slate-400 hover:text-qurban-600 hover:bg-qurban-50 rounded-lg transition-all active:scale-95"
                        title="Edit Data"
                      >
                        <Edit2 size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(row.NO)}
                        disabled={deletingId === row.NO}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95 disabled:opacity-50"
                        title="Hapus Data"
                      >
                        {deletingId === row.NO ? (
                          <Loader2 size={15} className="animate-spin text-red-500" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
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
