import React, { Component } from 'react'
import { RightOutlined, LeftOutlined } from '@ant-design/icons'
import { arrayMoveImmutable } from '../../util/array-move'
import { message, Empty } from 'antd'
import * as api from '../../net-module/api'
import './SortableComponent.css'
import SortableList from '../SortableList/SortableList'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
//拖拽容器

function SortableComponent (){
  const [imgList,setImgList] = useState([])
  const [pageIndex, setPageIndex] = useState(1)
  const [total, setTotal] = useState(0)


  useEffect(()=>{
    async function firstGet(){
      let res = await api.getPicture({ page: pageIndex })
      console.log(res)
      setImgList(res.pictures)
      setTotal(Math.ceil(res.count / 20))
    }
    firstGet()
    //页面加载请求第一页图片
  },[])

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    if (oldIndex != newIndex) {
      console.log(oldIndex);
      console.log(newIndex);
      setImgList([...arrayMoveImmutable(imgList, oldIndex, newIndex)])
      let oldSort = imgList[oldIndex].sort
      let newSort = imgList[newIndex].sort
      console.log(`将序号为${oldSort}的图片放到第${newSort}位`)
      console.log(imgList)
      const res = await api.sortPicture({ oldSort, newSort })
      handleFresh()
    }
  }

  const handleFresh = async () => {
    console.log('hanleFresh')
    let res = await api.getPicture({ page: pageIndex })
    console.log(res)
    console.log(res.pictures)
    if (res.pictures.length === 0 && res.count === 0) {
      console.log('一张图片也没了')
    } else if (res.pictures.length === 0) {
      console.log('当前页没有图片了')
      res = await api.getPicture({ page: pageIndex - 1 })
      setPageIndex(pageIndex - 1)
      setImgList([...res.pictures])
      setTotal(Math.ceil(res.count / 20))
    }

    setImgList([...res.pictures])
    setTotal(Math.ceil(res.count / 20))
  } //图片操作后再次请求图片刷新状态

  const pageChange = async (o) => {
    if (pageIndex <= 1 && o === -1) {
      message.info('当前为第一页')
    } else if (pageIndex == total && o === 1) {
      message.info('当前为最后一页')
    } else {
      setPageIndex(pageIndex + o)
      let res = await api.getPicture({ page: pageIndex + o })
      console.log(res)
      setImgList(res.pictures)
    }
  } //图片切换上下页
  const gotoPage = async (e) => {
    console.log(e.target.value)
    let page = e.target.value
    console.log(typeof page)
    console.log(isNaN(Number(page, 10)))
    if (!isNaN(Number(page, 10))) {
      page = Number(page)
      if (page > 0 && page <= total) {
        setPageIndex(page)
        let res = await api.getPicture({ page: page })
        console.log(res)
        setImgList(res.pictures)
      }
    }
  } //图片切到指定页

  const handleDeletePic = () => {
    this.setState({ total: this.state.total - 1 })
  } //图片删除后更新图片总数

  const handlePageChange = async (o) => {
    let res
    if (pageIndex <= 1 && o === -1) {
      message.info('当前为第一页')
    } else if (pageIndex == total && o === 1) {
      message.info('当前为最后一页')
    } else {
      setPageIndex(pageIndex + o)
      res = await api.getPicture({ page: pageIndex + o })
      console.log(res)
      setImgList(res.pictures)
      return res
    }

  } //接收子组件换页请求


  return (
    <div className='sortable-container'>
      <SortableList
        handleFresh={handleFresh}
        handlePageChange={handlePageChange}
        axis="xy"
        pressDelay={120}
        pageIndex={pageIndex}
        total={total}
        imgs={imgList}
        onSortEnd={onSortEnd}
      />
      <div
        style={{ display: total === 0 ? 'none' : true }}
        className="page-button-group"
      >
        <LeftOutlined onClick={() => pageChange(-1)} />
        <span> </span>
        <input
          className="pageNum"
          onChange={gotoPage}
          value={pageIndex}
          placeholder={pageIndex}
        />
        <span> / {total} </span>
        <RightOutlined onClick={() => pageChange(1)} />
      </div>
      <div
        style={{
          display: imgList.length === 0 ? true : 'none',
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

export default SortableComponent
