import React, { Component} from 'react'
import {
  RightOutlined,
  LeftOutlined,
} from '@ant-design/icons'
import { arrayMoveImmutable } from 'array-move'
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
    total: 0
  }
  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(
      ({ imgList }) => ({
        imgList: arrayMoveImmutable(imgList, oldIndex, newIndex),
      }),
      () => {
        let oldSort = this.state.imgList[newIndex].sort
        let newSort = 20 * (this.state.pageIndex - 1) + newIndex + 1
        console.log(`将序号为${oldSort}的图片放到第${newSort}位`)
        console.log(this.state.imgList)
        api.sortPicture({ oldSort, newSort }).then((res) => {
          console.log(res)
        })
      }
    )
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
    // document.body.ondrop = function (event) {
    //   event.preventDefault()
    //   event.stopPropagation()
    // }
    api.getPicture({ page: this.state.pageIndex }).then((res) => {
      console.log(res)
      this.setState({
        total: Math.ceil(res.count / 20),
        imgList: res.pictures
      })
    })
  }
  handleFresh = () => {
    console.log('hanleFresh')
    api.getPicture({ page: this.state.pageIndex }).then((res) => {
      console.log(res)
      console.log(res.pictures);
      if (res.pictures.length === 0 && res.count === 0){
        console.log('一张图片也没了');
      } else if (res.pictures.length === 0){
        console.log('当前页没有图片了');
        api.getPicture({ page: this.state.pageIndex - 1 }).then(res=>{
          this.setState({
            pageIndex: this.state.pageIndex - 1,
            imgList: [...res.pictures],
            total: Math.ceil(res.count / 20)
          })
        })
      }
      this.setState({
        imgList: [...res.pictures],
        total: Math.ceil(res.count / 20)
      })
    })
  }

  
  pageChange = (o) => {
    return new Promise((resolve, reject) => {
      let pageIndex = this.state.pageIndex
      if (pageIndex <= 1 && o === -1) {
        message.info('当前为第一页')
      } else if (pageIndex == this.state.total && o === 1) {
        message.info('当前为最后一页')
      } else {
        this.setState({ pageIndex: pageIndex + o })
        api.getPicture({ page: pageIndex + o }).then((res) => {
          console.log(res)
          this.setState({
            imgList: res.pictures
          },()=>{
            resolve()
          })
        })
      }
    })
  }
  gotoPage = (e) => {
    console.log(e.target.value);
    let page = e.target.value
    console.log(typeof page);
    console.log(isNaN(Number(page, 10)));
    if (!isNaN(Number(page, 10))) {
      page = Number(page)
      if (page > 0 && page <= this.state.total) {
        this.setState({
          pageIndex: page
        })
        api.getPicture({ page: page }).then((res) => {
          console.log(res)
          this.setState({
            imgList: res.pictures
          })
        })
      }
    }
  }

  handleDeletePic = () => {
    this.setState({ total: this.state.total - 1 })
  }

  handlePageChange = (o)=>{
    this.pageChange(o)
  }

  render() {
    return (
      <div>
        <SortableList
          handleFresh={this.handleFresh}
          handlePageChange={this.pageChange}
          axis="xy"
          pressDelay={150}
          pageIndex={this.state.pageIndex}
          total={this.state.total}
          imgs={this.state.imgList}
          onSortEnd={this.onSortEnd}
        />
        <div style={{display : this.state.total === 0 ? 'none' : true}} className='page-button-group'>
          <LeftOutlined onClick={() => this.pageChange(-1)} />
          <span> </span>
          <input className='pageNum' onChange={this.gotoPage} value={this.state.pageIndex} placeholder={this.state.pageIndex} />
          <span> / {this.state.total} </span>
          <RightOutlined onClick={() => this.pageChange(1)} />
        </div>
        <div style={{ marginTop:'60px' , display: this.state.imgList.length === 0 ? true : 'none' }}>
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

export default SortableComponent
