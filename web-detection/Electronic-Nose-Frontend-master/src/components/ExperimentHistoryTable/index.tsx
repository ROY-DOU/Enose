import { Button, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';

interface DataType {
  key: string;
  id: string;
  name: string;
  deviceName: string;
}

const dataSource: DataType[] = [
  {
    key: '1',
    id: '1',
    name: '实验1',
    deviceName: '设备1',
  },
  {
    key: '2',
    id: '2',
    name: '实验2',
    deviceName: '设备2',
  },
  {
    key: '3',
    id: '3',
    name: '实验3',
    deviceName: '设备3',
  },
  {
    key: '4',
    id: '4',
    name: '实验4',
    deviceName: '设备4',
  },
  {
    key: '5',
    id: '5',
    name: '实验5',
    deviceName: '设备5',
  },
];

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
    width: '30%',
  },
  {
    title: '设备',
    dataIndex: 'deviceName',
    key: 'deviceName',
    width: '30%',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: '30%',
    render: () => (
      <Space size="middle">
        <Button type="link">查看样本</Button>
        <Button type="link">删除</Button>
      </Space>
    ),
  },
];

const ExperimentHistoryTable: React.FC = () => {
  return <Table bordered dataSource={dataSource} columns={columns} />;
};

export default ExperimentHistoryTable;
