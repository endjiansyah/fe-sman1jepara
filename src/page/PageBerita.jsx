import '../App.css'
import React, {useState, useEffect} from 'react'
import formatDate from '../component/formatingDate'
import {baseapi, kunci} from '../env.js'


function PageBerita() {
    const [data, setData] = useState([]);
    const [Berita, setBerita] = useState({
        id: '',
        title: '',
        body: '',
        time: '',
        image: '',
        show: 'false',
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
    try {
        const response = await fetch(baseapi+'content/berita',{
            headers:{
                'apikey':kunci,
            }
        });
        const jsonData = await response.json();
        setData(jsonData.data);
        setIsLoading(false);

        } catch (error) {
        console.error('Error fetching data:', error);
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
            time:item.time,
            image:item.image,
            show:'true',
        });
        window.location.href='#bacaberita'
    };

  return (
    <section id="berita">
        <div className="container min-h-[75vh]">
            <div className="title">
                <h2 id="bacaberita">Berita</h2>
                <p>Berita SMA Negeri 1 Jepara</p>
            </div>

            <div>
                {Berita.show == 'true' && 
                    <div className="card mb-8 md:mx-2 lg:mx-4 rounded-xl bg-white border-blue-400 border-4 shadow-lg">
                        <div className="flex justify-between w-full p-1">
                            <p>{Berita.time}</p>
                            <button onClick={closeBerita} className="bg-red-500 hover:bg-red-600 text-white text-center w-7 h-7 rounded-full">x</button>
                        </div>
                        <div className=" p-4 md:px-6 md:pb-6">
                            <div className="w-full flex justify-center">
                                {Berita.image != '' && <img src="/logosmansara.png" alt={Berita.title}/>}
                            </div>
                            <div>
                                {Berita.image != '' && <br/>}
                                <div className="line"></div>
                                <h3>{Berita.title}</h3>
                                <hr className="mb-2"/>
                                <p>{Berita.body}</p>
                            </div>
                        </div>
                    </div>
                }
                
                <hr className="mb-2"/>
                
                <div className="card-box">

                    {data.map((item) => (
                    <div className={Berita.id == item.id ? 'border-blue-400 border-4 card'  : 'card'} key={item.id}>
                        <div className="w-full flex justify-center">
                            <img src={item.image != ''? item.image : '/logosmansara.png' } alt={item.title} />
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
            </div>
        </div>
    </section>
  )
}

export default PageBerita
