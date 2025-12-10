// 步骤2 & 3：异步加载JSON数据，初始化并渲染地图
async function initChinaMap() {
  // 2.1 获取你的中国地图JSON文件
  const response = await fetch('./static/plugins/echart/china.json'); // 请确保路径正确
  const chinaJson = await response.json();

  // 2.2 注册地图。'myChina' 是自定义的地图名
  echarts.registerMap('myChina', chinaJson);

  // 3.1 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(document.getElementById('china-map-container'));

  // 3.2 指定图表的配置项
  const option = {
    title: {
      text: '中国地图（自定义JSON）',
      left: 'center'
    },
    tooltip: {
      trigger: 'item', // 鼠标悬停触发
      formatter: '{b}' // 显示区域名称
    },
    visualMap: { // 视觉映射组件，可用于根据数据值着色
      min: 0,
      max: 1000,
      text: ['高', '低'],
      calculable: true, // 是否显示拖拽用的手柄
      orient: 'horizontal',
      left: 'center',
      bottom: '20px'
    },
    series: [
      {
        type: 'map', // 系列类型为地图
        map: 'myChina', // 地图名称，必须与registerMap注册的名称一致
        roam: true, // 开启鼠标缩放和平移漫游
        label: {
          show: true // 显示省份名称
        },
        emphasis: { // 高亮状态下的样式
          label: {
            color: '#fff'
          },
          itemStyle: {
            areaColor: '#409EFF' // 高亮时的颜色
          }
        },
        // 模拟数据，你可以替换成自己的真实数据
        data: [
          { name: '广东省', value: 900 },
          { name: '河南省', value: 600 },
          { name: '山东省', value: 800 },
          { name: '四川省', value: 700 }
          // ... 其他省份数据
        ]
      }
    ]
  };

  // 4. 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);

  // 可选：添加点击事件
  myChart.on('click', function (params) {
    if (params.componentType === 'series') {
      alert('你点击了：' + params.name);
    }
  });
}

// 页面加载完成后执行
window.onload = async function (){
  await initChinaMap();
}
