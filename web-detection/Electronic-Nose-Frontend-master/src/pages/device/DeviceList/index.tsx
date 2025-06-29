import { PageContainer } from '@ant-design/pro-components';
import { Button, Input, Space } from 'antd';
import { history } from 'umi';
import React from 'react';
import DeviceTable from '@/components/DeviceTable';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import request from "umi-request";

const DeviceList: React.FC = () => {
  return (
    <PageContainer ghost>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex' }}>
          <Button
            type="primary"
            onClick={() => history.push('add')}
            icon={<PlusOutlined />}
          >
            添加设备
          </Button>
          <div style={{ flexGrow: 1 }} />
          <Input
            style={{ maxWidth: 240 }}
            placeholder="筛选"
            prefix={<SearchOutlined />}
          />
        </div>
        <DeviceTable />
      </Space>
    </PageContainer>
  );
};

export default DeviceList;
