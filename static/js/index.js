async function initChinaMap() {
  try {
    // 1. 获取中国地图JSON文件
    const response = await fetch('https://raw.githubusercontent.com/Toni-Stark/Toni-Stark.github.io/refs/heads/github-pages/static/plugins/echart/china.json');
    if (!response.ok) {
      throw new Error('地图数据加载失败');
    }
    const chinaJson = await response.json();

    // 2. 验证JSON结构
    console.log('地图JSON结构:', {
      '类型': chinaJson.type || '未知',
      '特性数量': chinaJson.features ? chinaJson.features.length : 0,
      '名称': chinaJson.name || '未命名'
    });

    // 3. 初始化ECharts实例
    const container = document.getElementById('china-map-container');
    const myChart = echarts.init(container, null, {
      renderer: 'canvas',
      devicePixelRatio: window.devicePixelRatio || 1
    });

    // 4. 显示加载动画
    myChart.showLoading();

    // 5. 注册地图 - 使用 'china' 作为地图名
    echarts.registerMap('china', chinaJson);

    // 6. 创建配置
    const option = {
      // 关键：添加背景颜色
      backgroundColor: '#f0f9ff',

      title: {
        text: '中国地图（自定义JSON）',
        left: 'center',
        textStyle: {
          fontSize: 18,
          color: '#333'
        }
      },

      tooltip: {
        trigger: 'item',
        formatter: '{b}'
      },

      // 关键：添加视觉映射（根据数据值显示不同颜色）
      visualMap: {
        show: true,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'],
        calculable: true,
        inRange: {
          color: ['#e0f3f8', '#0868ac']
        },
        textStyle: {
          color: '#000'
        }
      },

      // 关键：使用geo配置，而不是series中的map
      geo: {
        map: 'china',  // 这里引用注册的地图名称
        roam: true,    // 允许缩放和平移
        zoom: 1,       // 初始缩放级别
        center: [105, 36], // 地图中心点[经度, 纬度]

        label: {
          show: true,
          fontSize: 12,
          color: 'rgba(0,0,0,0.8)'
        },

        itemStyle: {
          areaColor: '#f5f5f5',  // 默认区域颜色
          borderColor: '#ccc',   // 边界线颜色
          borderWidth: 1,        // 边界线宽度
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 10
        },

        emphasis: {
          itemStyle: {
            areaColor: '#409EFF', // 高亮时的颜色
            borderWidth: 2
          },
          label: {
            color: '#fff',
            fontSize: 14
          }
        }
      },

      // 系列配置 - 用于显示数据
      series: [
        {
          type: 'map',
          map: 'china',  // 这里也需要引用注册的地图名称
          geoIndex: 0,   // 关联到geo配置
          label: {
            show: true
          },

          // 模拟数据
          data: [
            { name: '广东省', value: 900 },
            { name: '河南省', value: 600 },
            { name: '山东省', value: 800 },
            { name: '四川省', value: 700 },
            { name: '江苏省', value: 850 },
            { name: '河北省', value: 550 },
            { name: '浙江省', value: 750 },
            { name: '湖北省', value: 650 }
            // 可以添加更多省份数据
          ],

          // 数据项样式
          itemStyle: {
            borderColor: '#fff'
          },

          // 高亮状态
          emphasis: {
            itemStyle: {
              areaColor: '#FF6B6B' // 与geo的高亮颜色不同以示区别
            }
          }
        }
      ]
    };

    // 7. 设置选项
    myChart.setOption(option, true); // true表示不合并旧配置

    // 8. 隐藏加载动画
    myChart.hideLoading();

    // 9. 响应窗口大小变化
    window.addEventListener('resize', function() {
      myChart.resize();
    });

    // 10. 强制调整大小（解决某些浏览器的渲染问题）
    setTimeout(() => {
      myChart.resize();
    }, 100);

    return myChart;

  } catch (error) {
    console.error('地图初始化失败:', error);
    // 显示错误信息
    document.getElementById('china-map-container').innerHTML =
        `<div style="text-align:center;padding:50px;color:#f56c6c;">
        <h3>地图加载失败</h3>
        <p>错误信息: ${error.message}</p>
        <p>请检查网络连接或JSON文件路径</p>
      </div>`;
  }
}
document.addEventListener('DOMContentLoaded', async function() {
  await initChinaMap();
});
