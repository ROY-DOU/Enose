import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '电子鼻平台',
  },
  routes: [
    {
      path: '/',
      redirect: '/device/list',
      access: 'isLogin',
    },
    {
      icon: 'hdd',
      name: '设备',
      path: '/device',
      routes: [
        {
          name: '设备列表',
          path: 'list',
          component: './device/DeviceList',
          access: 'isLogin',
        },
        {
          name: '添加设备',
          path: 'add',
          component: './device/DeviceAdd',
          access: 'isLogin',
        },
      ],
    },
    {
      icon: 'experiment',
      name: '实验',
      path: '/experiment',
      routes: [
        {
          name: '历史实验',
          path: 'history',
          component: './experiment/ExperimentHistory',
          access: 'isLogin',
        },
        {
          name: '开始实验',
          path: 'create',
          component: './experiment/ExperimentCreate',
          access: 'isLogin',
        },
      ],
    },
    {
      icon: 'setting',
      name: '系统',
      path: '/system',
      routes: [
        {
          name: '连接设置',
          path: 'connect',
          component: './system/ConnectSettings',
          access: 'isLogin',
        },
        {
          name: '用户管理',
          path: 'user',
          component: './system/UserManager',
          access: 'isLogin',
        },
      ],
    },
    {
      name: '登录',
      path: 'login',
      component: './User/Login',
      layout: false,
    },
    {
      name: '注册',
      path: 'register',
      component: './User/Register',
      layout: false,
    },
    {
      name: '忘记密码',
      path: 'forgetpwd',
      component: './User/ForgetPwd',
      layout: false,
    },
    {
      name: '数据处理',
      path: 'experiment/data-process',
      component: './experiment/DataProcess',
      access: 'isLogin',
      layout: false,
    }
  ],
  dva: {},
  proxy: {
    '/api': {
      'target': 'http://localhost:8081/',
      'changeOrigin': true,
      'pathRewrite': { '^/api' : '' },
    },
  },
  npmClient: 'yarn',
});
