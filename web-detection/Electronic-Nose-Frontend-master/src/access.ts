import { IInitialState } from "./app";

export default (initialState: IInitialState) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://next.umijs.org/docs/max/access

  const isLogin = !!initialState?.userInfo?.Username
  return {
    isLogin,
  };
};