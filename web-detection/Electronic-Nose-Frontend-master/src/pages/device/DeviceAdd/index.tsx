import { PageContainer } from '@ant-design/pro-components';
import { Button, Form, Input } from 'antd';
import { createRemoteObj } from '@/services/DummyServer/RemoteInvoke';
import React, { useEffect, useRef, useState } from 'react';

const DeviceAdd: React.FC = () => {
  const deviceRef = useRef<IRemoteObject>();
  const [deviceService, setDeviceService] = useState<any>();
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      setDeviceService(await createRemoteObj('Device'));
    })();
    return () => {
      deviceRef.current?.Dispose();
    };
  }, []);

  useEffect(() => {
    deviceRef.current = deviceService;
  }, [deviceService]);

  const add = async ({ Id, Name, Remark }: any) => {
    // deviceService?.Invoke<void>('AddDevice', { Id, Name, Remark });
    const res = await deviceService.AddTest(1, 5);
    console.log(res);
  };

  return (
    <PageContainer ghost>
      <Form
        form={form}
        onFinish={(e) => add(e)}
        style={{ maxWidth: 600 }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
      >
        <Form.Item
          label="编号"
          name="Id"
          rules={[{ required: true, message: '请输入设备编号!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="名称"
          name="Name"
          rules={[{ required: true, message: '请输入设备名称!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label="备注" name={'Remark'}>
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            添加
          </Button>
        </Form.Item>
      </Form>
    </PageContainer>
  );
};

export default DeviceAdd;
