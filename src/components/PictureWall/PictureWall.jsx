import React, { Component } from 'react'
import './PictureWall.css'
import * as api from '../../net-module/api'
import { Modal, Button, message, Spin, Empty } from 'antd'
import { RightOutlined, LeftOutlined } from '@ant-design/icons'
import debounce from 'lodash/debounce'
import Img from '../Img/Img'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
class EachItem extends Component {
  //空白列组件
  openModal(id) {
    this.props.handleOpenModal(id)
  }
  render() {
    if (this.props.pics.length !== 0) {
      return (
        <div className='line-container'>
          {this.props.pics.map((item) => {
            return (
              <div key={item.id} onClick={() => this.openModal(item.id)}>
                <Img src={item.low}
                  alt={""}
                  style={{ margin: '10px 10px 10px 10px', height: this.props.service == 'mobile' ? 130 : 200, marginLeft: 20 }}></Img>
              </div>
            )
          })}
        </div>
      )
    }
  }
}

class PictureWall extends Component {
  constructor() {
    super()
    this.state = {
      line1: [],
      line2: [],
      line3: [],
      line4: [],
      imgList: [], // 图片列表
      page: 1,
      total: 0,
      isShowPic: false,  //控制弹框是否显示
      showPic: '', //对话框大图
      showPicIndex: '', //对话框大图所在下标
      loading: false, //控制底部加载中是否显示
      service: '',  //当前设备 pc or mobile
    }
    this.scrollChange = debounce(this.scrollBottom, 500, {
      'leading': true,
      'trailing': false
    })
  }

  

  scrollBottom = () => {
    return new Promise((resolve, reject) => {
      if (this.state.loading == false) {
        this.setState({ loading: true })
        setTimeout(() => {
          console.log('触发请求');
          api
            .getPicture({ page: this.state.page + 1, isShow: true })
            .then((res) => {
              console.log(res)
              if (res.pictures.length === 0) {
                message.info('图片已全部加载完了哦')
              }
              this.setState({ imgList: [...this.state.imgList, ...res.pictures] })
              this.setState({ page: this.state.page + 1 })
              this.setState({ loading: false })
              let { line1, line2, line3, line4 } = this.state
              res.pictures.forEach((item, index) => {
                if (this.state.service == 'mobile') {
                  if (index % 2 === 0) {
                    line1.push(item)
                  } else if (index % 2 === 1) {
                    line2.push(item)
                  }
                } else {
                  if (index % 4 === 0) {
                    line1.push(item)
                  } else if (index % 4 === 1) {
                    line2.push(item)
                  } else if (index % 4 === 2) {
                    line3.push(item)
                  } else if (index % 4 === 3) {
                    line4.push(item)
                  }
                }
              })
              this.setState({
                line1: line1,
                line2: line2,
                line3: line3,
                line4: line4
              }, () => {
                resolve()
              })
            })
        }, 1000)
      }
    })
  }

  handleOpenModal = (id) => {
    let index = this.state.imgList.findIndex(
      (item) => item.id === id
    )
    this.setState(
      { showPic: this.state.imgList[index], showPicIndex: index },
      () => {
        this.setState({ isShowPic: true })
        window.removeEventListener('scroll', this.handleScroll, true) //打开弹框时取消滚动条监听
      }
    )
  }

  handleCancel = () => {
    this.setState({ isShowPic: false }, () => {
      window.addEventListener('scroll', this.handleScroll, true)  //关闭弹框时重新开启滚动条监听
    })
  }

  changePic = (o) => {
    if (this.state.showPicIndex >= this.state.imgList.length - 1 && o === 1) {
      if (this.state.page === this.state.total) {
        message.info('当前为最后一张图片')
      } else {
        this.scrollBottom().then(res => {
          this.setState({
            showPic: this.state.imgList[this.state.showPicIndex + o],
            showPicIndex: this.state.showPicIndex + o,
          })
        })
      }
    } else if (this.state.showPicIndex <= 0 && o === -1) {
      if (this.state.showPicIndex === 0) {
        message.info('当前为第一张图片')
      }
    } else {
      this.setState({
        showPic: this.state.imgList[this.state.showPicIndex + o],
        showPicIndex: this.state.showPicIndex + o,
      })
    }
  }

