import '../App.css'
import React, {useState, useEffect} from 'react'
import formatDate from '../component/formatingDate'
import {baseapi, kunci} from '../env.js'
import spinnerLoading from '../component/spinnerLoading'
import Navbar from '../component/navbar'

function PagePengumuman() {
    const [data, setData] = useState([]);
    const [Pengumuman, setPengumuman] = useState({
        id: '',
        title: '',
        body: '',
        time: '',
        show: 'false',
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
    try {
        setIsLoading(true)
        const response = await fetch(baseapi+'content/pengumuman',{
            headers:{
                'apikey' : kunci
            }
        });
        const jsonData = await response.json();
        setData(jsonData.data);
        setIsLoading(false);

        } catch (error) {
        console.error('Error fetching data:', error);
        }
    }

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
    <Navbar isAdmin={false} currentPage="pengumuman" />

    <section id="pengumuman">
        <div className="container min-h-[75vh] mb-8">
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
                {!isLoading && 
                    <div className="card-box">
                        {data.map((item) => (
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
                }
                {isLoading && spinnerLoading()}

            </div>
        </div>
    </section>
    </>

  )
}

export default PagePengumuman
