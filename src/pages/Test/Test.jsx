import React from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import './Test.css'
function Test() {
    const [a,setA] = useState(1)
    let b = useRef(1)
    const fun = ()=>{
        b.current += 1
        console.log(getClientHeight()); 
        setA(a+1)
    }


    const getClientHeight = () => {
        var clientHeight = 0;
        if (document.body.clientHeight && document.documentElement.clientHeight) {
            var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
        }
        else {
            var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
        }
        return clientHeight;
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
                {a}<div>
                    {/* {b.current} */}
                </div>
                <button onClick={fun}>点击</button>
                {/* <Child></Child> */}
            </div>
        </>
    )
}

// function Child(){
//     return (
//         <>
//             <div>
//                 chlid
//             </div>
//         </>
//     )
// }

export default Test
