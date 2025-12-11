// 存储当前地图层级和状态
let myChart = null;
let currentMapName = 'china';
let currentProvinceName = '';
let mapStack = []; // 用于记录地图切换历史

async function initChinaMap() {
  try {
    // 1. 获取中国地图JSON文件
    const response = await fetch('https://raw.githubusercontent.com/Toni-Stark/Toni-Stark.github.io/refs/heads/github-pages/static/plugins/map/china.json');
    if (!response.ok) {
      throw new Error('地图数据加载失败');
    }
    const chinaJson = await response.json();

    // 2. 初始化ECharts实例
    const container = document.getElementById('china-map-container');
    myChart = echarts.init(container, null, {
      renderer: 'canvas',
      devicePixelRatio: window.devicePixelRatio || 1
    });

    // 3. 显示加载动画
    myChart.showLoading();

    // 4. 注册全国地图
    echarts.registerMap('china', chinaJson);

    // 5. 创建全国地图配置
    const option = getChinaMapOption();

    // 6. 设置选项
    myChart.setOption(option, true);

    // 7. 隐藏加载动画
    myChart.hideLoading();

    // 8. 添加点击事件监听
    myChart.on('click', handleMapClick);

    // 9. 初始化返回按钮
    initBackButton();

    // 10. 响应窗口大小变化
    window.addEventListener('resize', function() {
      myChart && myChart.resize();
    });

    // 11. 强制调整大小
    setTimeout(() => {
      myChart && myChart.resize();
    }, 100);

    return myChart;

  } catch (error) {
    console.error('地图初始化失败:', error);
    document.getElementById('china-map-container').innerHTML =
        `<div style="text-align:center;padding:50px;color:#f56c6c;">
        <h3>地图加载失败</h3>
        <p>错误信息: ${error.message}</p>
        <p>请检查网络连接或JSON文件路径</p>
      </div>`;
  }
}

// 获取全国地图配置
function getChinaMapOption() {
  return {
    backgroundColor: '#f0f9ff',
    title: {
      text: '中国地图',
      left: 'center',
      subtext: '点击省份查看详情',
      subtextStyle: {
        fontSize: 12,
        color: '#666'
      },
      textStyle: {
        fontSize: 18,
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return `${params.name}<br/>点击查看详情`;
      }
    },
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
    geo: {
      map: 'china',
      roam: true,
      zoom: 1,
      center: [105, 36],
      label: {
        show: true,
        fontSize: 12,
        color: 'rgba(0,0,0,0.8)'
      },
      itemStyle: {
        areaColor: '#f5f5f5',
        borderColor: '#ccc',
        borderWidth: 1,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowBlur: 10
      },
      emphasis: {
        itemStyle: {
          areaColor: '#409EFF',
          borderWidth: 2
        },
        label: {
          color: '#fff',
          fontSize: 14
        }
      }
    },
    series: [
      {
        type: 'map',
        map: 'china',
        geoIndex: 0,
        label: {
          show: true
        },
        data: [
          { name: '北京', value: 1000 },
          { name: '天津', value: 800 },
          { name: '河北', value: 700 },
          { name: '山西', value: 600 },
          { name: '内蒙古', value: 500 },
          { name: '辽宁', value: 750 },
          { name: '吉林', value: 650 },
          { name: '黑龙江', value: 600 },
          { name: '上海', value: 950 },
          { name: '江苏', value: 850 },
          { name: '浙江', value: 820 },
          { name: '安徽', value: 620 },
          { name: '福建', value: 710 },
          { name: '江西', value: 580 },
          { name: '山东', value: 850 },
          { name: '河南', value: 700 },
          { name: '湖北', value: 660 },
          { name: '湖南', value: 680 },
          { name: '广东', value: 900 },
          { name: '广西', value: 530 },
          { name: '海南', value: 470 },
          { name: '重庆', value: 750 },
          { name: '四川', value: 730 },
          { name: '贵州', value: 520 },
          { name: '云南', value: 550 },
          { name: '西藏', value: 300 },
          { name: '陕西', value: 610 },
          { name: '甘肃', value: 480 },
          { name: '青海', value: 350 },
          { name: '宁夏', value: 420 },
          { name: '新疆', value: 400 },
          { name: '台湾', value: 690 },
          { name: '香港', value: 880 },
          { name: '澳门', value: 860 }
        ],
        itemStyle: {
          borderColor: '#fff'
        },
        emphasis: {
          itemStyle: {
            areaColor: '#FF6B6B'
          }
        }
      }
    ]
  };
}

