import React, { useState } from 'react';
import { Form, Input, Button, Modal, Row, Col } from 'antd';
import styles from './index.less';
import { history } from '@umijs/max';

const ForgetPwd: React.FC = () => {

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
            rules={[{ required: true, message: '请输入邮箱!' }]}
            style={{ borderBottom: '1px solid #DCDCDC' }}
          >
            <Input placeholder="请输入邮箱" bordered={false} />
          </Form.Item>
          <Form.Item
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
                <Button type="link">发送验证码</Button>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请设置新密码!' }]}
            style={{ borderBottom: '1px solid #DCDCDC' }}
          >
            <Input
              bordered={false}
              type="password"
              placeholder="请输入新密码"
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" onClick={showModal} className={styles.modify}>修改密码</Button>
            <Modal title="修改成功！" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
              <p>点击跳转至登录界面</p>
            </Modal>

          </Form.Item>
          <Form.Item>
            <a href="./login">返回登录界面</a>
          </Form.Item>

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
export default ForgetPwd
