import React from 'react'
import { useState } from 'react'
import Progress from '../../components/Progress/Progress'
import './Upload.css'
import { message, Button } from 'antd'
import { useRef } from 'react'
function Upload() {
    const [fileList, setFilesList] = useState([])
    const preRef  = useRef(null)
    const fileOnChange = () => {
        let files = document.getElementById('inputFile').files
        let count = preRef.current.children.length
        if (files.length > 50 || files.length + count > 50) {
            message.warn('单次最大上传五十张文件')
        } else {
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

    const uploadConfirm = () => {
        let count = preRef.current.children.length
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
                <label htmlFor="inputFile">
                    <div className='add'>
                        <div>点击添加图片</div>
                        <span>最多可同时上传50张图片（支持格式jpg,png,gif）</span>
                    </div>
                </label>
                <div ref={preRef} className='pre-container'>
                    {fileList.map((item, index) => (
                        <Progress key={item.name} file={item}></Progress>
                    ))}
                </div>
                <input accept="image/jpg,image/gif,image/png" style={{ display: 'none' }} multiple id='inputFile' type="file" onChange={fileOnChange} />
                <div>
                    <Button style={{display:fileList.length === 0 ? 'none' : true}} onClick={uploadConfirm}>继续上传</Button>
                </div>
            </div>
        </>
    )
}

export default Upload
