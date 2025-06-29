// const users = [
//   { id: 0, name: 'Umi', nickName: 'U', gender: 'MALE' },
//   { id: 1, name: 'Fish', nickName: 'B', gender: 'FEMALE' },
// ];
// const state = {
//   isLogin: false
// }
// export default {
//   //登入
//   'POST /api/v1/login': (req: any, res: any) => {
//     res.json({
//       success: true,
//       data: {
//         Id: 0,
//         password: '123456',
//       },
//       errorCode: 0,
//     });
//     state.isLogin = true
//   },
//   //登出
//   'GET /api/v1/logout': (req: any, res: any) => {
//     res.json({
//       success: true,
//       errorCode: 0,
//     });
//     state.isLogin = false
//   },
//   //注册
//   'POST /api/v1/user': (req: any, res: any) => {
//     res.json({
//       success: true,
//       data: {
//         Id: 0,
//         user_name: 'admin',
//         user_email: 'admin@qq.com',
//         password: '123456',
//       },
//       errorCode: 0,
//     });
//     state.isLogin = true
//   },
//   //获取用户信息
//   'GET /api/v1/userinfo': (req: any, res: any) => {
//     if (state.isLogin) {
//       res.json({
//         success: true,
//         data: {
//           Id: 0,
//           user_name: 'admin',
//           user_email: 'admin@qq.com',
//           password: '123456',
//         },
//         errorCode: 0,
//       });
//     }
//     else {
//       res.json({
//         success: false,
//         data: null,
//         errorCode: 403,
//       })
//     }
//   },
//   //修改用户信息
//   // 'PUT /api/v1/user/:id': (req: any, res: any) => {
//   //   res.json({
//   //     success: true,
//   //     data: {
//   //       Id: 0,
//   //       user_name: 'admin',
//   //       user_email: 'admin@qq.com',
//   //       password: '123456',
//   //     },
//   //     errorCode: 0,
//   //   });
//   //   state.isLogin = true
//   // },
// };
