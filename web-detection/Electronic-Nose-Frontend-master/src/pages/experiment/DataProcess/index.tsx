import { PageContainer } from '@ant-design/pro-components';
import { Form, Input, Space, Steps, Select, Transfer } from 'antd';
import { Button } from 'antd/lib/radio';
import { TransferDirection } from 'antd/lib/transfer';
import React, { useEffect, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { createRemoteObj } from '@/services/DummyServer/RemoteInvoke';

const { Step } = Steps;
const { Option } = Select;

const category: React.ReactNode[] = [];
for (let i = 10; i < 36; i++) {
  category.push(<Option key={i}>类{i}</Option>);
}

interface RecordType {
  key: string;
  title: string;
}

const sensor: RecordType[] = Array.from({ length: 32 }).map((_, i) => ({
  key: i.toString(),
  title: `传感器${i + 1}`,
}));

const DataProcess: React.FC = () => {
  const [step, setStep] = useState(0);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [form] = Form.useForm();
  const [options, setOptions] = useState<any>({});
  const expServiceRef = useRef<IRemoteObject>();
  const [expService, setExpService] = useState<any>();
  const [data, setData] = useState<any>();

  useEffect(() => {
    (async () => {
      setExpService(await createRemoteObj('Exp'));
    })();
    return () => {
      expServiceRef.current?.Dispose();
    };
  }, []);

  useEffect(() => {
    expServiceRef.current = expService;
  }, [expService]);

  const onChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[],
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const startCollect = async () => {
    await expService.StartCollect(
      'C:/Users/12283/Desktop/电子鼻测钙果成熟度数据/钙果（七成）/1.xlsx',
    );
    setData(await expService.ReadCollect());
  };

  useEffect(() => {
    if (data) {
      (async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 100);
        });
        const next = await expService.ReadCollect();
        if (next?.length > 0) setData((old: any) => [...old, ...next]);
      })();
    }
  }, [data]);

  useEffect(() => {
    setOptions({
      title: {
        text: '采集数据',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: data?.[0]?.map((e: any, i: any) => `传感器${i + 1}`),
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'value',
      },
      series: data?.[0]?.map((e: any, i: any) => ({
        name: `传感器${i + 1}`,
        type: 'line',
        data: data?.map((e: any, j: any) => [j, e[i]]),
      })),
    });
  }, [data]);

  return (
    <PageContainer ghost>
      <Steps current={step}>
        <Step title="特征提取" />
        <Step title="特征选择" />
        <Step title="模型训练" />
        <Step title="完成" />
      </Steps>
      <div style={{ margin: '32px 0' }}>
        {step === 0 && (
          <>
            <Form
              style={{ maxWidth: 600, width: '100%' }}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              autoComplete="off"
              form={form}
            >
              <Form.Item label="名称" name="name">
                <Input.Password />
              </Form.Item>

              <Form.Item label="分类" name="category">
                <Select mode="multiple" allowClear style={{ width: '100%' }}>
                  {category}
                </Select>
              </Form.Item>

              <Form.Item label="传感器" name="sensor">
                <Transfer
                  dataSource={sensor}
                  targetKeys={targetKeys}
                  selectedKeys={selectedKeys}
                  onChange={onChange}
                  onSelectChange={onSelectChange}
                  titles={['可选', '已选']}
                  render={(item) => item.title}
                />
              </Form.Item>

              <Form.Item label="泵速" name="pump">
                <Select style={{ maxWidth: 200 }}>
                  <Option>1</Option>
                  <Option>2</Option>
                  <Option>3</Option>
                </Select>
              </Form.Item>

              <Form.Item label="采样频率" name="freq">
                <Select style={{ maxWidth: 200 }}>
                  <Option>1</Option>
                  <Option>2</Option>
                  <Option>3</Option>
                </Select>
              </Form.Item>

              <Form.Item label="样本采样时间" name="time">
                <Select style={{ maxWidth: 200 }}>
                  <Option>1</Option>
                  <Option>2</Option>
                  <Option>3</Option>
                </Select>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" onClick={() => setStep(1)}>
                  创建实验
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
        {step === 1 && (
          <>
            <div>
              <ReactECharts option={options} style={{ height: '800px' }} />
            </div>
          </>
        )}
        {step === 2 && <>2</>}
        <Space>
          {step === 1 && (
            <>
              <Button onClick={() => startCollect()}>开始采集</Button>
              <Button onClick={() => setStep(2)}>下一步</Button>
            </>
          )}
          {step === 2 && <Button onClick={() => setStep(3)}>开始分析</Button>}
        </Space>
      </div>
    </PageContainer>
  );
};

export default DataProcess;
