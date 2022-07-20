import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../net-module/api'
import store from '../../store/index'
import './Login.css'
const Login = () => {
    let navigate = useNavigate()
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        api.login({ uid: values.uid, pwd: values.pwd }).then(res => {
            console.log(res);
            if (res.code === 0) {
                message.success('登录成功')
                store.dispatch({
                    type:'login'
                })
                navigate('/')
            }else{
                message.error(res.message)
            }
        })

    };

    return (
        <div className='login-container'>
            
            <div className='login-form-container' >
                <div className='form-info'>
                    管理员登录
                </div>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="uid"
                        rules={[
                            {
                                required: true,
                                message: '请输入账号!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="账号" />
                    </Form.Item>
                    <Form.Item
                        name="pwd"
                        rules={[
                            {
                                required: true,
                                message: ' 请输入密码!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
