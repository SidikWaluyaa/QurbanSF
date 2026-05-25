import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import SapiForm from "./pages/SapiForm";
import DombaForm from "./pages/DombaForm";
import SapiList from "./pages/SapiList";
import DombaList from "./pages/DombaList";
import PrintMuqarrib from "./pages/PrintMuqarrib";
import PrintLabel from "./pages/PrintLabel";
import PrintReceipt from "./pages/PrintReceipt";
import PrintSlaughter from "./pages/PrintSlaughter";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />

          {/* Data Hewan */}
          <Route path="sapi" element={<SapiList />} />
          <Route path="sapi/add" element={<SapiForm />} />
          <Route path="sapi/edit/:id" element={<SapiForm />} />
          <Route path="domba/add" element={<DombaForm />} />
          <Route path="domba/edit/:id" element={<DombaForm />} />
          <Route path="domba" element={<DombaList />} />

          {/* Cetak Dokumen */}
          <Route path="print/muqarrib" element={<PrintMuqarrib />} />
          <Route path="print/label" element={<PrintLabel />} />
          <Route path="print/receipt" element={<PrintReceipt />} />
          <Route path="print/slaughter" element={<PrintSlaughter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
