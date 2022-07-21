import React from 'react'
import { useState } from 'react'
import './Test.css'
function Test() {
    const [fileList, setFilesList] = useState([
        { id: 1, isShow: 0 },
        { id: 2, isShow: 0 },
        { id: 3, isShow: 0 },
        { id: 4, isShow: 0 },
        { id: 5, isShow: 0 },
        { id: 6, isShow: 0 },
        { id: 7, isShow: 0 },
        { id: 8, isShow: 0 },
        { id: 9, isShow: 0 }])
    var fileOnChange = () => {
        var tmp = [
            { id: 1, isShow: 0 },
            { id: 2, isShow: 1 },
            { id: 3, isShow: 0 },
            { id: 4, isShow: 0 },
            { id: 5, isShow: 0 },
            { id: 6, isShow: 0 },
            { id: 7, isShow: 0 },
            { id: 8, isShow: 0 },
            { id: 9, isShow: 0 }]
            setFilesList(tmp)
    }

    

    return (
        <>
            <div id='test-container' className="test-container">
                {/* <button onClick={fileOnChange}>点击</button>
                <div className="note-book_img">
                    {
                        fileList.map(item => {
                            return (<div key={item.id}>
                                <div>{item.id}</div>
                                <div>{item.isShow}</div>
                                </div>)
                        })
                    }
                </div> */}
                <Child></Child>
            </div>
        </>
    )
}

function Child(){
    return (
        <>
            <div>
                chlid
            </div>
        </>
    )
}

export default Test
