import '../App.css'
import React, {useState, useEffect,useRef} from 'react'
import {baseapi, kunci,mcekey} from '../env.js'
import Navbar from '../component/navbar';
import {useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import spinnerLoading from '../component/spinnerLoading'


function AdminBerita() {
    const editorRef = useRef(null);
    const [alerts, setAlerts] = useState({
        save : false,
        fail : false
    });
    const navigate = useNavigate();
    const [fullLoading, setFullLoading] = useState(true);

    const cekLogin = async () => {
        setFullLoading(true)
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
                    setFullLoading(false)
                }else{
                    localStorage.removeItem('token')
                    navigate('/login');
                }

            } catch (error) {
                localStorage.removeItem('token')
                navigate('/login');
            }

        }else{
            navigate('/login');

        }

    }

    const [data, setData] = useState([]);
    const [formBerita, setFormBerita] = useState({
        id: '',
        title: '',
        bodyform: '',
        image: null,
        imageBerita : null,
    });


    const[page, setPage] = useState({
        current : 1,
        maxpage : 1,
        total : 0
    })
    
    const[pagination,setPagination]=useState({
        back : false,
        next : false,
    })
    
    const[mode, setMode] = useState({
        form: 'create',
        endpoint:'content',
    })
    const [pageLoading, setPageLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    const fetchData = async () => {
    try {

        setPageLoading(true);

        const response = await fetch(baseapi+'content/berita?page='+page.current,{
            headers:{
                'apikey':kunci
            }
        });
        const jsonData = await response.json();

        const newCurrentPage = jsonData.page;
        const newMaxPage = jsonData.maxpage;
        const newCount = jsonData.count;

        setPagination({
            back: newCurrentPage > 1,
            next: newCurrentPage < newMaxPage,
        });

        setPage({
            current: newCurrentPage,
            maxpage: newMaxPage,
            total: newCount,
        });

        setData(jsonData.data);
        setPageLoading(false);

        } catch (error) {
        console.error('Error fetching data:', error);
        }
    }

    
    const nextPage = () => {
        if (page.current < page.maxpage) {

            page.current = (+page.current + 1)
        }
        fetchData()
    }

    const backPage = () => {
        if (page.current > 1) {

            page.current = (+page.current - 1)
        }
        fetchData()
    }

    const modeCreate = () => {
        setFormBerita({
            id: '',
            title: '',
            bodyform: '',
            image: null,
        })

        setMode({
            form: 'create',
            endpoint:'content',
        })
    };

    const modeUpdate = (item) => {
        setFormBerita({
            id:item.id,
            title:item.title,
            bodyform:item.body,
            image:item.image,
            imageBerita: item.image
        });

        setMode({
            form: 'update',
            endpoint:'content/update/'+item.id,
        })

        const topSection = document.getElementById('top');
        if (topSection) {
            topSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSubmit = async (event) => {
        setFormLoading(true)
        event.preventDefault();

        // const [fileInput, setFileInput] = useState(null);
    
        try {
            const formData = new FormData();
            formData.append('title', formBerita.title)
            formData.append('body', editorRef.current.getContent())

            if(formBerita.image){
                formData.append('image', formBerita.image)
            }
           
            formData.append('type', 2)

            const response = await fetch(baseapi+mode.endpoint, {
                method: 'POST',
                headers:{
                    'apikey' : kunci
                },
                body: formData,
            });

            const responseData = await response.json();
        
            if (responseData.status) {
                page.current = 1
                fetchData();
                modeCreate();
                setFormLoading(false)
                setAlerts({ ...alerts, save: true });
                setTimeout(() => {
                    setAlerts({ ...alerts, save: false });
                  }, 5000);
                // Reset the form after successful submission
            } else {
                setFormLoading(false)
                setAlerts({ ...alerts, fail: true });
                setTimeout(() => {
                    setAlerts({ ...alerts, fail: false });
                  }, 5000);
            }
        } catch (error) {
            setFormLoading(false)
            setAlerts({ ...alerts, fail: true });
            setTimeout(() => {
                setAlerts({ ...alerts, fail: false });
              }, 5000);
        }
    };

    const handleChange = (event) => {
        const { name, value, type } = event.target;

        if (type === 'file' && value != '') {
            setFormLoading(true)
            setFormBerita((prevFormBerita) => ({
                ...prevFormBerita,
                [name]: event.target.files[0],
            }));
            formBerita.imageBerita = URL.createObjectURL(event.target.files[0])
            setFormLoading(false)

        } else {
            setFormBerita((prevFormBerita) => ({
                ...prevFormBerita,
                [name]: value,
            }));
        }
      };

    const handleDelete = async (item) => {
        setFormLoading(true)

        const confirmDelete = window.confirm(`Hapus data ${item.title}?`);
        
        if (confirmDelete) {
          try {
            const response = await fetch(baseapi+'content/delete/'+item.id, {
              method: 'POST',
              headers:{
                'apikey' : kunci
              }
            });

            const responseData = await response.json();
    
            if (responseData.status) {
              fetchData();
              modeCreate();
                setFormLoading(false)
            } else {
              console.error('Gagal menghapus data');
            }
          } catch (error) {
            console.error('Error deleting data:', error);
          }
        }
      };

      const handleChangeTextArea = (event) => {
        const { value } = event.target;
        setFormBerita((prevFormBerita) => ({
            ...prevFormBerita,
            bodyform: value,
        }));
    };
    useEffect(() => {
        cekLogin();
        fetchData();
    }, []);

  return (
    <>
    <Navbar isAdmin={true} currentPage="berita" />
    <section id="pengumuman">
        {!fullLoading && 
            <div className="container min-h-[75vh] mb-8">
                <div className="title" id="top">
                    <h2>Berita</h2>
                    <p>
                        List Berita SMA Negeri 1 Jepara
                    </p>
                </div>

                <div className="mt-2 flex flex-col-reverse lg:flex-row gap-3">
                    
                    <div className="w-full lg:w-1/2">
                        {/* @if ($message = Session::get('successdktg'))
                            <div className="text-red-600" role="alert">{{ $message }}</div>
                        @endif */}
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-white uppercase bg-neutral-500">
                                <tr className="">
                                    <th className="py-3 px-6 text-center">
                                        Image
                                    </th>
                                    <th className="py-3 px-6 text-center">
                                        title 
                                    </th>
                                    <th className="py-3 px-6  text-center">
                                        <span className="sr-only"></span>
                                    </th>
                                </tr>
                            </thead>
                            {!pageLoading && 
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item.id} className={formBerita.id == item.id ?'bg-yellow-100/70 hover:bg-yellow-100 border-b':'bg-white hover:bg-gray-50 border-b'}>
                                        <th scope="row" className="py-4 px-6 text-center">
                                            {item.image != null && 
                                                <img src={item.image} alt={item.title} className="h-24"/>
                                            }
                                        </th>
                                        <td className="py-4 px-6 text-center">
                                            {item.title}
                                        </td>
                                            <td className="py-4 px-6 text-right">
                                                <button onClick={() => modeUpdate(item)} className="font-medium text-blue-600 hover:underline mx-2">Edit</button>
        
                                                <button onClick={() => handleDelete(item)} className="font-medium text-red-600 hover:underline">delete</button>
                                            </td>
                                    </tr>
                                ))}
                                    
                            </tbody>
                            }
                        </table>
                        {!pageLoading && page.total >10 && (
                        <div className="w-auto flex justify-center gap-2 mt-4 items-center">

                            <button onClick={backPage} className={pagination.back ? 'rounded-md px-6 py-2 bg-gray-300 hover:bg-gray-200': 'bg-gray-200 rounded-md px-6 py-2'}  disabled={!pagination.back}>Back</button>
                            <h3>Page {page.current}</h3>
                            <button onClick={nextPage} className={pagination.next ? 'rounded-md px-6 py-2 bg-gray-300 hover:bg-gray-200': 'bg-gray-200 rounded-md px-6 py-2'}  disabled={!pagination.next}>Next</button>

                        </div>
                        )}

                        {pageLoading && 
                        <div className="text-center mt-3">
                            {spinnerLoading()}
                        </div>
                        }
                    </div>

                    <div className="w-full lg:w-1/2">

                        <div className={mode.form == 'create' ? 'bg-blue-100 flex flex-col gap-2 shadow p-3' : 'bg-yellow-100/70 flex flex-col gap-2 shadow p-3'}>
                            <div className="flex justify-between">
                                <h2 className="font-bold">{mode.form == 'create'? 'buat berita' : 'Edit berita'}</h2>
                                <button onClick={modeCreate} className={mode.form == 'create' ? 'hidden' : 'px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-500'}>Batal Edit</button>
                            </div>
                            <hr/>
                        
                            <form onSubmit={handleSubmit}>

                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 leading-5">
                                    Title
                                </label>
                                <div className="mt-1 rounded-md shadow-sm">
                                    <input value={formBerita.title} id="title" name="title" type="text" required autoFocus className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="Judul Berita" onChange={handleChange}/>
                                </div>
                        
                                <label htmlFor="body" className="mt-3 block text-sm font-medium text-gray-700 leading-5">
                                    Body
                                </label>
                                <div className="mt-1 rounded-md shadow-sm">
                                <Editor
                                    className="w-full"
                                    apiKey={mcekey}
                                    onInit={(evt, editor) => editorRef.current = editor}
                                    value={formBerita.bodyform}
                                    id="bodyform"
                                    onChange={handleChangeTextArea}
                                    init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}
                                />
                                </div>

                                <label htmlFor="image" className="mt-3 block text-sm font-medium text-gray-700 leading-5">
                                    Image
                                </label>
                                <div className="mt-1 rounded-md shadow-sm">

                                    <label htmlFor="image" className='bg-white px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 flex items-center gap-3'>
                                    <input
                                        onChange={handleChange}
                                        id="image" name="image" type="file"
                                        hidden/>
                                        <img src={formBerita.imageBerita ? formBerita.imageBerita : '/logosmansara.png'} className='h-24' />                              
                                        
                                    </label>
                                </div>
                        
                                <hr className="my-3"/>
                                <div>
                                    <span className="flex w-full gap-3 items-center">
                                        {!formLoading && 
                                            <button type="submit" className="flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-500 focus:outline-none focus:border-green-700 focus:ring-indigo active:bg-green-700 transition duration-150 ease-in-out">
                                                Simpan
                                            </button>
                                        }
                                        {formLoading && 
                                            <div className="text-center mt-3">
                                                {spinnerLoading()}
                                            </div>
                                            }
                                        {alerts.save &&
                                            (<div className="text-green-600" role="alert">Data Tersimpan</div>)
                                        }
                                        {alerts.fail &&
                                            (<div className="text-red-600" role="alert">title dan body wajib diisi</div>)
                                        }
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        }
    </section>
    </>

  )
}

export default AdminBerita
