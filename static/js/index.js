async function initChinaMap(){
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

    } catch (error) {
        console.error('地图初始化失败:', error);
        document.getElementById('china-map-container').innerHTML =
            `<div style="text-align:center;padding:50px;color:#f56c6c;">
        <h3>地图加载失败</h3>
        <p>错误信息: ${error.message}</p>
        <p>请检查网络连接或JSON文件路径</p>
      </div>`;
    }

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
    initMapThemes();
}

async function renderSwimmingModal(){
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
    modal.addEventListener('click', (e) =>  {
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

}

function renderSwimmingList() {
    // 定义所有需要展示的数据
    const appData = {
        // 游泳动态数据
        swimmingUpdates: [
            {
                id: 1,
                title: '冷池下水记录',
                description: '没人跟我抢泳池，爽！',
                date: '2025年12月15日',
                resources: [
                    {
                        type: 'image',
                        source: './static/img/source/12-14-1.jpg',
                        alt: '冷池下水记录-1'
                    }
                ]
            },
            {
                id: 2,
                title: '解锁新技能',
                description: '练腿练出新境界，一边打腿一边刷视频！',
                date: '2025年12月14日',
                resources: [
                    {
                        type: 'video',
                        source: './static/img/source/12-14-2.mp4',
                        poster: './static/img/source/12-14-3.jpg',
                        alt: '打腿练习视频'
                    },
                    {
                        type: 'image',
                        source: './static/img/source/12-14-3.jpg',
                        alt: '练习后打卡'
                    }
                ]
            },
            {
                id: 3,
                title: '第n次嘉陵江冬泳',
                description: '降温太快了，游到对岸不敢下水了',
                date: '2025年12月6日',
                resources: [
                    {
                        type: 'image',
                        source: './static/img/source/12-6-1.jpg',
                        alt: '嘉陵江冬泳-1'
                    },
                    {
                        type: 'image',
                        source: './static/img/source/12-6-2.jpg',
                        alt: '嘉陵江冬泳-2'
                    }
                ]
            }
        ],
        // 最近动态数据
        recentActivities: [
            {
                id: 1,
                icon: 'fa-tint',
                iconBg: 'bg-blue-100',
                iconColor: 'text-primary',
                title: '自由泳突破50米',
                description: '今天在泳池成功连续游完50米自由泳，比上周快了3秒，换气节奏更加稳定了！',
                date: '2025年6月15日'
            },
            {
                id: 2,
                icon: 'fa-book',
                iconBg: 'bg-green-100',
                iconColor: 'text-secondary',
                title: '阅读计划完成',
                description: '完成了《游泳技巧大全》的阅读，学到了很多关于身体姿势和划水效率的知识。',
                date: '2025年6月8日'
            },
            {
                id: 3,
                icon: 'fa-trophy',
                iconBg: 'bg-purple-100',
                iconColor: 'text-accent',
                title: '第一次参加游泳比赛',
                description: '虽然没有获奖，但积累了宝贵的比赛经验，看到了自己和专业选手的差距。',
                date: '2025年5月28日'
            }
        ],

    };

    // 渲染游泳动态
    function renderSwimmingUpdates() {
        if (typeof document === 'undefined') return;

        const container = document.querySelector('.swim');
        if (!container) return;
        container.innerHTML = '';

        appData.swimmingUpdates.forEach((item, index) => {
            // 取第一个资源作为预览
            const firstResource = item.resources[0];
            let mediaHtml = '';

            // 渲染预览媒体（图片/视频）
            if (firstResource.type === 'image') {
                mediaHtml = `
                    <img src="${firstResource.source}" alt="${firstResource.alt}" class="w-full h-full object-cover transition-transform hover:scale-105">
                  `;
            } else if (firstResource.type === 'video') {
                mediaHtml = `
                    <video
                      src="${firstResource.source}"
                      poster="${firstResource.poster}"
                      class="w-full h-full object-cover"
                      controlsList="nodownload"
                      preload="metadata"
                    >
                      您的浏览器不支持视频播放
                    </video>
                    <div class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                      <i class="fa fa-play text-white text-xl"></i>
                    </div>
                  `;
            }

            // 渲染单个动态项（新增data-id关联动态项ID）
            const updateHtml = `
                  <div class="flex flex-col md:flex-row gap-4 fade-in" style="animation-delay: ${index * 0.1}s">
                    <div class="flex-shrink-0 w-full md:w-28 h-28 md:h-24 bg-blue-50 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer media-item" 
                         data-item-id="${item.id}"  
                         data-resource-index="0"> 
                      ${mediaHtml}
                    </div>
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900">${item.title}</h4>
                      <p class="text-gray-600 text-sm mt-1">${item.description}</p>
                      <p class="text-gray-400 text-xs mt-2">${item.date}</p>
                    </div>
                  </div>
                `;
            container.innerHTML += updateHtml;
        });

        // 添加查看更多按钮
        container.innerHTML += `
            <button class="w-full mt-4 py-2 text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
              查看更多动态 <i class="fa fa-angle-right ml-1"></i>
            </button>
          `;
    }
    function bindMediaItemClick(){
        const modal = document.getElementById('mediaModal');
        const closeModal = document.getElementById('closeModal');
        const prevMedia = document.getElementById('prevMedia');
        const nextMedia = document.getElementById('nextMedia');
        const carouselWrapper = document.getElementById('carouselWrapper');

        // 当前选中的动态项ID和资源索引
        let currentItemId = null;
        let currentResourceIndex = 0;
        let currentResources = []; // 当前动态项的所有资源

        // 点击媒体预览打开弹窗
        document.querySelectorAll('.media-item').forEach(item => {
            item.addEventListener('click', () => {
                // 获取点击的动态项ID和初始资源索引
                currentItemId = parseInt(item.dataset.itemId);
                currentResourceIndex = parseInt(item.dataset.resourceIndex);

                // 找到对应动态项的所有资源
                currentResources = appData.swimmingUpdates.find(item => item.id === currentItemId).resources;

                // 渲染弹窗轮播内容
                renderCarouselForItem(currentResources);

                // 切换到初始资源
                updateCarouselPosition();

                // 显示弹窗
                modal.classList.add('modal-active');
                document.body.style.overflow = 'hidden';
            });
        });

        // 渲染当前动态项的轮播内容
        function renderCarouselForItem(resources) {
            carouselWrapper.innerHTML = '';
            resources.forEach(resource => {
                let mediaHtml = '';
                if (resource.type === 'image') {
                    mediaHtml = `<img src="${resource.source}" alt="${resource.alt}" class="max-w-full max-h-full object-contain">`;
                } else if (resource.type === 'video') {
                    mediaHtml = `
          <video src="${resource.source}" poster="${resource.poster}" class="max-w-full max-h-full object-contain" controls>
            您的浏览器不支持视频播放
          </video>
        `;
                }
                carouselWrapper.innerHTML += `
        <div class="carousel-item w-full flex-shrink-0 h-full flex items-center justify-center">
          ${mediaHtml}
        </div>
      `;
            });
        }

        // 更新轮播位置
        function updateCarouselPosition() {
            carouselWrapper.style.transform = `translateX(-${currentResourceIndex * 100}%)`;
        }

        // 上一个资源
        prevMedia.addEventListener('click', () => {
            currentResourceIndex = (currentResourceIndex - 1 + currentResources.length) % currentResources.length;
            updateCarouselPosition();
            pauseActiveVideo();
        });

        // 下一个资源
        nextMedia.addEventListener('click', () => {
            currentResourceIndex = (currentResourceIndex + 1) % currentResources.length;
            updateCarouselPosition();
            pauseActiveVideo();
        });

        // 关闭弹窗
        closeModal.addEventListener('click', () => {
            modal.classList.remove('modal-active');
            document.body.style.overflow = '';
            pauseActiveVideo();
        });

        // 暂停当前视频
        function pauseActiveVideo() {
            document.querySelectorAll('.carousel-item video').forEach(video => video.pause());
        }
    }

    // 渲染最近动态
    function renderRecentActivities() {
        // 增加环境判断：仅浏览器环境执行
        if (typeof document === 'undefined') return;

        const container = document.querySelector('.new');
        if (!container) return;

        container.innerHTML = '';

        appData.recentActivities.forEach((item, index) => {
            const activityHtml = `
          <div class="flex gap-4 fade-in" style="animation-delay: ${index * 0.1}s">
            <div class="flex-shrink-0 w-12 h-12 ${item.iconBg} rounded-full flex items-center justify-center">
              <i class="fa ${item.icon} ${item.iconColor} text-xl"></i>
            </div>
            <div class="flex-1">
              <h4 class="font-medium text-gray-900">${item.title}</h4>
              <p class="text-gray-600 text-sm mt-1">${item.description}</p>
              <p class="text-gray-400 text-xs mt-2">${item.date}</p>
            </div>
          </div>
        `;

            container.innerHTML += activityHtml;
        });

        // 添加查看更多按钮
        container.innerHTML += `
            <button class="w-full mt-4 py-2 text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
              查看更多动态 <i class="fa fa-angle-right ml-1"></i>
            </button>
        `;
    }

    renderSwimmingUpdates();
    bindMediaItemClick();
    renderRecentActivities();
}

// 2. 生成卡片HTML的函数
const generateData = {
    modalId: "travelModal",
    modalCloseId: "modalClose",
    modalVideoId: "modalVideo",
    modalTitleId: "modalTitle",
    modalDateId: "modalDate",
    textContentId: "textContent",
    openModalBtnId: "openModalBtn",
    videoPoster: "./static/img/source/daojiao.jpg",
    videoSrc: "./static/img/source/daojiao.mp4",
    videoFallback: "您的浏览器不支持视频播放",
    videoLabel: "视频动态",

    title: "沙坪坝道教协会",
    date: "2025年4月18日",
    description: "面嘉陵，倚红岩，殿宇鎏金暖夜，对岸灯华浸江风",
    tags: ["祈福", "登山", "感受生活"],
    linkText: "阅读完整游记",
    contextList: [
        "暮敛江声，余独赴沙区道协。其地背倚红岩，前临嘉陵，江波如练，静卧暮色。",
        "入殿，鎏灯晕暖覆飞檐，殿内玉皇、王母圣像巍峨，金容肃穆，俯瞰众生，凛然含慈。檐下香案烛明，烟缕轻萦梁间，悄无声息。",
        "余趋案拈香，就烛引燃，青烟婉婉入夜色。凭栏伫立，俄见江间双鸟相逐渡江，羽沾岸灯碎影，贴波徐飞，依依不相离。",
        "心下忽微动，低眉默祷于圣前：愿灵祉垂护，令佳人安适，如双鸟栖枝，新息无忧。",
        "遥睇对岸灯华织锦，流光浸波，晚风携林叶轻吟，扑落襟袖。白日案牍之劳、尘嚣之扰，尽随江风散入圣境清宁。胸臆间惟余灯影江声、圣像慈光，及双鸟渡波的柔痕，与这静穆相融。",
        "俄而月隐梢头，夜露沾衣始觉凉，乃徐步辞归。回望殿宇，鎏灯映红岩，江风送浅香。此夜圣境之静、波影之柔、祈愿之深，已深印襟怀，久不能忘。"
    ],
    timePoints: [0, 5, 10, 15]
};

function generateCardHTML(data) {
    const tagList = data.tags.map(tag =>
        `<span class="bg-blue-50 text-primary text-xs py-1 px-2 rounded-full">${tag}</span>`
    ).join('');

    return `
        <div class="bg-white rounded-2xl shadow-md overflow-hidden card-hover">
            <div class="md:flex">
                <div class="md:w-1/2 relative">
                    <video class="w-full h-full object-cover" controls poster="${data.videoPoster}">
                        <source src="${data.videoSrc}" type="video/mp4">
                        ${data.videoFallback}
                    </video>
                    <div class="absolute top-4 left-4 bg-primary/90 text-white text-xs font-medium py-1 px-3 rounded-full">
                        ${data.videoLabel}
                    </div>
                </div>
                <div class="md:w-1/2 p-6">
                    <div class="flex justify-between items-start mb-4">
                        <h4 class="text-lg font-semibold">${data.title}</h4>
                        <span class="text-gray-400 text-sm">${data.date}</span>
                    </div>
                    <p class="text-gray-600 mb-4">${data.description}</p>
                    <div class="flex flex-wrap gap-2 mb-4">${tagList}</div>
                    <a href="javascript:;" class="inline-flex items-center text-primary font-medium hover:underline" id="${data.openModalBtnId}">
                        ${data.linkText} <i class="fa fa-long-arrow-right ml-1"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
}

function generateModalHTML(data) {
    return `
        <div class="modal-overlay" id="${data.modalId}">
            <div class="modal-container">
                <!-- 弹窗顶部 -->
                <div class="modal-header">
                    <div>
                        <h3 class="text-xl font-semibold text-white" id="${data.modalTitleId}">${data.title}</h3>
                        <p class="text-sm text-gray-300 mt-1" id="${data.modalDateId}">${data.date}</p>
                    </div>
                    <div class="modal-close" id="${data.modalCloseId}">
                        <i class="fa fa-times"></i>
                    </div>
                </div>
                
                <!-- 视频背景 -->
                <div class="modal-video">
                    <video id="${data.modalVideoId}" controls poster="${data.videoPoster}">
                        <source src="${data.videoSrc}" type="video/mp4">
                        ${data.videoFallback}
                    </video>
                </div>
                
                <!-- 文本内容层 -->
                <div class="text-content" id="${data.textContentId}">
                    <!-- 段落由JS动态生成 -->
                </div>
            </div>
        </div>
    `;
}

function initModalLogic(data) {
    // 1. 获取弹窗元素（动态生成后才能获取）
    const modal = document.getElementById(data.modalId);
    const modalVideo = document.getElementById(data.modalVideoId);
    const textContent = document.getElementById(data.textContentId);

    // 2. 生成文本段落
    textContent.innerHTML = '';
    data.contextList.forEach((paragraph, index) => {
        const p = document.createElement('p');
        p.className = 'text-paragraph';
        p.dataset.index = index;
        p.textContent = paragraph;
        textContent.appendChild(p);
    });

    // 3. 视频播放时间监听
    modalVideo.addEventListener('timeupdate', function() {
        const currentTime = Math.floor(this.currentTime);
        data.timePoints.forEach((time, index) => {
            const paragraph = document.querySelector(`.text-paragraph[data-index="${index}"]`);
            if (currentTime >= time && !paragraph.classList.contains('active')) {
                paragraph.classList.add('active');
            }
        });
    });

    // 4. 弹窗交互逻辑
    const openBtn = document.getElementById(data.openModalBtnId);
    const closeBtn = document.getElementById(data.modalCloseId);

    // 打开弹窗
    openBtn.addEventListener('click', function() {
        modal.classList.add('active');
        modalVideo.play().catch(err => console.log('视频自动播放失败：', err));
    });

    // 关闭弹窗
    function closeModal() {
        modal.classList.remove('active');
        modalVideo.pause();
        document.querySelectorAll('.text-paragraph').forEach(p => p.classList.remove('active'));
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => e.target === modal && closeModal());
    document.addEventListener('keydown', (e) => e.key === 'Escape' && modal.classList.contains('active') && closeModal());
}


function initModal() {
    // 1. 设置弹窗标题和时间
    let data = generateData;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDate').textContent = data.date;

    // 2. 设置弹窗视频
    const modalVideo = document.getElementById('modalVideo');
    modalVideo.poster = data.videoPoster;
    modalVideo.querySelector('source').src = data.videoSrc;
    modalVideo.load(); // 重新加载视频配置

    // 3. 生成文本段落（初始隐藏）
    const textContent = document.getElementById('textContent');
    textContent.innerHTML = ''; // 清空原有内容
    data.contextList.forEach((paragraph, index) => {
        const p = document.createElement('p');
        p.className = 'text-paragraph'; // 默认隐藏样式
        p.dataset.index = index; // 标记段落索引
        p.textContent = paragraph;
        textContent.appendChild(p);
    });

    // 4. 监听视频播放时间，控制段落渐显
    modalVideo.addEventListener('timeupdate', function() {
        const currentTime = Math.floor(this.currentTime); // 获取当前播放秒数（取整）
        data.timePoints.forEach((time, index) => {
            const paragraph = document.querySelector(`.text-paragraph[data-index="${index}"]`);
            // 播放时间达到节点且段落未激活 → 显示段落
            if (currentTime >= time && !paragraph.classList.contains('active')) {
                paragraph.classList.add('active');
            }
        });
    });

    // 5. 视频重置时（暂停/关闭），重置段落显示状态
    modalVideo.addEventListener('pause', function() {
        // 可选：暂停时不重置，仅关闭弹窗时重置
    });
}

// ===================== 弹窗交互事件 =====================
function initModalEvents() {
    const modal = document.getElementById('travelModal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('modalClose');
    const modalVideo = document.getElementById('modalVideo');

    // 1. 打开弹窗
    openBtn?.addEventListener('click', function() {
        modal.classList.add('active'); // 显示弹窗
        // 视频自动播放（需用户交互触发，符合浏览器策略）
        modalVideo.play().catch(err => console.log('视频自动播放失败：', err));
    });

    // 2. 关闭弹窗（复用函数）
    function closeModal() {
        modal.classList.remove('active'); // 隐藏弹窗
        modalVideo.pause(); // 暂停视频
        // 重置所有段落为隐藏状态
        document.querySelectorAll('.text-paragraph').forEach(p => {
            p.classList.remove('active');
        });
    }

    // 点击关闭按钮关闭弹窗
    closeBtn.addEventListener('click', closeModal);
    // 点击遮罩层关闭弹窗
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    // 按ESC键关闭弹窗
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// 3. 挂载卡片到页面
function renderCard() {
    const container = document.getElementById('vid_line');
    if (container) {
        container.innerHTML = generateCardHTML(generateData);
    }
    document.body.insertAdjacentHTML('beforeend', generateModalHTML(generateData));

    initModalLogic(generateData);
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', async function() {
        await renderSwimmingModal();
        await renderSwimmingList()
        await initChinaMap();
        await renderCard()
        // 键盘控制（ESC关闭，左右箭头切换）
        document.addEventListener('keydown', (e) => {
            const modal = document.getElementById('mediaModal');
            // 1. 先判断弹窗是否激活，未激活直接返回
            if (!modal || !modal.classList.contains('modal-active')) return;

            let closeModal = document.getElementById('closeModal');
            let prevMedia = document.getElementById('prevMedia');
            let nextMedia = document.getElementById('nextMedia');

            // 2. 阻止默认行为，避免干扰
            if (['Escape', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }

            console.log(closeModal, prevMedia, nextMedia, e.key)
            console.log(e.key === 'Escape',e.key === 'ArrowLeft',e.key === 'ArrowRight')

            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });

            if(e.key === 'Escape'){
                closeModal.dispatchEvent(clickEvent);
            } else if (e.key === 'ArrowLeft') {
                prevMedia.dispatchEvent(clickEvent);
            } else if (e.key === 'ArrowRight') {
                nextMedia.dispatchEvent(clickEvent);
            }
        });
    });
} else {
    console.log('当前运行在Node.js环境，跳过DOM渲染逻辑');
}
