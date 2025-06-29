import ReactECharts from "echarts-for-react";
import { useEffect, useRef, useState } from "react";

function Chart(props) {
  const { data, config, ...rest } = props;
  const chartOption = {
    title: {
      text: ""
    },
    tooltip: {
      trigger: "axis",
      confine: true
    },
    legend: {
      selector: [
        {
          type: "all",
          title: "全选"
        },
        {
          type: "inverse",
          title: "反选"
        }
      ],
      selectorPosition: "start",
      data: Array.from({ length: 24 }, (_, index) => `传感器${index}`),
      type: "scroll",
      right: 30,
      top: 2
    },
    grid: {
      left: 10,
      right: 20,
      bottom: 10,
      top: 50,
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {
          name: "传感器数据"
        }
      }
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: (() => {
        const arr = Array
          .from({ length: data[0]?.length ?? 0 })
          .map((_, index) => index.toString());
        if (config.graph.showLastNColumns.enable) {
          return arr.slice(-config.graph.showLastNColumns.n);
        } else {
          return arr;
        }
      })()
    },
    yAxis: {
      type: "value"
    },
    series: Array
      .from({ length: 24 }, (_, index) => `传感器${index}`)
      .map((name, index) => ({
        name,
        type: "line",
        data: (() => {
          const arr = data[index] ?? [];
          if (config.graph.showLastNColumns.enable) {
            return arr.slice(-config.graph.showLastNColumns.n);
          } else {
            return arr;
          }
        })()
      }))
  };
  const chartContainerRef = useRef(null);
  const [chartContainerSize, setChartContainerSize] = useState([0, 0]);
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setChartContainerSize([width, height]);
    });
    observer.observe(chartContainerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [chartContainerRef]);
  return (
    <div {...rest} ref={chartContainerRef}>
      <ReactECharts option={chartOption}
                    style={{
                      height: chartContainerSize[1]
                    }} />
    </div>
  );
}

export default Chart;
