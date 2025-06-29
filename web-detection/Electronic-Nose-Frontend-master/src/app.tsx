import { RunTimeLayoutConfig } from '@umijs/max';
import UserState from './components/UserState';
import UnAuth from './pages/UnAuth';
import User from './services/user';

// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate

export interface IInitialState {
  userInfo?: UserInfo
}

export async function getInitialState(): Promise<IInitialState> {
  const loginResult = await User.getUserInfo()
  return { userInfo: loginResult.data }
}

export const layout: RunTimeLayoutConfig = () => {
  return {
    unAccessible: <UnAuth />,
    rightContentRender: () => <UserState />,
    // breadcrumbRender: false,
    // layout: 'mix',
    menu: {
      locale: false,
    },
  };
};
