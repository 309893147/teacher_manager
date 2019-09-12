import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import VueAMap from 'vue-amap'
import '@/icons' // icon
import '@/permission' // permission control
import request from '@/utils/request'
import VueCropper from "vue-cropper" 

import VCharts from 'v-charts'
import axios from 'axios'
Vue.prototype.$axios= axios

import '@/utils/tools'
import './permission'

Vue.use(ElementUI, { locale })
Vue.use(VueAMap)
// Vue.use(VCharts)
Vue.use(VueCropper)

VueAMap.initAMapApiLoader({
  key: 'b246d0215b3ce31eb4b7c835a5b07f62',
  plugin: ['AMap.Autocomplete', 'PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});
Vue.config.productionTip = false
Vue.prototype.ax = request
Vue.prototype.success = msg =>{
  app.$message.success(msg)
}
Vue.prototype.error = msg =>{
  app.$message.error(msg)
}

function appendZero(b){
  if(b < 10){
    return '0'+b;
  }
  return b
}

Vue.prototype.formatData = time =>{
  let date = new Date(time)
  return [date.getFullYear(),appendZero(date.getMonth()+1),appendZero(date.getDate())].join("-") +' '+ [appendZero(date.getHours()),appendZero(date.getMinutes()),appendZero(date.getSeconds())].join(":")
}
Vue.prototype.OnError =(msg)=>{
  app.error(msg)
}
let loadings  = []
Vue.prototype.startLoading = (msg) =>{
  let load = app.$loading({
    lock: true,
    text: msg || 'Loading',
    background: 'rgba(0, 0, 0, 0.2)'
  })
  loadings.push(load)
}
Vue.prototype.stopLoading = ()=>{
  loadings.forEach(it =>{
    it.close()
  })
  loadings = []
}
Vue.prototype.confirm = (title) =>{
  return app.$confirm(title||'确认?',{
    closeOnClickModal:false
  }).catch(it =>{})
}

// // main.js
// router.beforeEach((to, from, next) => {
//   if (store.getters.token) { // 判断是否有token
//     console.log('有');
//     if (to.path === '/login') {
//       next({ path: '/' });
//     } else {
//       if (store.getters.role.length === 0) { // 判断当前用户是否已拉取完user_info信息
//         store.dispatch('GetInfo').then(res => { // 拉取info
//           const roleList = [];
//           res.menuDtos.map(res =>{
//             roleList.push(res.menuName)
//           })
//           const roles = roleList;
//           // store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
//           //   router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
//           //   next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
//           // })
//         }).catch(err => {
//           console.log(err);
//         });
//       } else {
//         next() //当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
//       }
//     }
//   }
//   else {
//     if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
//       next();
//     } else {
//       next('/login'); // 否则全部重定向到登录页
//     }
//   }
// });
//
//

let app = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
