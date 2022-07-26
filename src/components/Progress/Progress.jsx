import React from 'react'
import 'antd/dist/antd.css'
import * as api from '../../net-module/api'
import './Progress.css'
import axios from 'axios'
import { Spin } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

axios.defaults.withCredentials = true

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      finished: false,
      baifenbi: 0,
      url: '',
      id: 0,
      isShow: true,
    }
  }
  //文件上传改变的时候
  configs = {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
    onUploadProgress: (progress) => {
      console.log(progress)
      let { loaded } = progress
      console.log(loaded, this.props.file.size)
      let baifenbi =
        loaded < this.props.file.size
          ? ((loaded / this.props.file.size) * 100).toFixed(2)
          : 100
      this.setState({
        baifenbi,
      })
    },
  }

  handleUpload = async () => {
    const formData = new FormData()
    formData.append('files', this.props.file)
    //请求
    setTimeout(async() => {
      let res = await api.upload(formData, this.configs)
      //预览图
      const fr = new FileReader()
      fr.readAsDataURL(this.props.file)
      const _this = this
      fr.onload = function (readRes) {
        _this.setState({
          url: readRes.target.result,
        })
      }
      this.setState({
        baifenbi: 100,
        finished: true,
        id: res[0].id,
      })
        .finally((log) => {
          //  console.log(log);
        })
    }, Math.random(1) * 500)
  } //上传图片

  handleDelete = async () => {
    console.log(this.state.id)
    let res = await api.deletePicture({ id: this.state.id })
    this.setState({ isShow: false })
  } //预览图片删除

  componentDidMount() {
    if (this.state.finished === false) {
      this.handleUpload()
    }
  }

  render() {
    if (this.state.isShow) {
      return (
        <div name="progress" className="progress-container">
          <Spin
            style={{ transform: 'translateY(3px)' }}
            spinning={!this.state.finished}
          />
          <div className="img-preLook">
            <img className='pre-img-container'
              id="preImg"
              src={this.state.url}
            ></img>
          </div>
          <div
            style={{ width: `${this.state.baifenbi}px` }}
            className="progress"
          ></div>
          {this.state.baifenbi + '%'}
          <DeleteOutlined onClick={this.handleDelete} className="delete-icon" />
        </div>
      )
    }
  }
}

export default App
