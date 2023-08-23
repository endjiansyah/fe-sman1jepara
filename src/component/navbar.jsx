import React from 'react';
import logo from '/smansara.png';
import {baseapi, kunci} from '../env.js'
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isAdmin, currentPage }) {
  const navigate = useNavigate();

  const handleLogout =async () => {
    const confirmLogout = window.confirm('Apakah Anda yakin ingin logout?');
    if (confirmLogout) {
      try {
        const response = await fetch(baseapi+'logout', {
            method: 'GET',
            headers: {
                'apikey' : kunci,
                'authorization' : localStorage.getItem('token')

            }
        });

        const responseData = await response.json();
    
        if (responseData.status) {

          localStorage.removeItem('token');
          navigate('/login');

            // Reset the form after successful submission
        } else {
          console.log(responseData)
            console.error('Failed to send data to the server');
        }
      } catch (error) {
        console.error('Error sending data:', error);
      }
    }
  };
  return (
    <nav id="header" className="border-[primary]/10">
      <div className="container">
        <div className="image-box">
          <img src={logo} alt="logo SMAN 1 Jepara" />
        </div>

        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="hamburger"
          aria-controls="navbar-default"
          aria-expanded="false"
          onClick={() => {
            const navbar = document.getElementById('navbar-default');
            navbar.classList.toggle('hidden');
          }}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>

        <div id="navbar-default" className="hidden lg:block w-full">
          <div className="hidenisasi">
            {/* left */}
            <div className="menu-navigation">
              <ul>
                <li>
                  <Link
                    to={isAdmin ? '/admin' : '/'}
                    className={currentPage === 'home' ? 'active' : ''}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to={isAdmin ? '/admin/pengumuman' : '/pengumuman'}
                    className={currentPage === 'pengumuman' ? 'active' : ''}
                  >
                    Pengumuman
                  </Link>
                </li>
                <li>
                  <Link
                    to={isAdmin ? '/admin/berita' : '/berita'}
                    className={currentPage === 'berita' ? 'active' : ''}
                  >
                    Berita
                  </Link>
                </li>
              </ul>
            </div>

            {/* right */}
            <div className="menu-action">
              {isAdmin ? (
                <div className="button">
                  <button onClick={handleLogout}>Log out</button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
