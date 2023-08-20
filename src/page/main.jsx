import '../App.css'
import React, {useState, useEffect} from 'react'
import formatDate from '../component/formatingDate'
import {baseapi, kunci} from '../env.js'
import Navbar from '../component/navbar'
import spinnerLoading from '../component/spinnerLoading'
import { Link } from 'react-router-dom';

function PageMain() {
    const [dataBrt, setDataBrt] = useState([]);
    const [Berita, setBerita] = useState({
        id: '',
        title: '',
        body: '',
        time: '',
        image: '',
        show: 'false',
    });
    
    const[limitContent, setLimitContent] = useState(
        {
            berita:1,
            pengumuman:1,
        }
    )
    const [dataPgm, setDatPgm] = useState([]);
    const [Pengumuman, setPengumuman] = useState({
        id: '',
        title: '',
        body: '',
        time: '',
        show: 'false',
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBerita();
    }, []);

    const fetchBerita = async () => {
    try {
        setIsLoading(true)
        const responseBerita = await fetch(baseapi+'content/berita?limit=3',{
            headers:{
                'apikey':kunci,
            }
        });
        const jsonBerita = await responseBerita.json();
        if(jsonBerita.status){
            setDataBrt(jsonBerita.data);
            limitContent.berita = jsonBerita.maxpage

        }

        const responsePengumuman = await fetch(baseapi+'content/pengumuman?limit=4',{
            headers:{
                'apikey' : kunci
            }
        });
        const jsonPengumuman = await responsePengumuman.json();
        if(jsonPengumuman.status){
            setDatPgm(jsonPengumuman.data);
           
                limitContent.pengumuman = jsonPengumuman.maxpage
            
        }
        console.log(limitContent)
        setIsLoading(false);

        } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
        
        }
    }

    const closeBerita = () => {
        setBerita({
        id: '',
        title: '',
        body: '',
        time: '',
        image: '',
        show: 'false',
        })
    };

    const showBerita = (item) => {
        setBerita({
            id:item.id,
            title:item.title,
            body:item.body,
            time:item.updated_at,
            image:item.image,
            show:'true',
        });
        const beritaSection = document.getElementById('bacaberita');
        if (beritaSection) {
            beritaSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const closePengumuman = () => {
        setPengumuman({
        id: '',
        title: '',
        body: '',
        time: '',
        show: 'false',
        })
    };

    const showPengumuman = (item) => {
        setPengumuman({
            id:item.id,
            title:item.title,
            body:item.body,
            time:item.updated_at,
            show:'true',
        });
        const pengumumanSection = document.getElementById('bacapengumuman');
        if (pengumumanSection) {
            pengumumanSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

  return (
    <>
    <Navbar isAdmin={false} currentPage="home" />
    {isLoading && 
    <div className='mt-40'>
    {spinnerLoading()}
    </div>
    }
    {!isLoading && 
    <>
    <section id="berita">
            <div className="container">
                <div className="title">
                    <h2 id="bacaberita">Berita</h2>
                    <p>Berita SMA Negeri 1 Jepara</p>
                </div>

                <div>
                {Berita.show == 'true' &&
                    <>
                        <div className="card mb-8 md:mx-2 lg:mx-4 rounded-xl bg-white border-blue-400 border-4 shadow-lg">
                            <div className="flex justify-between w-full p-1">
                                <p>{formatDate(Berita.time)}</p>
                                <button onClick={closeBerita} className="bg-red-500 hover:bg-red-600 text-white text-center w-7 h-7 rounded-full">x</button>
                            </div>
                            <div className=" p-4 md:px-6 md:pb-6">
                                <div className="w-full flex justify-center">
                                    {Berita.image != null && <img src={Berita.image} alt={Berita.title}/>}
                                </div>
                                <div>
                                    {Berita.image != null && <br/>}
                                    <div className="line"></div>
                                    <h3>{Berita.title}</h3>
                                    <hr className="mb-2"/>
                                    <p>{Berita.body}</p>
                                </div>
                            </div>
                        </div>
                        <hr className="mb-2"/>
                    </>
                    }
                    
                    <div className="card-box">

                        {dataBrt.map((item) => (
                        <div className={Berita.id == item.id ? 'border-blue-400 border-4 card'  : 'card'} key={item.id}>
                            <div className="w-full flex justify-center">
                                <img src={item.image != null ? item.image : '/logosmansara.png' } alt={item.title} />
                            </div>
                            
                            <div className="text">         
                            {formatDate(item.updated_at)}
                                <div className="line">
                                </div>
                                <h3>
                                    {item.title}
                                </h3>
                                <button onClick={() => showBerita(item)}>Continue Reading</button>
                            </div>
                        </div>
                        ))}
                        
                    </div>
                    <div className='flex justify-center'>
                        {limitContent.berita > 1 && 
                            <Link
                                to='berita'
                                className='text-2xl text-gray-600 hover:text-gray-800 my-8'
                            >
                                Show More
                            </Link>
                        }
                    </div>
                </div>
            </div>
    </section>

    <section id="pengumuman">
        <div className="container mb-8">
            <div className="title">
                <h2 id="bacapengumuman">Pengumuman</h2>
                <p>
                    Pengumuman SMA Negeri 1 Jepara
                </p>
            </div>

            <div className="w-full flex justify-center flex-col gap-4">
                <div className="w-full flex justify-center">
                {Pengumuman.show == 'true' && 
                    <div className="card border-4 border-blue-700">
                        <div className="flex justify-between w-full py-0 h-auto">
                            {formatDate(Pengumuman.time)}

                            <button onClick={closePengumuman} className="bg-red-500 hover:bg-red-600 text-white text-center w-7 h-7 rounded-full">x</button>
                        </div>
                        <hr/>
                        <div className="text-card w-full">
                            <h1 className="text-center">{Pengumuman.title}</h1>
                            <p>{Pengumuman.body}</p>
                        </div>
                    </div>
                }
                </div>
                    
                <hr className="mb-2"/>
                
                    <div className="card-box">
                        {dataPgm.map((item) => (
                            <button key={item.id} className={Pengumuman.id == item.id ? 'border-4 border-blue-700 card' : 'card'} onClick={() => showPengumuman(item)}>
                                <div className="text-card">
                                    <h1 className='text-left'>{item.title}</h1>

                                    <p className="date">
                                        {formatDate(item.updated_at)}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                    {+limitContent.pengumuman > 1 && 
                        <Link
                            to='pengumuman'
                            className='text-2xl text-gray-600 hover:text-gray-800 my-8'
                        >
                            Show More
                        </Link>
                    }

            </div>
        </div>
    </section>
    </>
                }
    </>
  )
}

export default PageMain
