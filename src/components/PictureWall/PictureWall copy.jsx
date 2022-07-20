import React, { Component } from 'react'
import './PictureWall.css'
import * as api from '../../net-module/api'
import { Modal, Button, message, Spin } from 'antd'
import { RightOutlined, LeftOutlined } from '@ant-design/icons'
import debounce from 'lodash/debounce'
class EachItem extends Component {
  //空白列组件
  render() {
    return (
      <div>
        <div className="item-line-content"></div>{' '}
      </div>
    )
  }
}

class PictureWall extends Component {
  constructor() {
    super()
    this.state = {
      componentList: [], // 动态添加图片列容器
      imgList: [], // 图片列表
      page: 1,
      isShowPic: false,
      showPic: '', //对话框大图
      showPicIndex: '', //对话框大图所在下标
      loading: false,
      service: '',
    }
    this.scrollChange = debounce(this.scrollBottom, 1000, {
      'leading': true,
      'trailing': false
    })
  }

  scrollBottom = () => {
    if(this.state.loading == false){
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
            this.insertImage(res.pictures)
          })
      }, 1000)
    }
    
  }

  openModal = (e) => {
    console.log(e.target)
    console.log(this.state.imgList)
    let index = this.state.imgList.findIndex(
      (item) => item.low === e.target.currentSrc
    )
    console.log(index)
    // this.setState({ showPicIndexSrc: this.state.imgList[index].high }, () => {
    //   this.setState({ isShowPic: true })
    //   console.log(this.state.showPicIndexSrc)
    // })
    this.setState(
      { showPic: this.state.imgList[index], showPicIndex: index },
      () => {
        this.setState({ isShowPic: true })
        console.log(this.state.showPic)
      }
    )
  }

  changePic = (o) => {
    console.log(this.state.showPicIndex)
    console.log(this.state.imgList.length)
    if (this.state.showPicIndex >= this.state.imgList.length - 1 && o === 1) {
      message.info('当前为最后一张图片')
    } else if (this.state.showPicIndex <= 0 && o === -1) {
      message.info('当前为第一张图片')
    } else {
      this.setState({
        showPic: this.state.imgList[this.state.showPicIndex + o],
        showPicIndex: this.state.showPicIndex + o,
      })
    }
  }

  handleCancel = () => {
    this.setState({ isShowPic: false })
  }
  // 获取最小列的dom
  minDiv = () => {
    let item = document.getElementsByClassName('item-line-content')
    let itemHeight = []
    for (let i = 0; i < item.length; i++) {
      let eachHeight = this.calcHeight(item[i].children)
      itemHeight.push(eachHeight)
    }
    let minIndex = 0
    let minValue = itemHeight[0]
    for (let j = 0; j < itemHeight.length; j++) {
      if (minValue > itemHeight[j]) {
        minIndex = j
        minValue = itemHeight[j]
      }
    }
    // console.log('item[minIndex]', item[minIndex])
    return item[minIndex]
  }
  // 计算每列的高度
  calcHeight = (domNode) => {
    // console.log(domNode)
    if (domNode == null || domNode.length == 0 || domNode == undefined) {
      return 0
    }
    let eachItemHeight = 0
    for (let i = 0; i < domNode.length; i++) {
      let imgNode = domNode[i].getElementsByClassName('wrap-image')[0].children
      eachItemHeight = eachItemHeight + imgNode[0].height + 200
    }

    return eachItemHeight
  }

  // 向dom节点中插入图片
  insertImage = (imgList) => {
    imgList.forEach((item) => {
      if (item.isShow === 0) {
      } else {
        let mDiv = this.minDiv()
        let itemContent = document.createElement('div')
        let wrapImage = document.createElement('div')
        let wrapBottom = document.createElement('div')
        let imgId = document.createElement('div')
        let bigimg = document.createElement('img')
        itemContent.setAttribute('class', 'item-content')
        wrapImage.setAttribute('class', 'wrap-image')
        wrapImage.addEventListener('click', this.openModal)
        wrapBottom.setAttribute('class', 'wrap-bottom')
        imgId.setAttribute('class', 'imgID')
        bigimg.setAttribute('src', item['low'])
        wrapImage.appendChild(bigimg)
        itemContent.appendChild(wrapImage)
        imgId.append(item.id)
        wrapBottom.appendChild(imgId)
        itemContent.appendChild(wrapBottom)
        mDiv.appendChild(itemContent)
      }
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

  componentDidMount() {
    if (
      navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
    ) {
      this.setState({ service: 'mobile' })
    } else {
      this.setState({ service: 'pc' })
    }
    api.getPicture({ page: 1, isShow: true }).then((res) => {
      console.log(res)
      this.setState({ imgList: res.pictures }, () => {
        this.responseType()
      })
    })
  }
  componentWillUnmount() {
    console.log('离开主页')
    window.removeEventListener('scroll', this.handleScroll, true)
  }
  // 响应式设置
  responseType = () => {
    // let clientWidth = document.body.clientWidth
    let componentList = []
    // if (clientWidth < 480) {
    //   componentList = new Array(1)
    //     .fill(undefined)
    //     .map(() => (
    //       <EachItem
    //         key={new Date().getTime() + Math.floor(Math.random() * 1000)}
    //       />
    //     ))
    // } else if (clientWidth < 900) {
    //   componentList = new Array(2)
    //     .fill(undefined)
    //     .map(() => (
    //       <EachItem
    //         key={new Date().getTime() + Math.floor(Math.random() * 1000)}
    //       />
    //     ))
    // } else if (clientWidth < 1200) {
    //   componentList = new Array(3)
    //     .fill(undefined)
    //     .map(() => (
    //       <EachItem
    //         key={new Date().getTime() + Math.floor(Math.random() * 1000)}
    //       />
    //     ))
    // } else {
    if (this.state.service === 'mobile') {
      //手机
      console.log('移动')
      setTimeout(() => {
        let elements = document.getElementsByClassName('item-line-content')
        Array.prototype.forEach.call(elements, function (element) {
          console.log(element)
          element.style.width = '35vw'
        })
      }, 0)
      componentList = new Array(2)
        .fill(undefined)
        .map(() => (
          <EachItem
            key={new Date().getTime() + Math.floor(Math.random() * 1000)}
          />
        ))
    } else {
      //电脑
      console.log('PC')
      console.log('4列')
      componentList = new Array(4)
        .fill(undefined)
        .map(() => (
          <EachItem
            key={new Date().getTime() + Math.floor(Math.random() * 1000)}
          />
        ))
    }

    // }
    this.setState({
      componentList: componentList,
    })
    setTimeout(() => {}, 1000)
    const { imgList } = this.state
    setTimeout(() => {
      this.insertImage(imgList)
      //监听滚动事件
      window.addEventListener('scroll', this.handleScroll, true)
    }, 500)
  }

  render() {
    const { componentList } = this.state
    // console.log("componentList",componentList)
    return (
      <div>
        {/* <div>{this.state.imgList.length}</div> */}

        <div id="scrollContainer" className="wrapBody">
          <div className="leftContent"> {componentList} </div>
        </div>

        <Spin size="large" spinning={this.state.loading}>
          <div style={{ height: 40 }}></div>
        </Spin>
        <Modal
          className="modal"
          width={this.state.service === 'mobile' ? '100vw' : '800px'}
          title="查看图片"
          align="center"
          visible={this.state.isShowPic}
          onCancel={this.handleCancel}
        >
          <div className="modal-container">
            <div className="modal-button">
              <Button onClick={() => this.changePic(-1)}>
                <LeftOutlined />
              </Button>
              <Button onClick={() => this.changePic(1)}>
                <RightOutlined />
              </Button>
            </div>
            <div className="show-pic">
              <img src={this.state.showPic.high} alt="" />
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default PictureWall
