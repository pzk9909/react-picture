import React, { useState } from 'react'
import './SortableItem.css'
import { SortableElement } from 'react-sortable-hoc'
import {
    UpOutlined,
    DeleteOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons'
import { Button, Card, message} from 'antd'
import * as api from '../../net-module/api'
import Img from '../Img/Img'

//可拖拽的单项
const SortableItem = SortableElement((props) => {
    const [isShow, setIsShow] = useState(props.value.isShow)
    var acceptPic = () => {
        api.acceptPicture({ id: props.value.id }).then((res) => {
            setIsShow(1)
            message.success('通过图片成功')
        })
    }
    var rejectPic = () => {
        api.rejectPicture({ id: props.value.id }).then((res) => {
            setIsShow(0)
            message.error('拒绝图片成功')
        })
    }
    var deletePic = function () {
        api.deletePicture({ id: props.value.id }).then((res) => {
            props.handleDeletePic({ id: props.value.id })
        })
    }
    var goTopPic = () => {
        api.goTopPicture({ id: props.value.id }).then((res) => {
            props.handleGoTopPic(props.value.id)
        })
    }
    var showPic = () => {
        props.handleShowPic(props.value.id)
    }
    var isMobile = () => {
        if (
            navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            )
        ) {
            return true
        } else {
            return false
        }
    }
    return (
        <div className="item">
            <Card
                // style={{ width: isMobile() ? '35vw' : '15vw' ,height:isMobile()? '30vh' : '13vh'}}
                style={{ minWidth: '110px', width: isMobile() ? '35vw' : '15vw', }}
            >
                <div onClick={showPic}>
                    <Img src={props.value.low} alt={""}
                        style={{ height: 70 }}>
                    </Img>
                </div>
                <div>
                </div>
                <div className='button-group'>
                    <Button
                        style={{}}
                        disabled={isShow === 1 ? true : false}
                        onClick={() => {
                            acceptPic()
                        }}
                        icon={<CheckCircleOutlined key="checkCircleOutlined" />}
                    ></Button>
                    <Button
                        disabled={isShow === 0 ? true : false}
                        onClick={() => {
                            rejectPic()
                        }}
                        icon={<CloseCircleOutlined key="closeCircleOutlined" />}
                    ></Button>
                    <Button
                        icon={<DeleteOutlined key="deleteOutlined" />}
                        onClick={() => {
                            deletePic()
                        }}
                    ></Button>
                    <Button
                        icon={<UpOutlined key="upOutlined" />}
                        onClick={() => {
                            goTopPic()
                        }}
                    ></Button>
                </div>
            </Card>
        </div>
    )
})

export default SortableItem