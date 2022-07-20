import React from 'react'
import { useState } from 'react'
import Progress from '../../components/Progress/Progress'
import './Upload.css'
import {message,Button} from 'antd'
function Upload() {
    const [fileList, setFilesList] = useState([])
    var fileOnChange = () => {
        var files = document.getElementById('inputFile').files
        var count = document.getElementsByName('progress').length
        console.log(count);
        if(files.length > 10 || files.length+count > 10 ){
            message.warn('单次最大上传十张文件')
        } else{
            console.log(11111111);
            let tempFilesList = []
            for (let i = 0; i < files.length; i++) {
                //图片格式限制
                if (
                    files[i].type === 'image/gif' ||
                    files[i].type === 'image/jpg' ||
                    files[i].type === 'image/png'
                ) {
                    tempFilesList.push(files[i])
                } else {
                    message.warn('图片格式限制(jpg,png,gif)')
                }
            }
            setFilesList([...fileList, ...tempFilesList])
        }
    }

    var uploadConfirm = () => {
        var count = document.getElementsByName('progress').length
        if(count === 0 ){
            message.warn('当前未选择任何图片')
        }else{
            message.success('确认上传成功')
            setFilesList([])
        }
        
    }

    return (
        <>
            <div className="upload-container">
                <div className='pre-container'>   
                    {fileList.map((item, index) => (<Progress key={index} file={item}></Progress>))}
                    <input accept="image/jpg,image/gif,image/png" style={{ display: 'none' }} multiple id='inputFile' type="file" onChange={fileOnChange} />
                    <label htmlFor="inputFile">
                        <div className='add'>
                            <div>点击添加图片</div>
                            <span>最多可同时上传10张图片（支持格式jpg,png,gif）</span>
                        </div>
                    </label>
                </div>
                <div>
                    <Button  onClick={uploadConfirm}>确认上传</Button>
                </div>
            </div>
        </>
    )
}

export default Upload
