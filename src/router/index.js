import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import AppMain from '../views/layout/components/AppMain'
import Empty from '../views/layout/components/empty'

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/firstRun', component: () => import('@/views/login/firstRun'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      meta: { title: '面板' },
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/info',
    name: 'settings',
    meta: { title: '设置', icon: 'system' },
    children: [
      {
        path: 'settings',
        name: 'settings',
        meta: { title: '系统设置', auth: true, super: true },
        component: () => import('@/views/settings/settings')
      },
  

      {
        path: 'manager',
        name: 'mananger',
        meta: { title: '设置管理员', auth: true, super: true },
        component: () => import('@/views/settings/managerList')
      },
      {
        path: 'menuManager',
        name: 'menuManager',
        meta: { title: '菜单管理', auth: true, super: true },
        component: () => import('@/views/settings/menuManager')
      },
      {
        path: 'roleManager',
        name: 'roleManager',
        meta: { title: '角色管理', auth: true, super: true },
        component: () => import('@/views/settings/roleManager')
      },
      {
        path: 'userManager',
        name: 'userManager',
        meta: { title: '用户管理', auth: true, super: true },
        component: () => import('@/views/settings/userManager')
      },
      {
        path: 'permissions',
        hidden: true,
        name: 'permission',
        meta: { title: '设置权限', auth: true, super: true },
        component: () => import('@/views/settings/permission')
      },
     
    ]
  },




  // {
  //   path: "/user",
  //   component: Layout,
  //   meta: { title: '用户', icon: 'user' },
  //   name: "user",
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'userList',
  //       meta: { title: '用户列表', auth: true },
  //       component: () => import("@/views/user/userList"),
  //     },
  //     {
  //       path: 'userDetail',
  //       name: 'userDetail',
  //       hidden: true,
  //       meta: { title: '用户详情', auth: true },
  //       component: () => import("@/views/user/userDetail"),
  //     },
   

  //   ]
  // },
  
  // {
  //   path: '/extra',
  //   name: 'extra',
  //   component: Layout,
  //   hidden: true,
  //   meta: { title: '信息' },
  //   children: [
  //     {
  //       path: 'addMediaText',
  //       name: 'addMediaText',
  //       meta: { title: '添加内容' },
  //       component: () => import('@/views/common/addMediaText')
  //     }
  //   ],
  // },
  { path: '*', redirect: '/404', hidden: true }
]


export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
