import React, { useState } from 'react'
import './SortableList.css'
import { SortableContainer } from 'react-sortable-hoc'
import {
    CloseCircleOutlined,
    CheckCircleOutlined,
    RightOutlined,
    LeftOutlined,
} from '@ant-design/icons'
import { Button,message, Modal } from 'antd'
import * as api from '../../net-module/api'
import SortableItem from '../SortableItem/SortableItem'

//可拖拽列表
const SortableList = SortableContainer(({ imgs, handleFresh }) => {
    const [isShowPic, setIsShowPic] = useState(false)
    const [isShow, setIsShow] = useState(false)
    const [showPicIndex, setShowPicIndex] = useState('')
    const [showPic, setShowPic] = useState('')
    var handleAcceptPic = (id) => {
        api.acceptPicture({ id }).then((res) => {
            message.success('通过图片成功')
            handleFresh()
            setIsShow(1)
        })
    }
    var handleRejectPic = (id) => {
        api.rejectPicture({ id }).then((res) => {
            setIsShow(0)
            message.success('拒绝图片成功')
        })
    }
    var handleDeletePic = (id) => {
        message.success('删除图片成功')
        handleFresh()
    }
    var handleGoTopPic = () => {
        message.success('置顶图片成功')
        handleFresh()
    }
    var handleShowPic = (id) => {
        console.log('handleShowPic')
        console.log(id)
        let index = imgs.findIndex((item) => item.id === id)
        console.log(index)
        setIsShow(imgs[index].isShow)
        setShowPicIndex(index)
        setShowPic(imgs[index])
        setIsShowPic(true)
    }
    var handleCancel = () => {
        handleFresh()
        setIsShowPic(false)
    }
    var changePic = (o) => {
        if (showPicIndex >= imgs.length - 1 && o === 1) {
            message.info('当前为最后一张图片')
        } else if (showPicIndex <= 0 && o === -1) {
            message.info('当前为第一张图片')
        } else {
            setShowPic(imgs[showPicIndex + o])
            setShowPicIndex(showPicIndex + o)
        }
    }
    return (
        <div>
            <div className="img-list-container">
                {imgs.map((value, index) => (
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
                width={1000}
                visible={isShowPic}
                onCancel={handleCancel}
                footer={<div></div>}
            >
                <div className="modal-container">
                    <div className="modal-button">
                        <Button onClick={() => changePic(-1)}>
                            <LeftOutlined />
                        </Button>
                        <Button
                            disabled={isShow === 1 ? true : false}
                            onClick={() => handleAcceptPic(showPic.id)}
                            icon={<CheckCircleOutlined key="checkCircleOutlined" />}
                        ></Button>
                        <Button
                            onClick={() => handleRejectPic(showPic.id)}
                            disabled={isShow === 0 ? true : false}
                            icon={<CloseCircleOutlined key="closeCircleOutlined" />}
                        ></Button>
                        <Button onClick={() => changePic(1)}>
                            <RightOutlined />
                        </Button>
                    </div>
                    <div className="show-pic">
                        <img src={showPic.high} alt="" />
                    </div>
                </div>
            </Modal>
        </div>
    )
})

export default SortableList