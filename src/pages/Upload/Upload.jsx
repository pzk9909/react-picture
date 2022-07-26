import React from 'react'
import { useState } from 'react'
import Progress from '../../components/Progress/Progress'
import './Upload.css'
import { message } from 'antd'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
function Upload() {
    const [fileList, setFilesList] = useState([])
    const preRef = useRef(null)
    const countRef = useRef(0)
    const fileOnChange = () => {
        let files = document.getElementById('inputFile').files
        if (files.length > 50 || files.length + countRef.current > 50) {
            message.warn('单次最大上传五十张文件')
        } else {
            let tempFilesList = []
            for (let i = 0; i < files.length; i++) {
                //图片格式限制
                if (
                    files[i].type === 'image/gif' ||
                    files[i].type === 'image/jpg' ||
                    files[i].type === 'image/jpeg' ||
                    files[i].type === 'image/png'
                ) {
                    tempFilesList.push(files[i])
                } else {
                    message.warn('图片格式限制(jpg,png,gif)')
                }
            }
            setFilesList([...fileList, ...tempFilesList])
            countRef.current += tempFilesList.length
        }
    }

    const handleDelete = () => {
        countRef.current -= 1
        if (countRef.current === 0) {
            setFilesList([])
        }
        console.log(countRef.current);
    }

    const uploadConfirm = () => {
        if (countRef.current === 0) {
            message.warn('当前未选择任何图片')
        } else {
            message.success('确认上传成功')
            setFilesList([])
        }
    }

    return (
        <>
            <div className="upload-container">
                <label style={{ display: countRef.current === 0 || fileList.length === 0 ? true : 'none' }} htmlFor="inputFile">
                    <div className='add'>
                        <div>点击添加图片</div>
                        <span>最多可同时上传50张图片（支持格式jpg,jpeg,png,gif）</span>
                    </div>
                </label>
                <div ref={preRef} className='pre-container'>
                    {fileList.map((item) => (
                        <Progress handleDelete={handleDelete} key={item.name} file={item}></Progress>
                    ))}
                </div>
                <input accept="image/jpg,image/gif,image/png,image/jpeg" style={{ display: 'none' }} multiple id='inputFile' type="file" onChange={fileOnChange} />
                <div style={{ display: countRef.current === 0 || fileList.length === 0 ? 'none' : true }}>
                    <label htmlFor="inputFile"><div className='button' onClick={uploadConfirm}>继续上传</div></label>
                    <Link to="/"><div className='button'>返回主页</div></Link>
                </div>
            </div>
        </>
    )
}

export default Upload