  insertImage = (imgList) => {
    let { line1, line2, line3, line4 } = this.state
    console.log();
    imgList.forEach((item, index) => {
      if (this.state.service == 'mobile') {
        if (index % 2 === 0) {
          line1.push(item)
        } else if (index % 2 === 1) {
          line2.push(item)
        }
      } else {
        if (index % 4 === 0) {
          line1.push(item)
        } else if (index % 4 === 1) {
          line2.push(item)
        } else if (index % 4 === 2) {
          line3.push(item)
        } else if (index % 4 === 3) {
          line4.push(item)
        }
      }
    })
    this.setState({
      line1: line1,
      line2: line2,
      line3: line3,
      line4: line4
    })
  }

  handleScroll = () => {
    let clientHeight = document.documentElement.clientHeight //可视区域高度
    let scrollTop = document.documentElement.scrollTop //滚动条滚动高度
    let scrollHeight = document.documentElement.scrollHeight //滚动内容高度
    if (clientHeight + scrollTop === scrollHeight) {
      console.log('触底')
      this.scrollChange()
    }
  }

  gotoUpload = () => {
    useNavigate('/upload')
  }

  componentDidMount() {
    if (
      navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
    ) {
      this.setState({ service: 'mobile' })
    } else {
      this.setState({ service: 'pc' })
    }  //判断设备为PC端还是移动端
    window.addEventListener('scroll', this.handleScroll, true)
    api.getPicture({ page: 1, isShow: true }).then((res) => {
      console.log(res)
      this.setState({ imgList: res.pictures, total: res.total }, () => {
        this.insertImage(res.pictures)
        //监听滚动事件
      })
    })
  }
  componentWillUnmount() {
    console.log('离开主页')
    window.removeEventListener('scroll', this.handleScroll, true) //离开主页取消滚动条监听
  }

  render() {
    return (
      <div>
        <div id="scrollContainer" className="scroll-container">
          <div className="leftContent">
            <EachItem
              handleOpenModal={this.handleOpenModal}
              id={0}
              pics={this.state.line1}
              service={this.state.service}
            />
            <EachItem
              handleOpenModal={this.handleOpenModal}
              id={1}
              pics={this.state.line2}
              service={this.state.service}
            />
            <EachItem
              handleOpenModal={this.handleOpenModal}
              id={2}
              pics={this.state.line3}
              service={this.state.service}
            />
            <EachItem
              handleOpenModal={this.handleOpenModal}
              id={3}
              pics={this.state.line4}
              service={this.state.service}
            />
          </div>
        </div>

        <Spin size="large" spinning={this.state.loading}>
          <div style={{ height: 40 }}></div>
        </Spin>
        <div style={{ height: '20px' }}></div>
        <Modal
          className="modal"
          width={this.state.service === 'mobile' ? '100vw' : '800px'}
          title="查看图片"
          align="center"
          visible={this.state.isShowPic}
          onCancel={this.handleCancel}
          footer={[]}
        >
          <div className="modal-container">
            <div className="modal-button">
              <Button onClick={() => this.changePic(-1)}>
                <LeftOutlined />
              </Button>
              <span> | </span>
              <Button onClick={() => this.changePic(1)}>
                <RightOutlined />
              </Button>
            </div>
            <div className="show-pic">
              <img src={this.state.showPic.high} alt="" />
            </div>
          </div>
        </Modal>
        <div style={{display:this.state.imgList.length === 0 ? true : 'none'}}>
          <Empty
            imageStyle={{
              height: 100,
            }}
            description={
              <span>
                空空如也 <Link to="/upload">去上传</Link>
              </span>
            }
          >
          </Empty>
        </div>
        
      </div>
    )
  }
}

export default PictureWall
