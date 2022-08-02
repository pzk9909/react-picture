import React, { Component } from 'react'
import './PictureWall.css'
import * as api from '../../net-module/api'
import { Modal, Button, message, Spin, Empty } from 'antd'
import { RightOutlined, LeftOutlined } from '@ant-design/icons'
import debounce from 'lodash/debounce'
import Img from '../Img/Img'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import { getClientHeight, getClientWidth } from '../../util/getClient'
import isMobile from '../../util/isMobile'
import { useState, useEffect, useCallback } from 'react'
import { useRef } from 'react'


function EachItem({ pics, handleOpenModal }) {

  const openModal = (id) => {
    handleOpenModal(id)
  }  //打开图片预览弹窗

  return (
    <>
      <div className='line-container' style={{ width: isMobile() ? '40%' : '20%' }}>
        {pics.map((item) => {
          return (
            <div key={item.id}>
              <Tooltip placement="topRight" title="点击预览" >
                <div className='pic-item-container' onClick={() => openModal(item.id)}>
                  <Img src={item.low}
                    alt={""}
                    style={{ margin: '10px 0 10px 0', height: isMobile() ? 130 : 260 }}></Img>
                </div>
              </Tooltip>
            </div>
          )
        })}
      </div>
    </>
  )
}

function PictureWalll() {
  const line1 = useRef([])
  const line2 = useRef([])
  const line3 = useRef([])
  const line4 = useRef([])
  const imgs = useRef([])
  const page = useRef(1)
  const [total, setTotal] = useState(0)
  const [isShowPic, setIsShowPic] = useState(false)
  const [showPic, setShowPic] = useState('')
  const [showPicIndex, setShowPicIndex] = useState([])
  const [loading, setLoading] = useState(false)

  const scrollBottom = async () => {
    console.log(page.current);
    if (loading == false) {
      setLoading(true)
      setTimeout(async () => {
        console.log('触发请求');
        let res = await api.getPicture({ page: page.current + 1, isShow: true })
        console.log(res)
        if (res.pictures.length === 0) {
          window.scrollTo(0, document.documentElement.scrollTop - 80)
          message.info('图片已全部加载完了哦')
        }
        console.log(imgs.current);
        imgs.current = [...imgs.current, ...res.pictures]
        console.log(imgs.current);
        // setPage(page + 1)
        page.current += 1
        setLoading(false)
        insertImage(res.pictures)
      }, 1000)
    }
  }  //滚动条滚动到底部请求下一页图片

  const scrollChange = useCallback(debounce(scrollBottom, 1500, {
    'leading': true,
    'trailing': false
  }), []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true)  //监听滚动事件
    const firstGet = async () => {
      let res = await api.getPicture({ page: 1, isShow: true })
      console.log(res)
      imgs.current = [...res.pictures]
      console.log(imgs.current);
      setTotal(res.total)
      insertImage(res.pictures)
    }
    firstGet()
    return () => {
      console.log('离开主页')
      window.removeEventListener('scroll', handleScroll, true) //离开主页取消滚动条监听
    }
  }, [])



  const handleOpenModal = (id) => {
    console.log(getClientHeight());
    let index = imgs.current.findIndex(
      (item) => item.id === id
    )
    setShowPic(imgs.current[index])
    setShowPicIndex(index)
    setIsShowPic(true)
    window.removeEventListener('scroll', handleScroll, true) //打开弹框时取消滚动条监听
  }  //打开图片预览弹窗

  const handleCancel = () => {
    setIsShowPic(false)
    window.addEventListener('scroll', handleScroll, true)  //关闭弹框时重新开启滚动条监听
  }  //关闭图片预览弹窗

  const changePic = (o) => {
    if (showPicIndex >= imgs.current.length - 1 && o === 1) {
      message.info('当前为最后一张图片')
    } else if (showPicIndex <= 0 && o === -1) {
      if (showPicIndex === 0) {
        message.info('当前为第一张图片')
      }
    } else {
      setShowPic(imgs.current[showPicIndex + o])
      setShowPicIndex(showPicIndex + o)
    }
  }  //图片预览弹窗切换上下张图片

  const insertImage = (imgList) => {
    let tmpLine1 = []
    let tmpLine2 = []
    let tmpLine3 = []
    let tmpLine4 = []
    imgList.forEach((item, index) => {
      if (isMobile()) {
        if (index % 2 === 0) {
          tmpLine1.push(item)
        } else if (index % 2 === 1) {
          tmpLine2.push(item)
        }
      } else {
        if (index % 4 === 0) {
          tmpLine1.push(item)
        } else if (index % 4 === 1) {
          tmpLine2.push(item)
        } else if (index % 4 === 2) {
          tmpLine3.push(item)
        } else if (index % 4 === 3) {
          tmpLine4.push(item)
        }
      }
    })
    line1.current = ([...line1.current,...tmpLine1])
    line2.current = ([...line2.current, ...tmpLine2])
    line3.current = ([...line3.current, ...tmpLine3])
    line4.current = ([...line4.current, ...tmpLine4])
  }  //向图片列中一次插入图片

  const handleScroll = () => {
    let clientHeight = document.documentElement.clientHeight //可视区域高度
    let scrollTop = document.documentElement.scrollTop //滚动条滚动高度
    let scrollHeight = document.documentElement.scrollHeight //滚动内容高度
    if (clientHeight + scrollTop === scrollHeight) {
      console.log('触底')
      scrollChange()
    }
  }  //判断滚动条是否触底
  return (
    <div id="scrollContainer" className="scroll-container">
      <div className="scroll-content">
        {[line1.current, line2.current, line3.current, line4.current].map((item, index) => {
          return (<EachItem
            handleOpenModal={handleOpenModal}
            id={index}
            key={index}
            pics={item}
          />)
        })}
      </div>
      <div style={{ display: loading === true ? true : 'none' }} className='spin-container'>
        <Spin size="large" spinning={loading}>
          <div style={{ height: '40px' }}>
          </div>
        </Spin>
      </div>

      <Modal
        className="modal"
        style={{ top: isMobile() ? '15%' : 0 }}
        bodyStyle={{ height: isMobile() ? '' : getClientHeight() - 100 }}
        width={isMobile() ? '100vw' : getClientWidth()}
        title="查看图片"
        align="center"
        visible={isShowPic}
        onCancel={handleCancel}
        footer={[]}
      >
        <div className="modal-container">
          <div className="modal-button">
            <Button disabled={showPicIndex === 0} onClick={() => changePic(-1)}>
              <LeftOutlined />上一张
            </Button>
            <Button disabled={showPicIndex === imgs.current.length - 1} onClick={() => changePic(1)}>
              下一张<RightOutlined />
            </Button>
          </div>
          <div className="show-pic" style={{ width: isMobile() ? '100%' : '', height: isMobile() ? '' : '100%' }}>
            <img src={showPic.high} alt="" />
          </div>
        </div>
      </Modal>
      <div style={{ display: imgs.current.length === 0 ? true : 'none' }}>
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























































































































class PictureWall extends Component {
  constructor() {
    super()
    this.state = {
      line1: [],
      line2: [],
      line3: [],
      line4: [], //图片列
      imgList: [], // 图片列表
      page: 1,
      total: 0,
      isShowPic: false,  //控制弹框是否显示
      showPic: '', //对话框大图
      showPicIndex: '', //对话框大图所在下标
      loading: false, //控制底部加载中是否显示
    }
    this.scrollChange = debounce(this.scrollBottom, 500, {
      'leading': true,
      'trailing': false
    })
  }



  scrollBottom = async () => {
    if (this.state.loading == false) {
      this.setState({ loading: true })
      setTimeout(async () => {
        console.log('触发请求');
        let res = await api.getPicture({ page: this.state.page + 1, isShow: true })
        console.log(res)
        if (res.pictures.length === 0) {
          window.scrollTo(0, document.documentElement.scrollTop - 80)
          message.info('图片已全部加载完了哦')
        }
        this.setState({ imgList: [...this.state.imgList, ...res.pictures] })
        this.setState({ page: this.state.page + 1 })
        this.setState({ loading: false })
        let { line1, line2, line3, line4 } = this.state
        res.pictures.forEach((item, index) => {
          if (isMobile()) {
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
      }, 1000)
    }
  }  //滚动条滚动到底部请求下一页图片

  handleOpenModal = (id) => {
    console.log(getClientHeight());
    var windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
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
  }  //打开图片预览弹窗

  handleCancel = () => {
    this.setState({ isShowPic: false }, () => {
      window.addEventListener('scroll', this.handleScroll, true)  //关闭弹框时重新开启滚动条监听
    })
  }  //关闭图片预览弹窗

  changePic = (o) => {
    if (this.state.showPicIndex >= this.state.imgList.length - 1 && o === 1) {
      message.info('当前为最后一张图片')
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
  }  //图片预览弹窗切换上下张图片

  insertImage = (imgList) => {
    let { line1, line2, line3, line4 } = this.state
    console.log();
    imgList.forEach((item, index) => {
      if (isMobile()) {
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
  }  //向图片列中一次插入图片

  handleScroll = () => {
    let clientHeight = document.documentElement.clientHeight //可视区域高度
    let scrollTop = document.documentElement.scrollTop //滚动条滚动高度
    let scrollHeight = document.documentElement.scrollHeight //滚动内容高度
    if (clientHeight + scrollTop === scrollHeight) {
      console.log('触底')
      this.scrollChange()
    }
  }  //判断滚动条是否触底

  async componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, true)  //监听滚动事件
    let res = await api.getPicture({ page: 1, isShow: true })
    console.log(res)
    this.setState({ imgList: res.pictures, total: res.total }, () => {
      this.insertImage(res.pictures)
    })
  }
  componentWillUnmount() {
    console.log('离开主页')
    window.removeEventListener('scroll', this.handleScroll, true) //离开主页取消滚动条监听
  }

  render() {
    return (
      <div id="scrollContainer" className="scroll-container">
        <div className="scroll-content">
          {[this.state.line1, this.state.line2, this.state.line3, this.state.line4].map((item, index) => {
            return (<EachItem
              handleOpenModal={this.handleOpenModal}
              id={index}
              key={index}
              pics={item}
            />)
          })}
        </div>
        <div style={{ display: this.state.loading === true ? true : 'none' }} className='spin-container'>
          <Spin size="large" spinning={this.state.loading}>
            <div style={{ height: '40px' }}>
            </div>
          </Spin>
        </div>

        <Modal
          className="modal"
          style={{ top: isMobile() ? '15%' : 0 }}
          bodyStyle={{ height: isMobile() ? '' : getClientHeight() - 100 }}
          width={isMobile() ? '100vw' : getClientWidth()}
          title="查看图片"
          align="center"
          visible={this.state.isShowPic}
          onCancel={this.handleCancel}
          footer={[]}
        >
          <div className="modal-container">
            <div className="modal-button">
              <Button disabled={this.state.showPicIndex === 0} onClick={() => this.changePic(-1)}>
                <LeftOutlined />上一张
              </Button>
              <Button disabled={this.state.showPicIndex === this.state.imgList.length - 1} onClick={() => this.changePic(1)}>
                下一张<RightOutlined />
              </Button>
            </div>
            <div className="show-pic" style={{ width: isMobile() ? '100%' : '', height: isMobile() ? '' : '100%' }}>
              <img src={this.state.showPic.high} alt="" />
            </div>
          </div>
        </Modal>
        <div style={{ display: this.state.imgList.length === 0 ? true : 'none' }}>
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

export default PictureWalll
