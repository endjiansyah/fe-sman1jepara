import '../App.css'
import React, {useState, useEffect} from 'react'
import {baseapi, kunci} from '../env.js'
import Navbar from '../component/navbar'
import {useNavigate } from 'react-router-dom';

function AdminDashboard() {
    
    const [data, setData] = useState([]);
    const[form, setForm] = useState({
        name : '',
        username : '',
        password : '',
        repassword : '',
    })
    const[formLoading, setFormLoading]=useState(false)

    const[alerts, setAlerts] = useState({
        success:false,
        fail:false,
        msg:''
    })

    const navigate = useNavigate();

    const cekLogin = async () => {
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
                    setData(jsonData.data)
                    setForm({...form,name:jsonData.data.name,username:jsonData.data.username})
                }else{
                    console.log(jsonData)
                    localStorage.removeItem('token')
                    navigate('/login');
                }

            } catch (error) {
                localStorage.removeItem('token')
                console.error('Error fetching data:', error);
                navigate('/login');
            }

        }else{
            navigate('/login');

        }

    }

    const handleSubmit = async (event) => {
        setFormLoading(true)
        setAlerts({ ...alerts, success: false,fail:false,msg:''});

        event.preventDefault();

        if (form.password !== form.repassword) {
            setAlerts({ ...alerts, fail: true, msg: 'password baru dan konfirmasi password harus sama' });
            setTimeout(() => {
                setAlerts({ ...alerts, fail: false });
            }, 5000);
            setFormLoading(false);
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append('name',form.name)
            formData.append('username',form.username)
            if(form.password != ''){
                formData.append('password',form.password)
            }

            const response = await fetch(baseapi+"user/update/"+data.id, {
                method: 'POST',
                headers: {
                    'apikey' : kunci
                },
                body: formData,
            });

            const responseData = await response.json();
        
            if (responseData.status) {
                setData({...data,name:responseData.data.name,username:responseData.data.username})
                setFormLoading(false)
                setAlerts({ ...alerts, success: true,msg:'perubahan data tersimpan'});
                setTimeout(() => {
                    setAlerts({ ...alerts, success: false });
                }, 5000);

                // Reset the form after successful submission
            } else {
                setFormLoading(false)
                setAlerts({ ...alerts, fail: true, msg:'perubahan data gagal tersimpan' });
                setTimeout(() => {
                    setAlerts({ ...alerts, fail: false });
                }, 5000);
            }
        } catch (error) {
            setFormLoading(false)
            setAlerts({ ...alerts, fail: true, msg:'perubahan data gagal tersimpan' });
            setTimeout(() => {
                setAlerts({ ...alerts, fail: false });
            }, 5000);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
      };

    useEffect(() => {
        cekLogin();
    }, []);

  return (
    <>
    <Navbar isAdmin={true} currentPage="home" />
    <section id="pengumuman">
        <div className="container min-h-[75vh]">
            <div className="w-full">
                <div className={`px-4 py-8 sm:rounded-lg sm:px-10 bg-white shadow ${alerts.success ? "shadow-xl shadow-yellow-300":"shadow-lg" } transition-shadow duration-500`}>
                    <h2 className="mb-6 text-2xl text-gray-900 leading-9">
                        Selamat Datang {data.name}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="flex gap-3 flex-col md:flex-row">

                            <div className="flex flex-col mt-3 md:mt-0">
                            
                                <label htmlFor="name">Nama</label>
                                <div className="mt-1 rounded-md shadow-sm">
                                    <input value={form.name} id="name" name="name" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="Judul Pengumuman" onChange={handleChange}/>
                                </div>
                            
                                <label htmlFor="username" className="mt-3">Username</label>
                                <div className="mt-1 rounded-md shadow-sm">
                                    <input value={form.username} id="username" name="username" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="Judul Pengumuman" onChange={handleChange}/>
                                </div>
                            
                            </div>

                            <div className="flex flex-col mt-3 md:mt-0">

                            <label htmlFor="password">Password</label>
                                <div className="mt-1 rounded-md shadow-sm">
                                    <input id="password" name="password" type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="Password baru" onChange={handleChange}/>
                                </div>

                                <label htmlFor="repassword" className="mt-3">Konfirmasi Password</label>
                                <div className="mt-1 rounded-md shadow-sm">
                                    <input id="repassword" name="repassword" type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="Ketik ulang password baru" onChange={handleChange}/>
                                </div>
                            
                            </div>

                        </div>
                        <div className="flex items-center gap-2">
                            <button type="submit" className="flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-500 focus:outline-none focus:border-green-700 focus:ring-indigo active:bg-green-700 transition duration-150 ease-in-out mt-4">
                                Simpan
                            </button>
                            {alerts.success && 
                                <div className="text-green-600" role="alert">{alerts.msg}</div>
                            }
                            {alerts.fail &&
                                <span className="text-red-600">{alerts.msg}</span>
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
    </>

  )
}

export default AdminDashboard
