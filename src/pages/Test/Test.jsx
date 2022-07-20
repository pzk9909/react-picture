import React from 'react'
import { useState } from 'react'
import './Test.css'
import * as api from '../../net-module/api'
import Img from '../../components/Img/Img';
import { type } from '@testing-library/user-event/dist/type';
function Test() {
    const [fileList, setFilesList] = useState([])
    var fileOnChange = () => {
        // api.getPicture({ page: 1 }).then(res => {
        //     console.log(res.pictures);
        //     setFilesList([...res.pictures])
        // })
        // setFilesList([...fileList, ...files])
        let dom = document.getElementById('test-container')
        console.log(dom);
        let child = Home111()
        console.log(child);
        // dom.appendChild(child)
    }

    return (
        <>
            <div id='test-container' className="test-container">
                <button onClick={fileOnChange}>点击</button>
                {/* <div className="note-book_img">
                    {
                        fileList.map(item => {
                            return (<Img
                                src={item.low}
                                alt={""}
                                style={{ height: 200, width: 400, marginLeft: 20 }}
                            />)
                        })
                    }
                </div> */}
            </div>
        </>
    )
}


function Home111() {
    return (
            <div className="container">
                Home
            </div>
    )
}


export default Test
