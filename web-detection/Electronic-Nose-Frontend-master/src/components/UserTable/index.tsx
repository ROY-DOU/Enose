import { Button, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';

interface DataType {
  key: string;
  username: string;
  identity: string;
  lasttime: string;
}

const dataSource: DataType[] = [
  {
    key: '1',
    username: 'admin',
    identity: '管理员',
    lasttime:'2023/1/1'
  },
  {
	key: '2',
	username: 'xiaoming',
	identity: 'user',
	lasttime:'2023/1/1'
  }
];

const columns: ColumnsType<DataType> = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: '20%',
  },
  {
    title: '身份',
    dataIndex: 'identity',
    key: 'identity',
    width: '20%',
  },
  {
    title: '最后登录时间',
    dataIndex: 'lasttime',
    key: 'lasttime',
    width: '20%',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: '20%',
    render: () => (
      <Space size="middle">
        <Button type="link">修改密码</Button>
        <Button type="link">删除</Button>
      </Space>
    ),
  },
];

const UserTable: React.FC = () => {
  return <Table bordered dataSource={dataSource} columns={columns} />;
};

export default UserTable;
