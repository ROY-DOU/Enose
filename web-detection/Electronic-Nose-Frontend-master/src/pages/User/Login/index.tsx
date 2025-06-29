import { Form, Input, Button } from 'antd';
// import { Footer } from 'antd/lib/layout/layout';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { history } from 'umi';
import { useModel, useAccess, useNavigate } from '@umijs/max';
import User from '@/services/user';

const Login: React.FC = () => {
  // console.log("!!!!!!!!!!")
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const initialStateModel = useModel('@@initialState')
  const access = useAccess()
  const navigate = useNavigate()

  const handleLogin = async () => {
    const res = await User.login(username, password)
    if (res.success) {
      initialStateModel.setInitialState({ userInfo: res.data })
    }
  }
  
  useEffect(() => {
    if (access.isLogin) {
      navigate('/', { replace: true })
    }
  }, [access.isLogin])

  // if (!initialStateModel.initialState)
  //   return <></>

  return (
    <div className={styles.bg}>
      <div className={styles.login_form}>
        <Form
          name="normal_login"
          className="login_form"
          initialValues={{ remember: true }}
        // onFinish={onFinish}
        >
          <h1>电子鼻平台</h1>
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input
              placeholder="请输入用户名"
              bordered={false}
              value={username}
              onChange={e => setUsername(e.target.value)} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input
              bordered={false}
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button onClick={() => history.push('./Register')}>注册</Button>
            <Button htmlType="submit" onClick={handleLogin}>登录</Button>
          </Form.Item>
          <Form.Item>
            <a href="./forgetpwd">忘记密码</a>
          </Form.Item>
        </Form>

      </div>
      {/* <Footer className={styles.footer}>
        <text>
          电子鼻平台
        </text>
      </Footer> */}
    </div>
  );
}

export default Login