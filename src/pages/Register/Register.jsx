import React, { Component } from 'react'

import './Register.css'
function Register() {
    return (
        <>
            <div className="container">
                <form action="">
                    <input type="text" placeholder='账号' />
                    <input type="password" placeholder='密码' />
                    <button>注册</button>
                </form>
            </div>
        </>
    )
}

export default Register
