import '../App.css'
import React, {useState, useEffect} from 'react'
import {baseapi, kunci} from '../env.js'
import { useNavigate } from 'react-router-dom';
import Navbar from '../component/navbar';
import spinnerLoading from '../component/spinnerLoading'

function PageLogin() {
    const [pageLoading, setPageLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const[alerts, setAlerts] = useState({
        flogin : false
    })
    const [form, setForm] = useState({
        username : '',
        password : ''
    });
    const navigateTo = useNavigate();

    useEffect(() => {
        cekLogin();
    }, []);

    const cekLogin = async () => {
        setPageLoading(true)
        if(localStorage.getItem('token')){
            try {
                const response = await fetch(baseapi+'me',{
                    headers: {
                        'apikey' : kunci,
                        'authorization' : localStorage.getItem('token')
                    },
                });
                const jsonData = await response.json();
                if(jsonData.status){
                    navigateTo('/admin/berita');
                }else{
                    localStorage.removeItem('token')
                    setPageLoading(false)
                }

            } catch (error) {
                localStorage.removeItem('token')
                setPageLoading(false)
            }

        }else{
            setPageLoading(false)

        }

    }

    
    const handleSubmit = async (event) => {
        setAlerts({...alerts, flogin:false})
        setFormLoading(true)
        event.preventDefault();

        // const [fileInput, setFileInput] = useState(null);
    
        try {
            const formData = new FormData();
            formData.append('username', form.username)
            formData.append('password', form.password)

            const response = await fetch(baseapi+'login', {
                method: 'POST',
                headers: {
                    'apikey' : kunci
                },
                body: formData,
            });

            const responseData = await response.json();
        
            if (responseData.status) {
                localStorage.setItem('token', 'Bearer '+responseData.data.auth.token)
                navigateTo('/admin/berita');
                // Reset the form after successful submission
            } else {
                setFormLoading(false)
                setAlerts({ ...alerts, flogin: true });
                setTimeout(() => {
                    setAlerts({ ...alerts, flogin: false });
                  }, 5000);
            }
        } catch (error) {
          console.error('Error sending data:', error);
        setFormLoading(false)

        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
      };

  return (
    <>
    {!pageLoading && <Navbar isAdmin={false} currentPage="login" />}
      <section id="login">
            <div className="container h-[100vh]">
                <div className="pt-24">
                    
        {!pageLoading && 
                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        
                        <div className="px-4 py-8 bg-white shadow rounded-lg sm:px-10">
                            <div className="flex justify-center mb-5">
                                <img src="logosmansara.png" alt="SMAN 1 Jepara" className="text-center w-52"/>
                            </div>
                            <hr/>
                            <form onSubmit={handleSubmit}>
                                
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 leading-5">
                                        Username
                                    </label>

                                    <div className="mt-1 rounded-md shadow-sm">
                                        <input id="username" name="username" type="text" required autoFocus className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" onChange={handleChange}/>
                                    </div>

                                </div>

                                <div className="mt-6">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 leading-5">
                                        Password
                                    </label>

                                    <div className="mt-1 rounded-md shadow-sm">
                                        <input id="password" name="password" type="password" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" onChange={handleChange} />
                                    </div>

                                </div>

                                <div className="mt-6">
                                    <span className="block w-full rounded-md shadow-sm">
                                        <button type="submit" className={formLoading ? 'btn-login-loading' : 'btn-login'} disabled={formLoading}>
                                            Log in
                                        </button>
                                    
                                        {formLoading ? spinnerLoading(): alerts.flogin? <div className='mt-5 text-center '><span className="text-red-600">Username atau password salah</span></div> : <div className='my-11'></div>}
                                    </span>
                                </div>
                                {/* @if ($errors->any())
                                    <span className="text-center text-red-600">{{$errors->first()}}</span>
                                @endif */}
                            </form>
                        </div>
                    </div>
            }        
        {pageLoading && 
            <div className="mt-8">

                {spinnerLoading()}
            </div>
        }
                </div>
            </div>
    </section>
    </>
  )
}

export default PageLogin
