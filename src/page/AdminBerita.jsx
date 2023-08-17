import '../App.css'
import React, {useState, useEffect} from 'react'

function AdminBerita() {
    const [data, setData] = useState([]);
    const [formBerita, setFormBerita] = useState({
        id: '',
        title: '',
        body: '',
        image: null,
        type: 2,
    });

    const[mode, setMode] = useState({
        form: 'create',
        endpoint:'content',
    })
    // const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
    try {
        const response = await fetch(baseapi+'content/berita');
        const jsonData = await response.json();
        setData(jsonData.data);
        // setIsLoading(false);

        } catch (error) {
        console.error('Error fetching data:', error);
        }
    }

    const modeCreate = () => {
        setFormBerita({
            id: '',
            title: '',
            body: '',
            image: null,
            type:2,
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
            type:2,
        });

        setMode({
            form: 'update',
            endpoint:'content/update/'+item.id,
        })

        window.location.href='#top'
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // const [fileInput, setFileInput] = useState(null);
    
        try {
            const formData = new FormData();
            formData.append('title', formBerita.title)
            formData.append('body', formBerita.body)

            if(formBerita.image){
                formData.append('image', formBerita.image)
            }
           
            formData.append('type', formBerita.type)

            const response = await fetch(baseapi+mode.endpoint, {
                method: 'POST',
                body: formData,
            });

            // console.log(response.data)
            const responseData = await response.json();
            console.log(responseData)
        
            if (response.ok) {
                // console.log('Data successfully sent to the server');

                fetchData();
                modeCreate();
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

        if (type === 'file') {
            setFormBerita((prevFormBerita) => ({
                ...prevFormBerita,
                [name]: event.target.files[0],
            }));
        } else {
            setFormBerita((prevFormBerita) => ({
                ...prevFormBerita,
                [name]: value,
            }));
        }
      };

    const handleDelete = async (item) => {
        const confirmDelete = window.confirm(`Hapus data ${item.title}?`);
        
        if (confirmDelete) {
          try {
            const response = await fetch(baseapi+'content/delete/'+item.id, {
              method: 'POST',
            });
    
            if (response.ok) {
              // Lakukan tindakan setelah penghapusan berhasil
              console.log(response);
              fetchData();
              // Refresh atau perbarui tampilan data jika diperlukan
            } else {
              console.error('Gagal menghapus data');
            }
          } catch (error) {
            console.error('Error deleting data:', error);
          }
        }
      };

  return (
    <section id="pengumuman">
        <div className="container min-h-[75vh]">
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
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id} className={formBerita.id == item.id ?'bg-yellow-100/70 hover:bg-yellow-100 border-b':'bg-white hover:bg-gray-50 border-b'}>
                                    <th scope="row" className="py-4 px-6 text-center">
                                        {item.image != '' && 
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
                    </table>
                    {/* <div className="w-auto flex justify-center gap-2 mt-4 items-center">
                        <?php 
                        $back = $page - 1;
                        $next = $page + 1;
                            ?>
                        <a x-bind:href="{{ $page }} <= 1 ? '#' : 'berita?page='+{{ $back }}" x-bind:className="{{ $page }} <= 1 ? 'bg-gray-200': 'bg-gray-300 hover:bg-gray-200'" className="rounded-md px-6 py-2" <?= $page <= 1? 'disabled' : '' ?>>Back</a>
                        <h3 x-text="'Page '+{{ $page }}"></h3>
                        <a x-bind:href="{{ $page }} >= {{ $maxpage }} ? '#' : 'berita?page='+{{ $next }}" x-bind:className="{{ $page }} >= {{ $maxpage }} ? 'bg-gray-200': 'bg-gray-300 hover:bg-gray-400'" className="rounded-md px-6 py-2" <?= $page >= $maxpage ? 'disabled' : '' ?>>Next</a>


                    </div> */}
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
                                    {mode.form == 'create' ? 
                                    <img src={formBerita.image ? URL.createObjectURL(formBerita.image) : 'logosmansara.png'} className='h-24' />
                                    :
                                    <img src={formBerita.image ? formBerita.image : 'logosmansara.png'} className='h-24' />
                                    }
                                    
                                </label>
                            </div>
                    
                            <hr className="my-3"/>
                            <div>
                                <span className="flex w-full gap-3 items-center">
                                    <button type="submit" className="flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-500 focus:outline-none focus:border-green-700 focus:ring-indigo active:bg-green-700 transition duration-150 ease-in-out">
                                        Simpan
                                    </button>
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

  )
}

export default AdminBerita
