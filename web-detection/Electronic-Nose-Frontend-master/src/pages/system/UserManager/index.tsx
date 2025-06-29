import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from 'umi';
import { Button, Input, Space } from 'antd';
import React from 'react';
import UserTable from '@/components/UserTable';

const UserManager: React.FC = () => {
  return <PageContainer ghost>
    <Space direction="vertical" style={{ width: '100%' }}>
      <div style={{ display: 'flex' }}>
        <Button
          type="primary"
          onClick={() => history.push('create')}
          icon={<PlusOutlined />}
        >
          创建用户
        </Button>
        <div style={{ flexGrow: 1 }} />
        <Input
          style={{ maxWidth: 240 }}
          placeholder="筛选"
          prefix={<SearchOutlined />}
        />
      </div>
      <UserTable />
    </Space>
  </PageContainer>;
};

export default UserManager;
