import React, { useState } from 'react'
import './SortableList.css'
import { SortableContainer } from 'react-sortable-hoc'
import {
  CloseCircleOutlined,
  CheckCircleOutlined,
  RightOutlined,
  LeftOutlined,
} from '@ant-design/icons'
import { Button, message, Modal } from 'antd'
import * as api from '../../net-module/api'
import SortableItem from '../SortableItem/SortableItem'
import { useRef } from 'react'
import loadingImg from '../../assets/loading.gif';
//可拖拽列表
const SortableList = SortableContainer((props) => {
  const [isShowPic, setIsShowPic] = useState(false)
  const [showPicIndex, setShowPicIndex] = useState(0)
  const modalImg = useRef(null)
  const handleAcceptPic = (id) => {
    api.acceptPicture({ id }).then((res) => {
      message.success('通过图片成功')
      props.handleFresh()
    })
  } //图片审核通过
  const handleRejectPic = (id) => {
    api.rejectPicture({ id }).then((res) => {
      message.success('拒绝图片成功')
      props.handleFresh()
    })
  } //图片审核拒绝
  const handleDeletePic = () => {
    message.success('删除图片成功')
    props.handleFresh()
  } //图片删除
  const handleGoTopPic = () => {
    message.success('置顶图片成功')
    props.handleFresh()
  } //图片置顶
  const handleShowPic = (id) => {
    let index = props.imgs.findIndex((item) => item.id === id)
    setShowPicIndex(index)
    setIsShowPic(true)
  } //打开预览图片弹窗
  const handleCancel = () => {
    props.handleFresh()
    setShowPicIndex(0)
    setIsShowPic(false)
  } //关闭预览图片弹窗
  const changePic = async (o) => {
    if (showPicIndex >= props.imgs.length - 1 && o === 1) {
      if (props.pageIndex === props.total) {
        message.info('当前为最后一张图片')
      } else {
        let res = await props.handlePageChange(1)
        setShowPicIndex(0)
      }
    } else if (showPicIndex <= 0 && o === -1) {
      if (props.pageIndex === 1) {
        message.info('当前为第一张图片')
      } else {
        let res = await props.handlePageChange(-1)
        setShowPicIndex(19)
      }
    } else {
      setShowPicIndex(showPicIndex + o)
    }
  } //图片预览弹窗切换上下张图片

  if (props.imgs.length <= 0) {
    return <div></div>
  } else {
    return (
      <div>
        <div className="img-list-container">
          {props.imgs.map((value, index) => (
            <SortableItem
              handleAcceptPic={handleAcceptPic}
              handleRejectPic={handleRejectPic}
              handleDeletePic={handleDeletePic}
              handleGoTopPic={handleGoTopPic}
              handleShowPic={handleShowPic}
              key={value.id}
              index={index}
              value={value}
            />
          ))}
        </div>
        <Modal
          title="查看图片"
          align="center"
          style={{ top: 0 }}
          width={1000}
          visible={isShowPic}
          onCancel={handleCancel}
          footer={<div></div>}
        >
          <div className="modal-container">
            <div className="modal-button">
              <span style={{ display: showPicIndex === 0 && props.pageIndex === 1 ? 'none' : true, }}>
                <span style={{ display: showPicIndex === 0 ? true : 'none' }}>
                  <Button onClick={() => changePic(-1)}>上一页</Button>
                </span>
                <span style={{ display: showPicIndex !== 0 ? true : 'none' }}>
                  <Button onClick={() => changePic(-1)}>
                    <LeftOutlined />
                  </Button>
                </span>
              </span>
              <Button
                disabled={props.imgs[showPicIndex].isShow === 1 ? true : false}
                onClick={() => handleAcceptPic(props.imgs[showPicIndex].id)}
                icon={<CheckCircleOutlined key="checkCircleOutlined" />}
              ></Button>
              <Button
                onClick={() => handleRejectPic(props.imgs[showPicIndex].id)}
                disabled={props.imgs[showPicIndex].isShow === 0 ? true : false}
                icon={<CloseCircleOutlined key="closeCircleOutlined" />}
              ></Button>
              <span>
                <span style={{ display: showPicIndex === 19 ? true : 'none' }}>
                  <Button onClick={() => changePic(1)}>下一页</Button>
                </span>
                <span style={{ display: showPicIndex !== props.imgs.length - 1 ? true : 'none', }}>
                  <Button onClick={() => changePic(1)}>
                    <RightOutlined />
                  </Button>
                </span>
              </span>
            </div>
            <div className="show-pic">
              <img ref={modalImg} src={props.imgs[showPicIndex].high} alt="" />
            </div>
          </div>
        </Modal>
      </div>
    )
  }
})

export default SortableList
