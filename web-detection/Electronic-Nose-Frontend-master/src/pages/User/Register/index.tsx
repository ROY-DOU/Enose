import React, { useState } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import styles from './index.less';

import { history } from '@umijs/max';
import User from '@/services/user';

const Register: React.FC = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [repassword, setRepassword] = useState('')
  // const initialStateModel = useModel('@@initialState')
  // const access = useAccess()
  // const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    history.push('./login');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };


  const  handleRegister = async () => {
    const res = await User.SignUp(username, password)
    console.log(res)
    if (password !==repassword){
      alert("两次密码不相同")
    }else{showModal()}
  }
  return (
    <div className={styles.bg}>
      <div className={styles.login_form}>
        <Form
          name="normal_login"
          className="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <h1>电子鼻平台</h1>
          <Form.Item
            name="phone"
            rules={[{ required: true, message: '请输入用户名!' }]}
            style={{ borderBottom: '1px solid #DCDCDC' }}
          >
            <Input placeholder="用户名" bordered={false}
            onChange={e => setUsername(e.target.value)} />
          </Form.Item>
          {/* <Form.Item
            name="captcha"
            rules={[{ required: true, message: '请输入验证码!' }]}
            style={{ borderBottom: '1px solid #DCDCDC' }}
          >
            <Row>
              <Col span={18}>
                <Input
                  bordered={false}
                  type="password"
                  placeholder="请输入验证码"
                />
              </Col>
              <Col span={6} style={{ float: 'right' }}>
                <Button type="link" style={{ color: '#151830', fontWeight: 'bold' }}>发送验证码</Button>
              </Col>
            </Row>
          </Form.Item> */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请设置密码!' }]}
            style={{ borderBottom: '1px solid #DCDCDC' }}
          >
            <Input
              bordered={false}
              type="password"
              placeholder="密码"
              onChange={e => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="repassword"
            rules={[{ required: true, message: '请确认密码!' }]}
            style={{ borderBottom: '1px solid #DCDCDC' }}
          >
            <Input
              bordered={false}
              type="password"
              placeholder="确认密码"
              onChange={e => setRepassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" onClick={handleRegister}>注册</Button>
            <Modal title="注册成功！" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
              <p>点击跳转至登录界面</p>
            </Modal>
          </Form.Item>
          <Form.Item>
            已有帐号？<a href="./login">点击登录</a>
          </Form.Item>

          {/* <Form.Item name="" valuePropName="checked" style={{ textAlign: 'left' }}>
            <Checkbox style={{ color: '#CCCCCC' }}>我已阅读并同意《<a>用户服务协议</a>》</Checkbox>
          </Form.Item> */}
          {/* <Button size="large" shape="circle"><img src="../weixin.png" alt="微信图片" /></Button> */}

        </Form>
      </div>

      {/* <Footer className={styles.footer}>
        <text>
          底部说明
        </text>
      </Footer> */}
    </div>
  );
}
export default Register