// 处理地图点击事件
async function handleMapClick(params) {
  if (!params.name) return;

  console.log('点击地区:', params.name);

  // 保存当前地图状态
  if (currentMapName !== params.name) {
    mapStack.push({
      mapName: currentMapName,
      provinceName: currentProvinceName
    });
  }

  // 切换到省份地图
  await switchToProvinceMap(params.name);
}

// 切换到省份地图
async function switchToProvinceMap(provinceName) {
  try {
    const container = document.getElementById('china-map-container');

    // 显示加载动画
    myChart = echarts.init(container, null, {
      renderer: 'canvas',
      devicePixelRatio: window.devicePixelRatio || 1
    });
    myChart.showLoading();

    // 根据省份名称构建JSON文件路径
    // 注意：你需要有各省份的JSON文件
    const provinceJson = getProvinceJsonUrl(provinceName);

    console.log('加载省份JSON:', provinceJson);

    // 尝试加载省份JSON
    const response = await fetch(provinceJson.url);

    if (!response.ok) {
      throw new Error(`无法加载 ${provinceName} 的地图数据`);
    }

    const provinceObj = await response.json();

    // 注册省份地图
    const mapKey = provinceJson.key;
    echarts.registerMap(mapKey, provinceObj);

    // 更新当前状态
    currentMapName = mapKey;
    currentProvinceName = provinceName;
    // 创建省份地图配置
    const option = getProvinceMapOption(mapKey, provinceName);

    // 更新图表
    myChart.setOption(option, true);

    // 隐藏加载动画
    myChart.hideLoading();

    // 更新返回按钮
    updateBackButton();

    console.log(`已切换到 ${provinceName} 地图`);

  } catch (error) {
    console.error('切换省份地图失败:', error);
    myChart.hideLoading();

    // 如果加载失败，显示提示信息
    alert(`无法加载 ${provinceName} 的地图数据\n错误: ${error.message}`);
  }
}

// 构建省份JSON文件URL
function getProvinceJsonUrl(provinceName) {
  // 这里需要根据你的文件存储结构来构建URL
  // 假设省份JSON文件存储在 provinces/ 目录下

  // 省份名称映射到文件名（去掉特殊字符）
  const fileNameMap = {
    '北京': 'beijing',
    '天津': 'tianjin',
    '河北': 'hebei',
    '山西': 'shanxi',
    '内蒙古': 'neimenggu',
    '辽宁': 'liaoning',
    '吉林': 'jilin',
    '黑龙江': 'heilongjiang',
    '上海': 'shanghai',
    '江苏': 'jiangsu',
    '浙江': 'zhejiang',
    '安徽': 'anhui',
    '福建': 'fujian',
    '江西': 'jiangxi',
    '山东': 'shandong',
    '河南': 'henan',
    '湖北': 'hubei',
    '湖南': 'hunan',
    '广东': 'guangdong',
    '广西': 'guangxi',
    '海南': 'hainan',
    '重庆': 'chongqing',
    '四川': 'sichuan',
    '贵州': 'guizhou',
    '云南': 'yunnan',
    '西藏': 'xizang',
    '陕西': 'shanxi1', // 注意：山西和陕西拼音相同
    '甘肃': 'gansu',
    '青海': 'qinghai',
    '宁夏': 'ningxia',
    '新疆': 'xinjiang',
    '台湾': 'taiwan',
    '香港': 'xianggang',
    '澳门': 'aomen'
  };
  const fileName = fileNameMap[provinceName] || provinceName.toLowerCase().replace(/[省市自治区特别行政区]/g, '');

  // 修改为你的实际JSON文件路径
  return {
    url: `https://raw.githubusercontent.com/Toni-Stark/Toni-Stark.github.io/refs/heads/github-pages/static/plugins/map/provinces/${decodeURIComponent(fileName)}.json`,
    key: fileName
  }
}

