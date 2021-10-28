import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Categories from '../components/goods/categories'
import Params from '../components/goods/params'
import GoodList from '../components/goods/goodslist'
import Add from '../components/goods/add'
import Orders from '../components/orders/orders'
import Report from '../components/report/report'



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
        path:'/categories',
        component: Categories
      },
      { 
        path:'/params',
        component: Params
      },
      { 
        path:'/goods',
        component: GoodList,
      }
      ,
      { 
        path:'/goods/add',
        component: Add,
      } ,
      { 
        path:'/orders',
        component: Orders,
      },
      { 
        path:'/reports',
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