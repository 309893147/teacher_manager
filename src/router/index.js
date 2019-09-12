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
    hidden: false,
    meta: { title: '设置', icon: 'system' },
    children: [
      {
        path: 'settings',
        name: 'settings',
        hidden: true,
        meta: { title: '系统设置', auth: true, super: true },
        component: () => import('@/views/settings/settings')
      },
      // {
      //   path: 'list',
      //   name: 'houseList',
      //   meta: { title: '城市管理', auth: true},
      //   component: () => import("@/views/user/userAreas")
      // },

      // {
      //   path: 'manager',
      //   name: 'mananger',
      //   hidden: true,
      //   meta: { title: '设置管理员', auth: true, super: true },
      //   component: () => import('@/views/settings/managerList')
      // },
      {
        path: 'menuManager',
        name: 'menuManager',
        hidden: true,
        meta: { title: '菜单管理', auth: true, super: true },
        component: () => import('@/views/settings/menuManager')
      },
      {
        path: 'roleManager',
        name: 'roleManager',
        hidden: true,
        meta: { title: '角色管理', auth: true, super: true },
        component: () => import('@/views/settings/roleManager')
      },
      {
        path: 'userManager',
        name: 'userManager',
        hidden: true,
        meta: { title: '用户管理', auth: true, super: true },
        component: () => import('@/views/settings/userManager')
      },
      {
        path: 'permissions',
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
        hidden: true,
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
            meta: { title: "风险提示" ,noCache: true}
          },
          {
            component: () => import('@/views/settings/policy'),
            path: "about_us",
            name: "about_us",
            query: { title: "关于我们", name: "about_us" },
            meta: { title: "关于我们" ,noCache: true}
          },
          {
            component: () => import('@/views/settings/policy'),
            path: "user_services_agreement",
            name: "user_services_agreement",
            query: { title: "用户服务协议", name: "user_services_agreement" },
            meta: { title: "用户服务协议" ,noCache: true}
          },
          {
            component: () => import('@/views/settings/policy'),
            path: "payment_agreement",
            name: "payment_agreement",
            query: { title: "支付协议", name: "payment_agreement" },
            meta: { title: "支付协议" ,noCache: true}
          },
          {
            component: () => import('@/views/settings/policy'),
            path: "investment_risk_agreement",
            name: "investment_risk_agreement",
            query: { title: "投资风险协议书", name: "investment_risk_agreement" },
            meta: { title: "投资风险协议书" ,noCache: true}
          },
          {
            component: () => import('@/views/settings/policy'),
            path: "privacy_regime",
            name: "privacy_regime",
            query: { title: "隐私政策", name: "privacy_regime" },
            meta: { title: "隐私政策" ,noCache: true}
          },
          {
            component: () => import('@/views/settings/policy'),
            path: "integral_rules",
            name: "integral_rules",
            query: { title: "积分规则", name: "integral_rules" },
            meta: { title: "积分规则" ,noCache: true}
          },
          {
            component: () => import('@/views/settings/policy'),
            path: "project_cooperation",
            name: "project_cooperation",
            query: { title: "项目合作", name: "project_cooperation" },
            meta: { title: "项目合作" ,noCache: true}
          },
          {
            component: () => import('@/views/settings/policy'),
            path: "login_registration_agreement",
            name: "login_registration_agreement",
            query: { title: "登录注册协议", name: "login_registration_agreement" },
            meta: { title: "登录注册协议" ,noCache: true}
          },
          {
            component: () => import('@/views/settings/policy'),
            path: "crowdfunding_rules",
            name: "crowdfunding_rules",
            query: { title: "众筹规则", name: "crowdfunding_rules" },
            meta: { title: "众筹规则" ,noCache: true}
          },{
            component: () => import('@/views/settings/policy'),
            path: 'common_problem',
            name: 'common_problem',
            query: { title: "常见问题", name: "common_problem" },
            meta: { title: '常见问题', auth: true }
          },{
            component: () => import('@/views/settings/policy'),
            path: 'Invitation_rule',
            name: 'Invitation_rule',
            query: { title: "邀请规则", name: "Invitation_rule" },
            meta: { title: '邀请规则', auth: true }
          },{
            component: () => import('@/views/settings/policy'),
            path: 'invite_friends',
            name: 'invite_friends',
            query: { title: "邀请好友", name: "invite_friends" },
            meta: { title: '邀请好友', auth: true }
          },{
            component: () => import('@/views/settings/policy'),
            path: 'investment_project',
            name: 'investment_project',
            query: { title: "投资项目", name: "investment_project" },
            meta: { title: '投资项目', auth: true }
          }
        ]
      }
    ]
  },



  {
    path: '/operation',
    component: Layout,
    name: 'operation',
    hidden: true,
    meta: { title: '运营', icon: 'operator' },//
    children: [
      {
        path: 'upcomingEvents',
        name: 'upcomingEvents',
        hidden: true,
        meta: { title: '活动公告', auth: true },
        component: () => import('@/views/operation/upcomingEvents')
      },
      {
        path: 'activity',
        name: 'activity',
        hidden: true,
        meta: { title: '热门活动', auth: true },
        component: () => import('@/views/operation/activity')
      },
      {
        path: 'invite',
        name: 'invite',
        hidden: true,
        meta: { title: '邀请', auth: true },
        component: () => import('@/views/operation/invite')
      },

      {
        path: 'dynamic',
        name: 'dynamic',
        hidden: true,
        meta: { title: '动态', auth: true },
        component: () => import('@/views/operation/dynamic')
      },

      {
        path: 'notice',
        name: 'notice',
        hidden: true,
        meta: { title: '通知', auth: true },
        component: () => import('@/views/operation/notice')
      },
      {
        path: 'popularSearches',
        name: 'popularSearches',
        hidden: true,
        meta: { title: '热搜榜', auth: true },
        component: () => import('@/views/operation/popularSearches')
      },
      {
        path: 'recommendStroy',
        name: 'recommendStroy',
        hidden: true,
        meta: { title: '推荐故事', auth: true },
        component: () => import('@/views/operation/recommendStroy')
      },
      {
        path: 'operationReport',
        name: 'operationReport',
        hidden: true,
        meta: { title: '运营报告', auth: true },
        component: () => import('@/views/operation/operationReport')
      },
      {
        path: 'discountInformation',
        name: 'discountInformation',
        hidden: true,
        meta: { title: '优惠信息', auth: true },
        component: () => import('@/views/operation/discountInformation')
      },
      {
        path: 'feedback',
        name: 'feedback',
        hidden: true,
        meta: { title: '用户反馈', auth: true },
        component: () => import('@/views/operation/feedback')
      }
      // , {
      //   path: 'integral',
      //   name: 'integral',
      //   hidden: true,
      //   meta: { title: '积分', auth: true },
      //   component: () => import('@/views/operation/integral')
      // }
    ]
  },
  {
    path: '/order',
    component: Layout,
    name: 'order',
    hidden: true,
    meta: { title: '订单', icon: 'record' },
    children: [
      {
        path: 'list',
        name: 'list',
        hidden: true,
        component: () => import('@/views/order/list'),
        meta: { title: '订单列表', auth: true }
      },
    ]
  },


  {
    path: '/dividend',
    component: Layout,
    name: 'dividend',
    hidden: true,
    meta: { title: '分红', icon: 'record' },
    children: [
      {
        path: 'dividendList',
        name: 'dividendList',
        hidden: true,
        component: () => import('@/views/dividend/dividendList'),
        meta: { title: '分红列表', auth: true }
      },
    ]
  },
  {
    path: '/withdraw',
    component: Layout,
    name: 'withdraw',
    hidden: true,
    meta: { title: '提现', icon: 'record' },
    children: [
      {
        path: 'withdrawList',
        name: 'withdrawList',
        hidden: true,
        component: () => import('@/views/dividend/withdrawList'),
        meta: { title: '提现列表', auth: true }
      },
    ]
  },

  {
    path: '/project',
    component: Layout,
    name: 'project',
    hidden: true,
    meta: { title: '项目', icon: 'record' },
    children: [
      {
        path: 'projectList',
        name: 'projectList',
        hidden: true,
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
        hidden: true,
        component: () => import('@/views/project/publicProjectList'),
        meta: { title: '全部项目', auth: true ,noCache: true}
      },
      {
        path: 'investmentType',
        name: 'investmentType',
        hidden: true,
        component: () => import('@/views/project/investmentType'),
        meta: { title: '投资类型', auth: true }
      },
      {
        path: 'projectType',
        name: 'projectType',
        hidden: true,
        component: () => import('@/views/project/projectType'),
        meta: { title: '项目类型', auth: true }
      },
   
    ]
  },

  {
    path: "/user",
    component: Layout,
    hidden: true,
    meta: { title: '用户', icon: 'user' },
    name: "user",
    children: [
      {
        path: 'list',
        name: 'userList',
        hidden: true,
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
        hidden: true,
        meta: { title: '地址列表', auth: true },
        component: () => import("@/views/user/addressList"),
      },
      {
        path: 'investorAuthList',
        name: 'investorAuthList',
        hidden: true,
        meta: { title: '投资者认证', auth: true },
        component: () => import("@/views/user/investorAuthList"),
      }, {
        path: 'advancedCertification',
        name: 'advancedCertification',
        hidden: true,
        meta: { title: '高级认证', auth: true },
        component: () => import("@/views/user/advancedCertification"),
      },

    ]
  },
  {
    path: '/feedback',
    name: 'feedback',
    hidden: true,
    component: Layout,
    meta: { title: '反馈', icon: 'record'},
    children: [{
      path: 'feedback',
      name: 'feedback',
      meta: { title: '问题反馈', auth: true },
      component: () => import("@/views/feedback/index"),
    }]
  },
  {
    path: '/service',
    name: 'service',
    hidden: true,
    component: Layout,
    meta: { title: '客服管理', icon: 'record'},
    children: [{
      path: 'myService',
      name: 'myService',
      meta: { title: '我的客服', auth: true },
      component: () => import("@/views/service/myService"),
    }]
  }, {
    path: '/platform',
    name: 'platform',
    hidden: true,
    component: Layout,
    meta: { title: '平台管理', icon: 'record'},
    children: [{
      path: 'platformData',
      name: 'platformData',
      meta: { title: '平台数据', auth: true },
      component: () => import("@/views/platform/platformData"),
    }]
  },{
    path: '/score',
    name: 'score',
    hidden: true,
    component: Layout,
    meta: { title: '邀请管理', icon: 'record'},
    children: [{
      path: 'scoreList',
      name: 'scoreList',
      meta: { title: '邀请列表', auth: true },
      component: () => import("@/views/score/scoreList"),
    },{
      path: 'message',
      name: 'message',
      meta: { title: '聊天设置', auth: true },
      component: () => import("@/views/score/message"),
    }]
  },
  // {
  //   path: '/extra',
  //   name: 'extra',
  //   component: Layout,
  //   hidden: true,
  //   meta: { title: '信息' },
  //   children: [
  //     {
  //       path: 'addMediaText',
  //       hidden: true,
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
