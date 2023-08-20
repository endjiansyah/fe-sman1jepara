import React from 'react'; // Import React
import './App.css';
import { BrowserRouter, Routes, Route , Navigate} from 'react-router-dom'; // Import components from react-router-dom
import PageBerita from './page/PageBerita';
import PagePengumuman from './page/PagePengumuman';
import AdminBerita from './page/AdminBerita';
import AdminPengumuman from './page/AdminPengumuman';
import PageLogin from './page/PageLogin';

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/login" element={<PageLogin/>} />
        <Route path="/berita" element={<PageBerita/>} />
        <Route path="/pengumuman" element={<PagePengumuman/>} />
        <Route path="/admin/berita" element={<AdminBerita/>} />
        <Route path="/admin/pengumuman" element={<AdminPengumuman/>} />
        <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;