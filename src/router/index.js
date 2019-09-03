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
      // {
      //   path: 'list',
      //   name: 'houseList',
      //   meta: { title: '城市管理', auth: true},
      //   component: () => import("@/views/user/userAreas")
      // },

      {
        path: 'manager',
        name: 'mananger',
        meta: { title: '设置管理员', auth: true, super: true },
        component: () => import('@/views/settings/managerList')
      },
      {
        path: 'permission',
        path: 'menuManager',
        name: 'menuManager',
        meta: { title: '菜单设置', auth: true, super: true },
        component: () => import('@/views/settings/menuManager')
      },
      {
        path: 'permissions',
        name: 'permissions',
        hidden: true,
        name: 'permission',
        meta: { title: '设置权限', auth: true, super: true },
        component: () => import('@/views/settings/permission')
        // path: 'permissions',
        // name: 'permissions',
        // hidden: true,
        // meta: { title: '权限管理', auth: true, super: true },
        // component: Empty,
        // children: [
        //   {
        //     path: 'permission',
        //     hidden: true,
        //     name: 'permission',
        //     meta: { title: '设置权限', auth: true, super: true },
        //     component: () => import('@/views/settings/permission')
        //   }
        // ]
      },
      {
        path: 'policy',
        name: 'policy',
        component: Empty,
        meta: { title: '协议设置', auth: true },
        children: [

          // {
          //   component: () => import('@/views/settings/policy'),
          //   query: { title: "用户协议", name: "user_policy" },
          //   path: 'user_policy',
          //   name: "user_policy",
          //   meta: { title: "用户协议" }
          // },
          {
            component: () => import('@/views/settings/policy'),
            query: { title: "风险提示", name: "risk_warning" },
            path: 'risk_warning',
            name: "risk_warning",
            meta: { title: "风险提示" }
          },
          {
            component: () => import('@/views/settings/policy'),
            path: "about_us",
            name: "about_us",
            query: { title: "关于我们", name: "about_us" },
            meta: { title: "关于我们" }
          },
          {
            component: () => import('@/views/settings/policy'),
            path: "user_services_agreement",
            name: "user_services_agreement",
            query: { title: "用户服务协议", name: "user_services_agreement" },
            meta: { title: "用户服务协议" }
          },
          {
            component: () => import('@/views/settings/policy'),
            path: "payment_agreement",
            name: "payment_agreement",
            query: { title: "支付协议", name: "payment_agreement" },
            meta: { title: "支付协议" }
          },
          {
            component: () => import('@/views/settings/policy'),
            path: "investment_risk_agreement",
            name: "investment_risk_agreement",
            query: { title: "投资风险协议书", name: "investment_risk_agreement" },
            meta: { title: "投资风险协议书" }
          },
          {
            component: () => import('@/views/settings/policy'),
            path: "privacy_regime",
            name: "privacy_regime",
            query: { title: "隐私政权", name: "privacy_regime" },
            meta: { title: "隐私政权" }
          },
          {
            component: () => import('@/views/settings/policy'),
            path: "integral_rules",
            name: "integral_rules",
            query: { title: "积分规则", name: "integral_rules" },
            meta: { title: "积分规则" }
          },
          {
            component: () => import('@/views/settings/policy'),
            path: "project_cooperation",
            name: "project_cooperation",
            query: { title: "积分规则", name: "project_cooperation" },
            meta: { title: "项目合作" }
          },

        ]
      }
    ]
  },



  {
    path: '/operation',
    component: Layout,
    name: 'operation',
    meta: { title: '运营', icon: 'operator' },
    children: [
      {
        path: 'activity',
        name: 'activity',
        meta: { title: '活动', auth: true },
        component: () => import('@/views/operation/activity')
      },
      {
        path: 'invite',
        name: 'invite',
        meta: { title: '邀请', auth: true },
        component: () => import('@/views/operation/invite')
      },

      {
        path: 'dynamic',
        name: 'dynamic',
        meta: { title: '动态', auth: true },
        component: () => import('@/views/operation/dynamic')
      },

      {
        path: 'notice',
        name: 'notice',
        meta: { title: '通知', auth: true },
        component: () => import('@/views/operation/notice')
      },


      {
        path: 'popularSearches',
        name: 'popularSearches',
        meta: { title: '热搜榜', auth: true },
        component: () => import('@/views/operation/popularSearches')
      },

      {
        path: 'recommendStroy',
        name: 'recommendStroy',
        meta: { title: '推荐故事', auth: true },
        component: () => import('@/views/operation/recommendStroy')
      },

      {
        path: 'feedback',
        name: 'feedback',
        meta: { title: '用户反馈', auth: true },
        component: () => import('@/views/operation/feedback')
      }, {
        path: 'integral',
        name: 'integral',
        meta: { title: '积分', auth: true },
        component: () => import('@/views/operation/integral')
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    name: 'order',
    meta: { title: '订单', icon: 'record' },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/order/list'),
        meta: { title: '订单列表', auth: true }
      },
    ]
  },


  {
    path: '/dividend',
    component: Layout,
    name: 'dividend',
    meta: { title: '分红', icon: 'record' },
    children: [
      {
        path: 'dividendList',
        name: 'dividendList',
        component: () => import('@/views/dividend/dividendList'),
        meta: { title: '分红列表', auth: true }
      },
    ]
  },
  {
    path: '/withdraw',
    component: Layout,
    name: 'order',
    meta: { title: '提现', icon: 'record' },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/dividend/withdrawList'),
        meta: { title: '提现列表', auth: true }
      },
    ]
  },



  // {
  //   path: '/order',
  //   component: Layout,
  //   name: 'order',
  //   meta: { title: '团队', icon: 'record' },
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'list',
  //       component: () => import('@/views/order/list'),
  //       meta: { title: '团队管理', auth: true }
  //     },
  //     {
  //       path: 'postSaleList',
  //       name: 'postSaleList',
  //       component: () => import('@/views/order/postSaleList'),
  //       meta: { title: '售后列表', auth: true }
  //     }
  //   ]
  // },

  {
    path: '/project',
    component: Layout,
    name: 'project',
    meta: { title: '项目', icon: 'record' },
    children: [
      {
        path: 'projectList',
        name: 'projectList',
        component: () => import('@/views/project/projectList'),
        meta: { title: '项目合作', auth: true }
      },
      {
        path: 'projectDetailList',
        name: 'projectDetailList',
        hidden: true,
        component: () => import('@/views/project/projectDetail'),
        meta: { title: '项目详情', auth: true }
      },
      {
        path: 'addProjectDetail',
        name: 'addProjectDetail',
        hidden: true,
        component: () => import('@/views/project/addProjectDetail'),
        meta: { title: '添加项目', auth: true }
      },
      {
        path: 'updateProjectDetail',
        name: 'updateProjectDetail',
        hidden: true,
        component: () => import('@/views/project/updateProjectDetail'),
        meta: { title: '编辑项目', auth: true }
      },
      {
        path: 'updateProject',
        name: 'updateProject',
        hidden: true,
        component: () => import('@/views/project/updateProject'),
        meta: { title: '编辑项目', auth: true }
      },
      {
        path: 'brandStoryList',
        name: 'brandStoryList',
        hidden: true,
        component: () => import('@/views/project/brandStory'),
        meta: { title: '品牌故事', auth: true }
      },
      {
        path: 'initiatingTeam',
        name: 'initiatingTeam',
        hidden: true,
        component: () => import('@/views/project/initiatingTeam'),
        meta: { title: '发起团队', auth: true }
      },
      {
        path: 'informationDisclosure',
        name: 'informationDisclosure',
        hidden: true,
        component: () => import('@/views/project/informationDisclosure'),
        meta: { title: '信息披露', auth: true }
      },
      {
        path: 'publicPicture',
        name: 'publicPicture',
        hidden: true,
        component: () => import('@/views/project/publicPicture'),
        meta: { title: '图片展示', auth: true }
      },
      {
        path: 'investmentProgram',
        name: 'investmentProgram',
        hidden: true,
        component: () => import('@/views/project/investmentProgram'),
        meta: { title: '投资方案', auth: true }
      },
      {
        path: 'publicProjectList',
        name: 'publicProjectList',
        component: () => import('@/views/project/publicProjectList'),
        meta: { title: '在线项目', auth: true }
      },
      {
        path: 'investmentType',
        name: 'investmentType',
        component: () => import('@/views/project/investmentType'),
        meta: { title: '投资类型', auth: true }
      },
      {
        path: 'projectType',
        name: 'projectType',
        component: () => import('@/views/project/projectType'),
        meta: { title: '项目类型', auth: true }
      },
      // {
      //   path: 'postSaleList',
      //   name: 'postSaleList',
      //   component: () => import('@/views/order/postSaleList'),
      //   meta: { title: '团队管理', auth: true }
      // },
    ]
  },

  {
    path: '/log',
    component: Layout,
    name: 'log',
    meta: { title: '日志', icon: 'log' },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/log/logList'),
        meta: { title: '登陆日志', auth: true }
      },
      {
        path: 'payLog',
        name: 'payLog',
        component: () => import('@/views/log/payLog'),
        meta: { title: '支付日志', auth: true }
      },

    ]
  },
  {
    path: "/user",
    component: Layout,
    meta: { title: '用户', icon: 'user' },
    name: "user",
    children: [
      {
        path: 'list',
        name: 'userList',
        meta: { title: '用户列表', auth: true },
        component: () => import("@/views/user/userList"),
      },
      {
        path: 'userDetail',
        name: 'userDetail',
        hidden: true,
        meta: { title: '用户详情', auth: true },
        component: () => import("@/views/user/userDetail"),
      },
      {
        path: 'addressList',
        name: 'addressList',
        // hidden: true,
        meta: { title: '地址列表', auth: true },
        component: () => import("@/views/user/addressList"),
      },
      {
        path: 'investorAuthList',
        name: 'investorAuthList',
        meta: { title: '投资者认证', auth: true },
        component: () => import("@/views/user/investorAuthList"),
      },

    ]
  },
  {
    path: "/finance",
    component: Layout,
    meta: { title: '财务', icon: 'statistic' },
    name: "finance",
    children: [
      {
        path: 'fee',
        name: 'fee',
        meta: { title: '平台费用', auth: true },
        component: () => import("@/views/finance/feeLog")
      },
      {
        path: 'withdraw',
        name: 'withdraw',
        meta: { title: '提现申请', auth: true },
        component: () => import("@/views/finance/withdrawApply")
      }
    ]
  },
  {
    path: '/extra',
    name: 'extra',
    component: Layout,
    hidden: true,
    meta: { title: '信息' },
    children: [
      {
        path: 'addMediaText',
        name: 'addMediaText',
        meta: { title: '添加内容' },
        component: () => import('@/views/common/addMediaText')
      }
    ],
  },
  { path: '*', redirect: '/404', hidden: true }
]


export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