// 获取省份地图配置
function getProvinceMapOption(mapKey, provinceName) {
  return {
    backgroundColor: '#f0f9ff',
    title: {
      text: `${provinceName}地图`,
      left: 'center',
      subtext: '点击返回上一级',
      subtextStyle: {
        fontSize: 12,
        color: '#666'
      },
      textStyle: {
        fontSize: 18,
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return `${params.name}`;
      }
    },
    geo: {
      map: mapKey,
      roam: true,
      zoom: 1,
      label: {
        show: true,
        fontSize: 10,
        color: 'rgba(0,0,0,0.8)'
      },
      itemStyle: {
        areaColor: '#f5f5f5',
        borderColor: '#ccc',
        borderWidth: 1
      },
      emphasis: {
        itemStyle: {
          areaColor: '#409EFF',
          borderWidth: 2
        },
        label: {
          color: '#fff',
          fontSize: 12
        }
      }
    },
    series: [
      {
        type: 'map',
        map: mapKey,
        geoIndex: 0,
        label: {
          show: true
        },
        // 这里可以添加省份内的城市数据
        data: getProvinceData(provinceName),
        itemStyle: {
          borderColor: '#fff'
        },
        emphasis: {
          itemStyle: {
            areaColor: '#FF6B6B'
          }
        }
      }
    ]
  };
}

// 获取省份数据（示例数据）
function getProvinceData(provinceName) {
  // 这里可以根据省份返回不同的数据
  const provinceData = {
    '广东省': [
      { name: '广州市', value: 1000 },
      { name: '深圳市', value: 900 },
      { name: '珠海市', value: 500 },
      { name: '东莞市', value: 600 },
      { name: '佛山市', value: 550 }
    ],
    '江苏省': [
      { name: '南京市', value: 800 },
      { name: '苏州市', value: 850 },
      { name: '无锡市', value: 600 },
      { name: '常州市', value: 400 },
      { name: '徐州市', value: 350 }
    ],
    '浙江省': [
      { name: '杭州市', value: 850 },
      { name: '宁波市', value: 700 },
      { name: '温州市', value: 500 },
      { name: '绍兴市', value: 400 },
      { name: '嘉兴市', value: 350 }
    ]
    // 可以继续添加其他省份的数据
  };

  return provinceData[provinceName] || [];
}

// 初始化返回按钮
function initBackButton() {
  const container = document.getElementById('china-map-container');
  const backButton = document.createElement('button');
  backButton.id = 'map-back-button';
  backButton.innerHTML = '返回全国地图';
  backButton.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    padding: 8px 16px;
    background: #409EFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: none;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  `;

  backButton.addEventListener('click', goBackToChinaMap);

  // 将按钮添加到地图容器中
  container.style.position = 'relative';
  container.appendChild(backButton);
}

// 更新返回按钮显示状态
function updateBackButton() {
  const backButton = document.getElementById('map-back-button');
  if (backButton) {
    backButton.style.display = currentMapName !== 'china' ? 'block' : 'none';
    backButton.innerHTML = mapStack.length > 1 ? '返回上一级' : '返回全国地图';
  }
}

// 返回全国地图
function goBackToChinaMap() {
  if (mapStack.length > 0) {
    const prevState = mapStack.pop();

    if (prevState.mapName === 'china') {
      // 返回全国地图
      myChart.setOption(getChinaMapOption(), true);
      currentMapName = 'china';
      currentProvinceName = '';
    } else {
      // 理论上这里可以处理多级返回，但需要加载对应地图
      // 简化处理：直接返回全国地图
      myChart.setOption(getChinaMapOption(), true);
      currentMapName = 'china';
      currentProvinceName = '';
      mapStack = []; // 清空历史栈
    }
  } else {
    // 直接返回全国地图
    myChart.setOption(getChinaMapOption(), true);
    currentMapName = 'china';
    currentProvinceName = '';
  }

  // 更新返回按钮
  updateBackButton();
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', async function() {
  // await initChinaMap();
  await switchToProvinceMap('内蒙古');

});
