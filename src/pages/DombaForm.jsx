import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createRow, updateRow, fetchSheetData } from '../services/api';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function DombaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    'DOMBA NO': '',
    NO: '',
    'NAMA LENGKAP MUQORRIB': '',
    'NAMA PENDEK': '',
    ALAMAT: '',
    PESANAN: '',
    'PESANAN TAMBAHAN': '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      fetchSheetData('Domba').then((data) => {
        const found = data.find((row) => String(row.NO) === String(id));
        if (found) {
          setForm({
            'DOMBA NO': found.NO || '',
            NO: found.NO || '',
            'NAMA LENGKAP MUQORRIB': found.NAMA_MUQORRIB || '',
            'NAMA PENDEK': found.NAMA_PENDEK || '',
            ALAMAT: found.ALAMAT || '',
            PESANAN: found.PESANAN || '',
            'PESANAN TAMBAHAN': found.PESANAN_TAMBAHAN || '',
          });
        }
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await updateRow('Domba', form);
      } else {
        await createRow('Domba', form);
      }
      navigate('/');
    } catch (err) {
      console.error('Error saving:', err);
      alert('Gagal menyimpan data. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-qurban-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-qurban-700 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Kembali
      </button>

      <div className="glass-card p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          {isEdit ? 'Edit Data Domba' : 'Tambah Data Domba'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                No. Domba
              </label>
              <input
                type="text"
                name="DOMBA NO"
                value={form['DOMBA NO']}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 focus:ring-2 focus:ring-qurban-400 focus:border-qurban-400 outline-none transition-all"
                placeholder="Contoh: 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                No. Urut
              </label>
              <input
                type="text"
                name="NO"
                value={form.NO}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 focus:ring-2 focus:ring-qurban-400 focus:border-qurban-400 outline-none transition-all"
                placeholder="Nomor urut"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nama Lengkap Muqorrib
            </label>
            <input
              type="text"
              name="NAMA LENGKAP MUQORRIB"
              value={form['NAMA LENGKAP MUQORRIB']}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 focus:ring-2 focus:ring-qurban-400 focus:border-qurban-400 outline-none transition-all"
              placeholder="Nama lengkap"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nama Pendek
              </label>
              <input
                type="text"
                name="NAMA PENDEK"
                value={form['NAMA PENDEK']}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 focus:ring-2 focus:ring-qurban-400 focus:border-qurban-400 outline-none transition-all"
                placeholder="Nama pendek / panggilan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Alamat
              </label>
              <input
                type="text"
                name="ALAMAT"
                value={form.ALAMAT}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 focus:ring-2 focus:ring-qurban-400 focus:border-qurban-400 outline-none transition-all"
                placeholder="Alamat"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Pesanan
              </label>
              <input
                type="text"
                name="PESANAN"
                value={form.PESANAN}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 focus:ring-2 focus:ring-qurban-400 focus:border-qurban-400 outline-none transition-all"
                placeholder="Pesanan daging"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Pesanan Tambahan
              </label>
              <input
                type="text"
                name="PESANAN TAMBAHAN"
                value={form['PESANAN TAMBAHAN']}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 focus:ring-2 focus:ring-qurban-400 focus:border-qurban-400 outline-none transition-all"
                placeholder="Pesanan tambahan (opsional)"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-qurban-600 text-white font-semibold rounded-xl hover:bg-qurban-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-qurban-200"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {saving ? 'Menyimpan...' : isEdit ? 'Update Data' : 'Simpan Data'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
