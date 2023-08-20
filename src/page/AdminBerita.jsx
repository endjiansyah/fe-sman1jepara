import '../App.css'
import React, {useState, useEffect} from 'react'
import {baseapi, kunci} from '../env.js'
import Navbar from '../component/navbar';

function AdminBerita() {
    const [data, setData] = useState([]);
    const [formBerita, setFormBerita] = useState({
        id: '',
        title: '',
        body: '',
        image: null,
        imageBerita : null,
    });


    const[page, setPage] = useState({
        current : 1,
        maxpage : 1
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

        setPagination({
            back: newCurrentPage > 1,
            next: newCurrentPage < newMaxPage,
        });

        setPage({
            current: newCurrentPage,
            maxpage: newMaxPage,
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
            body: '',
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
            body:item.body,
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
            formData.append('body', formBerita.body)

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

                // Reset the form after successful submission
            } else {
                console.error('Failed to send data to the server');
            }
        } catch (error) {
          console.error('Error sending data:', error);
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

      
    useEffect(() => {
        fetchData();
    }, []);

  return (
    <>
    <Navbar isAdmin={true} currentPage="berita" />
    <section id="pengumuman">
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
                    {!pageLoading && 
                    <div className="w-auto flex justify-center gap-2 mt-4 items-center">

                        <button onClick={backPage} className={pagination.back ? 'rounded-md px-6 py-2 bg-gray-300 hover:bg-gray-200': 'bg-gray-200 rounded-md px-6 py-2'}  disabled={!pagination.back}>Back</button>
                        <h3>Page {page.current}</h3>
                        <button onClick={nextPage} className={pagination.next ? 'rounded-md px-6 py-2 bg-gray-300 hover:bg-gray-200': 'bg-gray-200 rounded-md px-6 py-2'}  disabled={!pagination.next}>Next</button>

                    </div>
                    }

                    {pageLoading && 
                    <div className="text-center mt-3">
                        <div role="status">
                            <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                    }
                </div>

                <div className="w-full lg:w-1/2">

                    <div className={mode.form == 'create' ? 'bg-white flex flex-col gap-2 shadow p-3' : 'bg-yellow-100/70 flex flex-col gap-2 shadow p-3'}>
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
                                <textarea value={formBerita.body} id="body" name="body" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="Isi Berita" onChange={handleChange}>
                                </textarea>
                            </div>

                            <label htmlFor="image" className="mt-3 block text-sm font-medium text-gray-700 leading-5">
                                Image
                            </label>
                            <div className="mt-1 rounded-md shadow-sm">
                                {/* <input value={formBerita.image} id="image" name="image" type="file" className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" /> */}
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
                                            <div role="status">
                                                <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                                </svg>
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                        }
                                    {/* @if ($message = Session::get('successktg'))
                                        <div className="text-green-600" role="alert">{{ $message }}</div>
                                    @endif */}
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>

  )
}

export default AdminBerita
