import React, { Component } from 'react'
import { RightOutlined, LeftOutlined } from '@ant-design/icons'
import { arrayMoveImmutable } from '../../util/array-move'
import { message, Empty } from 'antd'
import * as api from '../../net-module/api'
import './SortableComponent.css'
import SortableList from '../SortableList/SortableList'
import { Link } from 'react-router-dom'
//拖拽容器
class SortableComponent extends Component {
  state = {
    imgList: [],
    pageIndex: 1,
    service: '',
    total: 0,
  }

  onSortEnd = async ({ oldIndex, newIndex }) => {
    if (oldIndex != newIndex) {
      this.setState(
        ({ imgList }) => ({
          imgList: arrayMoveImmutable(imgList, oldIndex, newIndex),
        }),
        () => {
          let oldSort = this.state.imgList[newIndex].sort
          let newSort = 20 * (this.state.pageIndex - 1) + newIndex + 1
          console.log(`将序号为${oldSort}的图片放到第${newSort}位`)
          console.log(this.state.imgList)
          api.sortPicture({ oldSort, newSort })
        }
      )
    }
  }
  async componentDidMount() {
    if (
      navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
    ) {
      this.setState({ service: 'mobile' })
    } else {
      this.setState({ service: 'pc' })
    } //判断移动端PC端
    // document.body.ondrop = function (event) {
    //   event.preventDefault()
    //   event.stopPropagation()
    // }
    let res = await api.getPicture({ page: this.state.pageIndex })
    console.log(res)
    this.setState({
      total: Math.ceil(res.count / 20),
      imgList: res.pictures,
    }) //页面加载请求第一页图片
  }
  handleFresh = async () => {
    console.log('hanleFresh')
    let res = await api.getPicture({ page: this.state.pageIndex })
    console.log(res)
    console.log(res.pictures)
    if (res.pictures.length === 0 && res.count === 0) {
      console.log('一张图片也没了')
    } else if (res.pictures.length === 0) {
      console.log('当前页没有图片了')
      res = await api.getPicture({ page: this.state.pageIndex - 1 })
      this.setState({
        pageIndex: this.state.pageIndex - 1,
        imgList: [...res.pictures],
        total: Math.ceil(res.count / 20),
      })
    }
    this.setState({
      imgList: [...res.pictures],
      total: Math.ceil(res.count / 20),
    })
  } //图片操作后再次请求图片刷新状态

  pageChange = async (o) => {
    let pageIndex = this.state.pageIndex
    if (pageIndex <= 1 && o === -1) {
      message.info('当前为第一页')
    } else if (pageIndex == this.state.total && o === 1) {
      message.info('当前为最后一页')
    } else {
      this.setState({ pageIndex: pageIndex + o })
      let res = await api.getPicture({ page: pageIndex + o })
      console.log(res)
      this.setState({
        imgList: res.pictures,
      })
    }
  } //图片切换上下页
  gotoPage = async (e) => {
    console.log(e.target.value)
    let page = e.target.value
    console.log(typeof page)
    console.log(isNaN(Number(page, 10)))
    if (!isNaN(Number(page, 10))) {
      page = Number(page)
      if (page > 0 && page <= this.state.total) {
        this.setState({
          pageIndex: page,
        })
        let res = await api.getPicture({ page: page })
        console.log(res)
        this.setState({
          imgList: res.pictures,
        })
      }
    }
  } //图片切到指定页

  handleDeletePic = () => {
    this.setState({ total: this.state.total - 1 })
  } //图片删除后更新图片总数

  handlePageChange = async (o) => {
    let pageIndex = this.state.pageIndex
    let res
    if (pageIndex <= 1 && o === -1) {
      message.info('当前为第一页')
    } else if (pageIndex == this.state.total && o === 1) {
      message.info('当前为最后一页')
    } else {
      this.setState({ pageIndex: pageIndex + o })
      res = await api.getPicture({ page: pageIndex + o })
      console.log(res)
      this.setState({
        imgList: res.pictures,
      })
      return res
    }

  } //接收子组件换页请求

  render() {
    return (
      <div className='sortable-container'>
        <SortableList
          handleFresh={this.handleFresh}
          handlePageChange={this.handlePageChange}
          axis="xy"
          pressDelay={120}
          pageIndex={this.state.pageIndex}
          total={this.state.total}
          imgs={this.state.imgList}
          onSortEnd={this.onSortEnd}
        />
        <div
          style={{ display: this.state.total === 0 ? 'none' : true }}
          className="page-button-group"
        >
          <LeftOutlined onClick={() => this.pageChange(-1)} />
          <span> </span>
          <input
            className="pageNum"
            onChange={this.gotoPage}
            value={this.state.pageIndex}
            placeholder={this.state.pageIndex}
          />
          <span> / {this.state.total} </span>
          <RightOutlined onClick={() => this.pageChange(1)} />
        </div>
        <div
          style={{
            display: this.state.imgList.length === 0 ? true : 'none',
          }}
        >
          <Empty
            imageStyle={{
              height: 100,
            }}
            description={
              <span>
                空空如也 <Link to="/upload">去上传</Link>
              </span>
            }
          ></Empty>
        </div>
      </div>
    )
  }
}

export default SortableComponent
