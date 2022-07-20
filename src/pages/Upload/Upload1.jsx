import { useState } from 'react'
import * as api from '../../net-module/api'
import { message } from 'antd'
import './Upload.css'
function Upload() {
  const [src, setSrc] = useState([])
  const [filesList, setFilesList] = useState([])
  var configs = {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
    onUploadProgress: (progress) => {
      console.log(progress);
      let { loaded } = progress
      let { filseSize } = this.state
      console.log(loaded, filseSize);
      let baifenbi = (loaded / filseSize * 100).toFixed(2)
      this.setState({
        baifenbi
      })
    }
  }
  var uploadChange = async function () {
    var files = document.getElementById('inputFile').files //获取每次选择的文件
    if (filesList.length >= 5 || files.length + filesList.length > 5) {
      window.alert('单次最大上传5张图片')
    } else {
      console.log(filesList.length);
      var tempFilesList = []
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
          window.alert('图片格式限制（jpg,png,gif)')
        }
      }
      setFilesList([...filesList, ...tempFilesList])
      //预览选择图片
      const filesT = [...tempFilesList]
      const promise = filesT.map((file) => {
        return new Promise((resolve, reject) => {
          var fr = new FileReader()
          fr.readAsDataURL(file)
          fr.onload = function (readRes) {
            console.log(file)
            resolve({ src: readRes.target.result })
          }
        })
      })
      const tempSrc = await Promise.all(promise)
      setSrc([...src, ...tempSrc])
    }
  }

  //最终上传图片
  var upload = async function (e) {
    if (filesList.length === 0) {
      message.info('未选中任何图片')
    } else {
      var formData = new FormData()
      filesList.forEach((item) => {
        formData.append('file', item)
      })
      var res = await api.upload(formData)
      console.log(res)
      setFilesList([])
      setSrc([])
      message.success('上传成功')
    }
  }

  var cancelPic = (index) => {
    let filesListTemp = [...filesList]
    let srcTemp = [...src]
    console.log(index)
    filesListTemp.splice(index, 1)
    srcTemp.splice(index, 1)
    setFilesList([...filesListTemp])
    setSrc([...srcTemp])
  }

  return (
    <>
      <div className="container">
        {/* <div>已选图片数filesList：{filesList.length}</div>
        <div>预览图片数src：{src.length}</div> */}
        <div>
          <label className="button" htmlFor="inputFile">
            <div>选择文件</div>
          </label>
          <input
            title="图片上传按钮"
            className="input-upload"
            multiple
            type="file"
            name="file"
            id="inputFile"
            onChange={uploadChange}
          />
          <span> | </span>
          <button className="button" onClick={upload}>
            确认上传
          </button>
        </div>

        <div className="picture-list">
          {src.map((item, index) => (
            <div className="picture-item" key={index}>
              <button
                onClick={() => {
                  cancelPic(index)
                }}
                className="cancel"
              >
                X
              </button>
              <div>{index}</div>
              <img className="img" src={item.src} alt="" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Upload
