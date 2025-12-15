<!-- Echarts -->

// 存储当前地图层级和状态
let myChart = null;
let currentMapName = 'china';
let currentProvinceName = '';
let mapStack = []; // 用于记录地图切换历史
let mapStyle = {
    bg: '#f0f9ff',
    point: '#3B82F6',
    areaColor: '#EFF6FF',
    borderColor: '#93C5FD',
    emphasis: {
        areaColor: '#3B82F6',
        borderColor: '#1D4ED8',
        shadowColor: 'rgba(59, 130, 246, 0.3)',
    },
    select: {
        areaColor: '#1D4ED8',
        borderColor: '#1E40AF',
        shadowColor: 'rgba(29, 78, 216, 0.4)',
    },
    series: {
        areaColor: '#DBEAFE',
        emphasis: {
            areaColor: '#3B82F6',
            shadowColor: 'rgba(59, 130, 246, 0.3)',
        },
        select: {
            areaColor: '#1D4ED8',
            shadowColor: 'rgba(29, 78, 216, 0.5)',
        }
    }
};

<!-- JavaScript -->
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('py-2', 'shadow-md');
        navbar.classList.remove('py-3', 'shadow-sm');
    } else {
        navbar.classList.add('py-3', 'shadow-sm');
        navbar.classList.remove('py-2', 'shadow-md');
    }
});

// 移动端菜单切换
document.getElementById('menu-toggle').addEventListener('click', function () {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});

