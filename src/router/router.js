import Upload from '../pages/Upload/Upload.jsx';
import Manage from '../pages/Manage/Manage.jsx';
import Home from '../pages/Home/Home.jsx';
import Login from '../pages/Login/Login.jsx';
import Test from '../pages/Test/Test.jsx';

let routes = [{
    path: "/",
    component: Home,
    exact: true
  },
  {
    path: "/upload",
    component: Upload,
    exact: true
  },
  {
    path: "/manage",
    component: Manage,
    exact: true
  }, 
  {
    path: "/login",
    component: Login,
    exact: true
  },
  {
    path: "/test",
    component: Test,
    exact: true
  },

];

export default routes;