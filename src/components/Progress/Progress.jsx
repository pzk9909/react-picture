import React from 'react'
import 'antd/dist/antd.css'
import * as api from '../../net-module/api'
import './Progress.css'
import axios from 'axios'
import { Spin } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useEffect } from 'react'

axios.defaults.withCredentials = true

function Progress({ file, handleDelete }){
const [finished,setFinished] = useState(false)
  const [percent, setPercent] = useState(0)
  const [url, setUrl] = useState('')
  const [id, setId] = useState(0)
  const [isShow, setIsShow] = useState(true)

  useEffect(()=>{
    if (finished === false) {
      handleUpload()
    }
  },[])
  const configs = {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
    onUploadProgress: (progress) => {
      console.log(progress)
      let { loaded } = progress
      console.log(loaded, file.size)
      let baifenbi =
        loaded < file.size
          ? ((loaded / file.size) * 100).toFixed(2)
          : 100
      setPercent(baifenbi)
    },
  }

  const handleUpload = async () => {
    const formData = new FormData()
    formData.append('files', file)
    //请求
    setTimeout(async () => {
      let res = await api.upload(formData, configs)
      //预览图
      console.log(formData);
      const fr = new FileReader()
      fr.readAsDataURL(file)
      fr.onload = function (readRes) {
        setUrl(readRes.target.result)
      }
      setPercent(100)
      setFinished(true)
      setId(res[0].id)
    }, Math.random(1) * 500)
  } //上传图片


  const deletePic = async () => {
    console.log(id)
    let res = await api.deletePicture({ id })
    setIsShow(false)
    handleDelete()
  } //预览图片删除

  if (isShow) {
    return (
      <div name="progress" className="progress-container">
        <Spin
          style={{ transform: 'translateY(3px)' }}
          spinning={!finished}
        />
        <div className="img-preLook">
          <img className='pre-img-container'
            id="preImg"
            src={url}
          ></img>
        </div>
        <div
          style={{ width: `${percent}px` }}
          className="progress"
        ></div>
        {percent + '%'}
        <DeleteOutlined onClick={deletePic} className="delete-icon" />
      </div>
    )
  }
}


export default Progress
