import { Button, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { history } from 'umi';
import { connect } from 'dva'

interface DataType {
  key: string;
  id: string;
  name: string;
  address: string;
  status: string;
}

// const dataSource: DataType[] = [
//   {
//     key: '1',
//     id: '1',
//     name: '设备1',
//     address: '192.168.0.1',
//     status: 'online',
//   },
// ];

const columns: ColumnsType<DataType> = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    width: '10%',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: '20%',
  },
  {
    title: 'IP地址',
    dataIndex: 'address',
    key: 'address',
    width: '20%',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '20%',
    render: (_, { status }) => (
      <Tag color={{ online: 'green', offline: 'magenta' }[status]}>
        {{ online: '在线', offline: '离线' }[status]}
      </Tag>
    ),
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: '20%',
    render: () => (
      <Space size="middle">
        <Button type="link" onClick={() => history.push('/experiment/create')}>创建实验</Button>
        <Button type="link">编辑</Button>
      </Space>
    ),
  },
];

const DeviceTable: React.FC = (DeviceList) => {
  return <Table bordered dataSource={DeviceList.data2} columns={columns} />;
};

const mapStateToProps = ({DeviceList}) => {
	  return {...DeviceList};
};

export default connect(mapStateToProps)(DeviceTable);
