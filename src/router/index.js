import Vue from 'vue'
import VueRouter from 'vue-router'

/* 懒加载 */
//import Login from '../components/Login'
const Login = () => import( /* webpackChunkName: "Login-Home-Welcome" */ '../components/Login.vue')
//import Home from '../components/Home'
const Home = () => import( /* webpackChunkName: "Login-Home-Welcome" */ '../components/Home.vue')
//import Welcome from '../components/Welcome'
const Welcome = () => import( /* webpackChunkName: "Login-Home-Welcome" */ '../components/Welcome.vue')


//import Users from '../components/user/Users'
const Users = () => import( /* webpackChunkName: "Users-Rights-Roles" */ '../components/user/Users.vue')
//import Rights from '../components/power/Rights'
const Rights = () => import( /* webpackChunkName: "Users-Rights-Roles" */ '../components/power/Rights.vue')
//import Roles from '../components/power/Roles'
const Roles = () => import( /* webpackChunkName: "Users-Rights-Roles" */ '../components/power/Roles.vue')



//import Categories from '../components/goods/categories'
const Categories = () => import( /* webpackChunkName: "Categories-Params" */ '../components/goods/categories.vue')
//import Params from '../components/goods/params'
const Params = () => import( /* webpackChunkName: "Categories-Params" */ '../components/goods/params.vue')


//import GoodList from '../components/goods/goodslist'
const GoodList = () => import( /* webpackChunkName: "GoodList-Add" */ '../components/goods/goodslist.vue')
//import Add from '../components/goods/add'
const Add = () => import( /* webpackChunkName: "GoodList-Add" */ '../components/goods/add.vue')


//import Orders from '../components/orders/orders'
const Orders = () => import( /* webpackChunkName: "Orders-Report" */ '../components/orders/orders.vue')
//import Report from '../components/report/report'
const Report = () => import( /* webpackChunkName: "Orders-Report" */ '../components/report/report.vue')


Vue.use(VueRouter)


const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: GoodList,
      },
      {
        path: '/goods/add',
        component: Add,
      },
      {
        path: '/orders',
        component: Orders,
      },
      {
        path: '/reports',
        component: Report,
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router