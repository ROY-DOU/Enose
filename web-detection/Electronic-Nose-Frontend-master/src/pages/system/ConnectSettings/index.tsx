import { PageContainer } from '@ant-design/pro-components';
import { Button, Form, Input } from 'antd';
import React from 'react';

const ConnectSettings: React.FC = () => {
  const [form] = Form.useForm();
  return <PageContainer ghost>
    <Form
        form={form}
        style={{ maxWidth: 600 }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
      >
        <Form.Item
          label="Token"
          name="Id"
          rules={[{ required: true, message: '请输入连接Token!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
  </PageContainer>;
};

export default ConnectSettings;
