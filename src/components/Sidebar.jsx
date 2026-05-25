import { NavLink } from "react-router-dom";
import { Users, PawPrint, Beef, FileText, Tag, Receipt, Sword } from "lucide-react";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:translate-x-1 ${
    isActive
      ? "bg-gradient-to-r from-qurban-600 to-qurban-500 text-white shadow-md shadow-qurban-100"
      : "text-slate-600 hover:bg-qurban-50 hover:text-qurban-800"
  }`;

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white/75 backdrop-blur-md border-r border-slate-200/50 p-5 sticky top-0 overflow-y-auto flex flex-col justify-between no-print shrink-0">
      <div>
        <div className="flex flex-col items-center mb-8 pb-6 border-b border-slate-100">
          <div className="relative group cursor-pointer mb-2">
            <div className="absolute inset-0 bg-qurban-500 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <img src="/logo.png" className="w-20 h-20 object-contain relative z-10 transition-transform duration-300 group-hover:scale-105" alt="Logo DKM" />
          </div>
          <h2 className="font-display font-black text-center text-slate-800 text-base tracking-wide leading-tight mt-2">SABILUL FITROH</h2>
          <p className="text-[10px] text-center text-qurban-600 uppercase font-bold tracking-widest mt-1">Panitia Qurban 1446 H</p>
        </div>
        
        <nav className="flex flex-col gap-1.5">
          <NavLink to="/" className={linkClass} end>
            <Users className="w-5 h-5 shrink-0" />
            <span>Dashboard</span>
          </NavLink>

          <div className="mt-5 mb-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Data Hewan
          </div>

          <NavLink to="/sapi" className={linkClass}>
            <Beef className="w-5 h-5 shrink-0" />
            <span>Data Sapi</span>
          </NavLink>

          <NavLink to="/domba" className={linkClass}>
            <PawPrint className="w-5 h-5 shrink-0" />
            <span>Data Domba</span>
          </NavLink>

          <div className="mt-5 mb-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Cetak Dokumen
          </div>

          <NavLink to="/print/muqarrib" className={linkClass}>
            <FileText className="w-5 h-5 shrink-0" />
            <span>Daftar Muqarrib</span>
          </NavLink>
          <NavLink to="/print/label" className={linkClass}>
            <Tag className="w-5 h-5 shrink-0" />
            <span>Label Pesanan</span>
          </NavLink>
          <NavLink to="/print/receipt" className={linkClass}>
            <Receipt className="w-5 h-5 shrink-0" />
            <span>Tanda Terima</span>
          </NavLink>
          <NavLink to="/print/slaughter" className={linkClass}>
            <Sword className="w-5 h-5 shrink-0" />
            <span>Data Sembelih</span>
          </NavLink>
        </nav>
      </div>
      
      <div className="text-[10px] text-center text-slate-400 font-semibold pt-4 border-t border-slate-100">
        &copy; 2026 DKM Sabilul Fitroh
      </div>
    </aside>
  );
}

