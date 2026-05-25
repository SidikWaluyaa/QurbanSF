import { NavLink } from "react-router-dom";
import { Users, PawPrint, Beef, PlusCircle, FileText, Printer, Tag, Receipt, Sword } from "lucide-react";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 p-2 rounded-lg transition-colors ${
    isActive
      ? "bg-qurban-100 text-qurban-800"
      : "text-slate-600 hover:bg-qurban-50 hover:text-qurban-800"
  }`;

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white bg-opacity-70 backdrop-blur-lg border-r border-slate-200 p-4 sticky top-0 overflow-y-auto">
      <div className="flex flex-col items-center mb-6 pb-6 border-b border-slate-200">
        <img src="/logo.png" className="w-20 h-20 object-contain mb-3" alt="Logo DKM" />
        <h2 className="font-bold text-center text-slate-800 text-sm tracking-wide leading-tight">DKM SABILUL FITROH</h2>
        <p className="text-[10px] text-center text-slate-500 uppercase font-bold mt-1">Panitia Qurban 1446 H</p>
      </div>
      <nav className="flex flex-col gap-2">
        <NavLink to="/" className={linkClass} end>
          <Users className="w-5 h-5" />
          Dashboard
        </NavLink>

        <div className="mt-4 text-sm font-medium text-slate-500 uppercase">
          Data Hewan
        </div>

        <NavLink to="/sapi" className={linkClass}>
          <Beef className="w-5 h-5" />
          Data Sapi
        </NavLink>
        <NavLink to="/sapi/add" className={linkClass}>
          <PlusCircle className="w-5 h-5" />
          Tambah Sapi
        </NavLink>

        <NavLink to="/domba" className={linkClass}>
          <PawPrint className="w-5 h-5" />
          Data Domba
        </NavLink>
        <NavLink to="/domba/add" className={linkClass}>
          <PlusCircle className="w-5 h-5" />
          Tambah Domba
        </NavLink>

        <div className="mt-4 text-sm font-medium text-slate-500 uppercase">
          Cetak Dokumen
        </div>

        <NavLink to="/print/muqarrib" className={linkClass}>
          <FileText className="w-5 h-5" />
          Daftar Muqarrib
        </NavLink>
        <NavLink to="/print/label" className={linkClass}>
          <Tag className="w-5 h-5" />
          Label Pesanan
        </NavLink>
        <NavLink to="/print/receipt" className={linkClass}>
          <Receipt className="w-5 h-5" />
          Tanda Terima
        </NavLink>
        <NavLink to="/print/slaughter" className={linkClass}>
          <Sword className="w-5 h-5" />
          Data Sembelih
        </NavLink>
      </nav>
    </aside>
  );
}
