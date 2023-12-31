import React from 'react'; // Import React
import './App.css';
import { BrowserRouter, Routes, Route , Navigate} from 'react-router-dom'; // Import components from react-router-dom
import PageBerita from './page/PageBerita';
import PagePengumuman from './page/PagePengumuman';
import AdminBerita from './page/AdminBerita';
import AdminPengumuman from './page/AdminPengumuman';
import PageLogin from './page/PageLogin';
import PageMain from './page/main'; 
import AdminDashboard from './page/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<PageMain/>} />
        <Route path="/login" element={<PageLogin/>} />
        <Route path="/berita" element={<PageBerita/>} />
        <Route path="/pengumuman" element={<PagePengumuman/>} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/admin/berita" element={<AdminBerita/>} />
        <Route path="/admin/pengumuman" element={<AdminPengumuman/>} />
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;