// 地图主题切换
const initMapThemes = () => {
    const mapContainer = document.getElementById('china-map-container');
    const themeButtons = document.querySelectorAll('.map-theme-btn');
    const mapPoints = document.querySelectorAll('.map-point');

    const themes = {
        blue: {
            bg: '#f0f9ff',
            point: '#3B82F6',
            areaColor: '#EFF6FF',
            borderColor: '#93C5FD',
            emphasis: {
                areaColor: '#3B82F6',
                borderColor: '#1D4ED8',
                shadowColor: 'rgba(59, 130, 246, 0.3)',
            },
            select: {
                areaColor: '#1D4ED8',
                borderColor: '#1E40AF',
                shadowColor: 'rgba(29, 78, 216, 0.4)',
            },
            series: {
                areaColor: '#DBEAFE',
                emphasis: {
                    areaColor: '#3B82F6',
                    shadowColor: 'rgba(59, 130, 246, 0.3)',
                },
                select: {
                    areaColor: '#1D4ED8',
                    shadowColor: 'rgba(29, 78, 216, 0.5)',
                }
            }
        },
        green: {
            bg: '#ecfdf5',
            point: '#10B981',
            areaColor: '#EFF6FF',
            borderColor: '#A7F3D0',
            emphasis: {
                areaColor: '#10B981',
                borderColor: '#059669',
                shadowColor: 'rgba(16, 185, 129, 0.3)',
            },
            select: {
                areaColor: '#059669',
                borderColor: '#047857',
                shadowColor: 'rgba(5, 150, 105, 0.4)',
            },
            series: {
                areaColor: '#D1FAE5',
                emphasis: {
                    areaColor: '#10B981',
                    shadowColor: 'rgba(16, 185, 129, 0.3)',
                },
                select: {
                    areaColor: '#059669',
                    shadowColor: 'rgba(5, 150, 105, 0.5)',
                }
            }
        },
        purple: {
            bg: '#faf5ff',
            point: '#8B5CF6',
            areaColor: '#F5F3FF',
            borderColor: '#C4B5FD',
            emphasis: {
                areaColor: '#8B5CF6',
                borderColor: '#7C3AED',
                shadowColor: 'rgba(139, 92, 246, 0.3)',
            },
            select: {
                areaColor: '#7C3AED',
                borderColor: '#6D28D9',
                shadowColor: 'rgba(124, 58, 237, 0.4)',
            },
            series: {
                areaColor: '#EDE9FE',
                emphasis: {
                    areaColor: '#8B5CF6',
                    shadowColor: 'rgba(139, 92, 246, 0.3)',
                },
                select: {
                    areaColor: '#7C3AED',
                    shadowColor: 'rgba(124, 58, 237, 0.5)',
                }
            }
        },
        amber: {
            bg: '#fffbeb',
            point: '#F59E0B',
            areaColor: '#FFFBEB',
            borderColor: '#FCD34D',
            emphasis: {
                areaColor: '#F59E0B',
                borderColor: '#D97706',
                shadowColor: 'rgba(245, 158, 11, 0.3)',
            },
            select: {
                areaColor: '#D97706',
                borderColor: '#B45309',
                shadowColor: 'rgba(217, 119, 6, 0.4)',
            },
            series: {
                areaColor: '#FEF3C7',
                emphasis: {
                    areaColor: '#F59E0B',
                    shadowColor: 'rgba(245, 158, 11, 0.3)',
                },
                select: {
                    areaColor: '#D97706',
                    shadowColor: 'rgba(217, 119, 6, 0.5)',
                }
            }
        }
    };

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有按钮的激活状态
            themeButtons.forEach(b => b.classList.remove('border-2', 'border-primary', 'border-secondary', 'border-accent', 'border-amber-500'));

            const theme = btn.getAttribute('data-theme');
            const themeData = themes[theme];

            // 设置地图背景色
            mapContainer.style.backgroundColor = themeData.bg;

            // 设置标记点颜色
            mapPoints.forEach(point => {
                point.style.backgroundColor = themeData.point;
            });

            // 添加当前按钮的激活状态
            btn.classList.add('border-2');
            mapStyle = themeData;
            switch (theme) {
                case 'blue':
                    btn.classList.add('border-primary');
                    myChart.setOption(getChinaMapOption(), true);
                    myChart.setOption(getProvinceMapOption(currentMapName, currentProvinceName), true);
                    break;
                case 'green':
                    btn.classList.add('border-secondary');
                    myChart.setOption(getChinaMapOption(), true);
                    myChart.setOption(getProvinceMapOption(currentMapName, currentProvinceName), true);
                    break;
                case 'purple':
                    btn.classList.add('border-accent');
                    myChart.setOption(getChinaMapOption(), true);
                    myChart.setOption(getProvinceMapOption(currentMapName, currentProvinceName), true);
                    break;
                case 'amber':
                    btn.classList.add('border-amber-500');
                    myChart.setOption(getChinaMapOption(), true);
                    myChart.setOption(getProvinceMapOption(currentMapName, currentProvinceName), true);
                    break;
            }
        });
    });
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initMapThemes();

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // 关闭移动端菜单
            document.getElementById('mobile-menu').classList.add('hidden');

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});


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
        myChart.off('click')
        myChart.on('click', handleMapClick);

        // 9. 初始化返回按钮
        initBackButton();

        // 10. 响应窗口大小变化
        window.addEventListener('resize', function () {
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
    let s = mapStyle;
    return {
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
            formatter: function (params) {
                return `${params.name}<br/>点击查看详情`;
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
                areaColor: s.areaColor, // 浅蓝色背景
                borderColor: s.borderColor, // 蓝色边框
                borderWidth: 1,
                shadowColor: 'rgba(0, 0, 0, 0.05)',
                shadowBlur: 5
            },
            emphasis: {
                itemStyle: {
                    areaColor: s.emphasis.areaColor,
                    borderColor: s.emphasis.borderColor,
                    borderWidth: 2,
                    shadowColor: s.emphasis.shadowColor,
                    shadowBlur: 10
                },
                label: {
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            },
            select: {
                itemStyle: {
                    areaColor: s.select.areaColor, // 点击后的深蓝色
                    borderColor: s.select.borderColor,
                    borderWidth: 2,
                    shadowColor: s.select.shadowColor,
                    shadowBlur: 15
                },
                label: {
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            }
        },
        series: [
            {
                type: 'map',
                map: 'china',
                geoIndex: 0,
                label: {
                    show: true,
                    color: '#111827'
                },
                data: [
                    {name: '北京', value: 1000},
                    {name: '天津', value: 800},
                    {name: '河北', value: 700},
                    {name: '山西', value: 600},
                    {name: '内蒙古', value: 500},
                    {name: '辽宁', value: 750},
                    {name: '吉林', value: 650},
                    {name: '黑龙江', value: 600},
                    {name: '上海', value: 950},
                    {name: '江苏', value: 850},
                    {name: '浙江', value: 820},
                    {name: '安徽', value: 620},
                    {name: '福建', value: 710},
                    {name: '江西', value: 580},
                    {name: '山东', value: 850},
                    {name: '河南', value: 700},
                    {name: '湖北', value: 660},
                    {name: '湖南', value: 680},
                    {name: '广东', value: 900},
                    {name: '广西', value: 530},
                    {name: '海南', value: 470},
                    {name: '重庆', value: 750},
                    {name: '四川', value: 730},
                    {name: '贵州', value: 520},
                    {name: '云南', value: 550},
                    {name: '西藏', value: 300},
                    {name: '陕西', value: 610},
                    {name: '甘肃', value: 480},
                    {name: '青海', value: 350},
                    {name: '宁夏', value: 420},
                    {name: '新疆', value: 400},
                    {name: '台湾', value: 690},
                    {name: '香港', value: 880},
                    {name: '澳门', value: 860}
                ],
                itemStyle: {
                    areaColor: s.series.areaColor, // 省份区域颜色
                    borderColor: "#ffffff",
                    borderWidth: 1
                },
                emphasis: {
                    itemStyle: {
                        areaColor:s.series.emphasis.areaColor, // 鼠标悬停主题色
                        borderColor: '#FFFFFF',
                        borderWidth: 2,
                        shadowColor: s.series.emphasis.shadowColor,
                        shadowBlur: 10
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
        myChart.off('click')
        myChart.on('click', () => {
            console.log('logout')
        });

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
    let s = mapStyle;
    return {
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
            formatter: function (params) {
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
                areaColor: s.areaColor, // 浅蓝色背景
                borderColor: s.borderColor, // 蓝色边框
                borderWidth: 1,
                shadowColor: 'rgba(0, 0, 0, 0.05)',
                shadowBlur: 5
            },
            emphasis: {
                itemStyle: {
                    areaColor: s.emphasis.areaColor,
                    borderColor: s.emphasis.borderColor,
                    borderWidth: 2,
                    shadowColor: s.emphasis.shadowColor,
                    shadowBlur: 10
                },
                label: {
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            },
            select: {
                itemStyle: {
                    areaColor: s.select.areaColor, // 点击后的深蓝色
                    borderColor: s.select.borderColor,
                    borderWidth: 2,
                    shadowColor: s.select.shadowColor,
                    shadowBlur: 15
                },
                label: {
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            }
        },
        series: [
            {
                type: 'map',
                map: mapKey,
                geoIndex: 0,
                label: {
                    show: true,
                    color: '#111827'
                },
                itemStyle: {
                    areaColor: s.series.areaColor, // 省份区域颜色
                    borderColor: "#ffffff",
                    borderWidth: 1
                },
                emphasis: {
                    itemStyle: {
                        areaColor:s.series.emphasis.areaColor, // 鼠标悬停主题色
                        borderColor: '#FFFFFF',
                        borderWidth: 2,
                        shadowColor: s.series.emphasis.shadowColor,
                        shadowBlur: 10
                    }
                }
            }
        ]
    };
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
    myChart.off('click')
    myChart.on('click', handleMapClick);
    // 更新返回按钮
    updateBackButton();
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', async function () {
    await initChinaMap();
});

// 核心变量
const modal = document.getElementById('mediaModal');
const closeModal = document.getElementById('closeModal');
const prevMedia = document.getElementById('prevMedia');
const nextMedia = document.getElementById('nextMedia');
const carouselWrapper = document.getElementById('carouselWrapper');
const mediaItems = document.querySelectorAll('.media-item');
const carouselItems = document.querySelectorAll('.carousel-item');
let currentIndex = 0;
const totalItems = carouselItems.length;

// 打开弹窗并定位到对应媒体
mediaItems.forEach(item => {
    item.addEventListener('click', () => {
        // 获取点击项的索引
        currentIndex = parseInt(item.dataset.index);
        // 切换到对应轮播项
        updateCarouselPosition();
        // 显示弹窗
        modal.classList.add('modal-active');
        // 禁止页面滚动
        document.body.style.overflow = 'hidden';
    });
});

// 关闭弹窗
closeModal.addEventListener('click', () => {
    modal.classList.remove('modal-active');
    // 恢复页面滚动
    document.body.style.overflow = '';
    // 暂停视频播放（避免弹窗关闭后视频继续播放）
    const activeVideo = document.querySelector('.carousel-item video');
    if (activeVideo) activeVideo.pause();
});

// 点击弹窗背景关闭
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal.click();
    }
});

// 上一个媒体
prevMedia.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarouselPosition();
    pauseActiveVideo();
});

// 下一个媒体
nextMedia.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarouselPosition();
    pauseActiveVideo();
});

// 更新轮播位置
function updateCarouselPosition() {
    carouselWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// 暂停当前激活的视频（切换时）
function pauseActiveVideo() {
    const allVideos = document.querySelectorAll('.carousel-item video');
    allVideos.forEach(video => video.pause());
}

// 键盘控制（ESC关闭，左右箭头切换）
document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('modal-active')) {
        switch(e.key) {
            case 'Escape':
                closeModal.click();
                break;
            case 'ArrowLeft':
                prevMedia.click();
                break;
            case 'ArrowRight':
                nextMedia.click();
                break;
        }
    }
});
