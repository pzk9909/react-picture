import React, { useState } from 'react'
import './SortableItem.css'
import { SortableElement } from 'react-sortable-hoc'
import {
  UpOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { Button, Tooltip, Popconfirm } from 'antd'
import * as api from '../../net-module/api'
import Img from '../Img/Img'
import isMobile from '../../util/isMobile'
//可拖拽的单项
const SortableItem = SortableElement((props) => {
  const acceptPic = async () => {
    let res = await api.acceptPicture({ id: props.value.id })
    props.handleAcceptPic()
  } //图片审核通过
  const rejectPic = async () => {
    let res = await api.rejectPicture({ id: props.value.id })
    props.handleRejectPic()
  } //图片审核拒绝
  const deletePic = async () => {
    let res = await api.deletePicture({ id: props.value.id })
    props.handleDeletePic({ id: props.value.id })
  } //删除图片

  const confirm = (e) => {
    deletePic()
    console.log(e);
  };

  const cancel = (e) => {
    console.log(e);
  };

  const goTopPic = async () => {
    let res = await api.goTopPicture({ id: props.value.id })
    props.handleGoTopPic(props.value.id)
  } //指定图片
  const showPic = () => {
    props.handleShowPic(props.value.id)
  } //打开图片预览弹窗

  return (
    <>
      <div className="item" style={{ marginLeft: isMobile() ? '7%' : '1.7%', width: isMobile() ? '35%' : '18%'}}>
        <Tooltip placement="topRight" title="点击预览，按住拖动">
          <div onClick={showPic}>
            <div className='item-img'>
              <Img src={props.value.low} alt={''} style={{ margin: '5px 0px 5px 0px', height: 150 }}></Img>
            </div>
          </div>
        </Tooltip>
        <div className="button-group">
          <Tooltip placement="bottomLeft" title='审核通过'>
            <Button
              disabled={props.value.isShow === 1 ? true : false}
              onClick={() => {
                acceptPic()
              }}
              icon={<CheckCircleOutlined key="CheckCircleOutlined" />}
            ></Button>
          </Tooltip>
          <Tooltip placement="bottomLeft" title='审核拒绝'>
            <Button
              disabled={props.value.isShow === 0 ? true : false}
              onClick={() => {
                rejectPic()
              }}
              icon={<CloseCircleOutlined key="closeCircleOutlined" />}
            ></Button>
          </Tooltip>
          <Tooltip placement="bottomLeft" title='删除图片'>
            <Popconfirm
              title="是否确认删除图片?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="是"
              cancelText="否"
            >
              <Button
                icon={<DeleteOutlined key="deleteOutlined" />}
              ></Button>
            </Popconfirm>

          </Tooltip>
          <Tooltip placement="bottomLeft" title='置顶图片'>
            <Button
              icon={<UpOutlined key="upOutlined" />}
              onClick={() => {
                goTopPic()
              }}
            ></Button>
          </Tooltip>
        </div>

      </div>


    </>

  )
})

export default SortableItem
