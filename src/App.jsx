import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import routes from './router/router'
import Home from './pages/Home/Home.jsx'
import store from './store/index'
function App() {

  const exitLogin = () => {
    store.dispatch({
      type: 'exitLogin'
    })
  }

  return (
    <div className="App">
      <Router>
        <div className="nav">
          <img
            className="milogo"
            src="https://bbs.mihoyo.com/_nuxt/img/miHoYo_Game.2457753.png"
            alt=""
          />
          <Link to="/">
            <div className="nav-item">主页</div>
          </Link>
          <Link to="/upload">
            <div className="nav-item">发布图片</div>
          </Link>
          <Link style={{ display: store.getState().isLogin === true ? true : 'none' }} to="/manage">
            <div className="nav-item">管理</div>
          </Link>
          <Link style={{ display: store.getState().isLogin === false ? true : 'none' }} to="/login">
            <div className="goLogin-button">登录</div>
          </Link>
          <Link style={{ display: store.getState().isLogin === true ? true : 'none' }} to="">
            <div onClick={exitLogin} className="goLogin-button">退出登录</div>
          </Link>
        </div>
        <div className='main'>
          <Routes>
            {routes.map((route, key) => {
              if (route.exact) {
                return (
                  <Route
                    key={key}
                    exact
                    path={route.path}
                    element={<route.component />}
                  />
                )
              } else {
                return (
                  <Route
                    key={key}
                    path={route.path}
                    render={(props) => (
                      <route.component {...props} routes={route.routes} />
                    )}
                  />
                )
              }
            })}
            <Route component={Home} />
          </Routes>
        </div>
      </Router>
    </div>
  )
}

export default App
