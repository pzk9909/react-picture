import React, { useState } from 'react'
import './SortableItem.css'
import { SortableElement } from 'react-sortable-hoc'
import {
  UpOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import * as api from '../../net-module/api'
import Img from '../Img/Img'

//可拖拽的单项
const SortableItem = SortableElement((props) => {
  const acceptPic = () => {
    api.acceptPicture({ id: props.value.id }).then((res) => {
      props.handleAcceptPic()
    })
  } //图片审核通过
  const rejectPic = () => {
    api.rejectPicture({ id: props.value.id }).then((res) => {
      props.handleRejectPic()
    })
  } //图片审核拒绝
  const deletePic = function () {
    api.deletePicture({ id: props.value.id }).then((res) => {
      props.handleDeletePic({ id: props.value.id })
    })
  } //删除图片
  const goTopPic = () => {
    api.goTopPicture({ id: props.value.id }).then((res) => {
      props.handleGoTopPic(props.value.id)
    })
  } //指定图片
  const showPic = () => {
    props.handleShowPic(props.value.id)
  } //打开图片预览弹窗
  const isMobile = () => {
    if (
      navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
    ) {
      return true
    } else {
      return false
    }
  } //判断PC端移动端
  return (
    <>
      <Tooltip placement="topRight" title="点击预览，按住拖动">
        <div className="item">
          <div onClick={showPic}>
            <div className='item-img'>
              <Img src={props.value.low} alt={''} style={{ margin: '5px 0px 5px 0px', height: 150 }}></Img>
            </div>
          </div>
          <div className="button-group">
            <Tooltip placement="topLeft" title='审核通过'>
              <Button
                disabled={props.value.isShow === 1 ? true : false}
                onClick={() => {
                  acceptPic()
                }}
                icon={<CheckCircleOutlined key="CheckCircleOutlined" />}
              ></Button>
            </Tooltip>
            <Tooltip placement="topLeft" title='审核拒绝'>
              <Button
                disabled={props.value.isShow === 0 ? true : false}
                onClick={() => {
                  rejectPic()
                }}
                icon={<CloseCircleOutlined key="closeCircleOutlined" />}
              ></Button>
            </Tooltip>
            <Tooltip placement="topLeft" title='删除图片'><Button
              icon={<DeleteOutlined key="deleteOutlined" />}
              onClick={() => {
                deletePic()
              }}
            ></Button></Tooltip>
            <Tooltip placement="topLeft" title='置顶图片'><Button
              icon={<UpOutlined key="upOutlined" />}
              onClick={() => {
                goTopPic()
              }}
            ></Button></Tooltip>

          </div>

        </div>
      </Tooltip>
      
    </>

  )
})

export default SortableItem
