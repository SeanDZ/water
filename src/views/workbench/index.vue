<template>
    <div class="workbench">
        <div class="lg:flex">
            <el-card class="!border-none mb-4 flex-1" shadow="never">
                <template #header>
                    <div>
                        <span class="card-title">今日数据</span>
                        <span class="text-tx-secondary text-xs ml-4">
                            更新时间：{{ workbenchData.today.time }}
                        </span>
                    </div>
                </template>

                <div class="flex flex-wrap">
                    <el-card class="!border-none mb-4 lg:mr-4" shadow="never" style="background: linear-gradient(to right, #09776e 0%, #74eee4 100%);width: 18%">
                        <img class="text-img" src="@/assets/images/jiedan.png" alt="" />
<!--                        <div class="text-center">-->
                            <div class="text-6xl" style="color: white">{{ workbenchData.today.num }}</div>
                            <div class="text-tx-secondary text-xs" style="color: white;font-size: 14px;float: left">
                                今日下单
                            </div>
                        <div class="text-yesterday">昨日：{{ workbenchData.today.yesterday_num }}</div>
<!--                        </div>-->
                    </el-card>
                    <el-card class="!border-none mb-4 lg:mr-4" shadow="never" style="background: linear-gradient(to right, #dcad58 0%, #dcc395 100%);width: 18%">
                        <img class="text-img" src="@/assets/images/jiedan.png" alt="" />
                        <div class="text-center">
                            <div class="text-6xl" style="color: white">{{ workbenchData.today.num1 }}</div>
                            <div class="text-tx-secondary text-xs" style="color: white;font-size: 14px">
                                待接单
                            </div>
                        </div>
                    </el-card>

                    <el-card class="!border-none mb-4 lg:mr-4" shadow="never"  style="background: linear-gradient(to right, #cb493e 0%, #d9a39f 100%);width: 18%">
                        <img class="text-img" src="@/assets/images/jiedan.png" alt="" />
                        <div class="text-center">
                            <div class="text-6xl" style="color: white">{{ workbenchData.today.num2 }}</div>
                            <div class="text-tx-secondary text-xs" style="color: white;font-size: 14px">
                                配送中
                            </div>
                        </div>
                    </el-card>

                    <el-card class="!border-none mb-4 lg:mr-4" shadow="never" style="background: linear-gradient(to right, #59e182 0%, #99deae 100%);width: 18%">
                        <img class="text-img" src="@/assets/images/jiedan.png" alt="" />
                        <div class="text-center">
                            <div class="text-6xl" style="color: white">{{ workbenchData.today.num4 }}</div>
                            <div class="text-tx-secondary text-xs" style="color: white;font-size: 14px">
                                已超时
                            </div>
                        </div>
                    </el-card>


                    <el-card class="!border-none mb-4 lg:mr-4" shadow="never"  style="background: linear-gradient(to right, #8959e0 0%, #aa94d3 100%);width: 18%">
                        <img class="text-img" src="@/assets/images/in.png" alt="" />
                            <div class="text-6xl" style="color: white"> {{ workbenchData.today.num3 }}</div>
                            <div class="text-tx-secondary text-xs" style="color: white;font-size: 14px;float: left">
                                已完成
                            </div>
                            <div class="text-yesterday">昨日：{{ workbenchData.today.yesterday_num3 }}</div>
                    </el-card>
                </div>

                <div class="flex flex-wrap">
                    <el-card class="!border-none mb-4 lg:mr-4" shadow="never"  style="background: linear-gradient(to right, #8959e0 0%, #aa94d3 100%);width: 18%">
                        <img class="text-img" src="@/assets/images/in.png" alt="" />
                            <div class="text-6xl" style="color: white">￥{{ workbenchData.today.income }}</div>
                            <div class="text-tx-secondary text-xs" style="color: white;font-size: 14px;float: left">
                                总营收
                            </div>
                            <div class="text-yesterday">昨日:￥{{ workbenchData.today.income2 }}</div>
                    </el-card>

                    <el-card class="!border-none mb-4 lg:mr-4" shadow="never" style="background: linear-gradient(to right, #59e182 0%, #99deae 100%);width: 18%">
                        <img class="text-img" src="@/assets/images/in.png" alt="" />
                            <div class="text-6xl" style="color: white">￥{{ workbenchData.today.online_income }}</div>
                            <div class="text-tx-secondary text-xs" style="color: white;font-size: 14px;float: left">
                               商品售卖
                            </div>
                        <div class="text-yesterday">昨日:￥{{ workbenchData.today.online_income2 }}</div>
                    </el-card>

                    <el-card class="!border-none mb-4 lg:mr-4" shadow="never"  style="background: linear-gradient(to right, #cb493e 0%, #d9a39f 100%);width: 18%">
                        <img class="text-img" src="@/assets/images/in.png" alt="" />
                            <div class="text-6xl" style="color: white"> ￥{{ workbenchData.today.ticket_income }}</div>
                            <div class="text-tx-secondary text-xs" style="color: white;font-size: 14px;float: left">
                                水票售卖
                            </div>
                            <div class="text-yesterday">昨日:￥{{ workbenchData.today.ticket_income2 }}</div>
                    </el-card>


                    <el-card class="!border-none mb-4 lg:mr-4" shadow="never" style="background: linear-gradient(to right, #dcad58 0%, #dcc395 100%);width: 18%">
                        <img class="text-img" src="@/assets/images/in.png" alt="" />
                            <div class="text-6xl" style="color: white;">￥{{ workbenchData.today.offline_income }}</div>
                            <div class="text-tx-secondary text-xs" style="color: white;font-size: 14px;float: left">
                                货到付款
                            </div>
                        <div class="text-yesterday">昨日:￥{{ workbenchData.today.offline_income2 }}</div>
                    </el-card>

                    <el-card class="!border-none mb-4 lg:mr-4" shadow="never" style="background: linear-gradient(to right, #61eee2 0%, #b7eee9 100%);width: 18%">
                        <img class="text-img" src="@/assets/images/in.png" alt="" />
                            <div class="text-6xl" style="color: white;">￥{{ workbenchData.today.bucket_income }}</div>
                            <div class="text-tx-secondary text-xs" style="color: white;font-size: 14px;float: left">
                                押金收款
                            </div>
                        <div class="text-yesterday">昨日:￥{{ workbenchData.today.bucket_income2 }}</div>
                    </el-card>
                </div>
            </el-card>
        </div>
<!--        <div class="function mb-4">-->
<!--            <el-card class="flex-1 !border-none" shadow="never">-->
<!--                <template #header>-->
<!--                    <span>常用功能</span>-->
<!--                </template>-->
<!--                <div class="flex flex-wrap">-->
<!--                    <div-->
<!--                        v-for="item in workbenchData.menu"-->
<!--                        class="md:w-[12.5%] w-1/4 flex flex-col items-center"-->
<!--                        :key="item"-->
<!--                    >-->
<!--                        <router-link :to="item.url" class="mb-3 flex flex-col items-center">-->
<!--                            <image-contain width="40px" height="40px" :src="item?.image" />-->
<!--                            <div class="mt-2">{{ item.name }}</div>-->
<!--                        </router-link>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </el-card>-->
<!--        </div>-->

        <div class="md:flex">
            <el-card class="flex-1 !border-none md:mr-4 mb-4" shadow="never">
                <template #header>
                    <span>营收总额</span>
                </template>
                <div>
                    <v-charts
                        style="height: 380px"
                        :option="workbenchData.incomeOption"
                        :autoresize="true"
                    />
                </div>
            </el-card>
            <el-card class="flex-1 !border-none md:mr-4 mb-4" shadow="never">
                <template #header>
                    <span>门店收入</span>
                </template>
                <div>
                    <v-charts
                        style="height: 380px"
                        :option="workbenchData.stationincomeOption"
                        :autoresize="true"
                    />
                </div>
            </el-card>
        </div>

        <div class="md:flex">
            <el-card class="flex-1 !border-none md:mr-4 mb-4" shadow="never">
                <template #header>
                    <span>品牌销量</span>
                </template>
                <div>
                    <v-charts
                        style="height: 380px"
                        :option="workbenchData.brandOption"
                        :autoresize="true"
                    />
                </div>
            </el-card>
            <el-card class="flex-1 !border-none md:mr-4 mb-4" shadow="never">
                <template #header>
                    <span>品牌销售额</span>
                </template>
                <div>
                    <v-charts
                        style="height: 380px"
                        :option="workbenchData.brandsaleOption"
                        :autoresize="true"
                    />
                </div>
            </el-card>
        </div>

        <div class="md:flex">
            <el-card class="flex-1 !border-none md:mr-4 mb-4" shadow="never">
                <template #header>
                    <span>销售额趋势（近15天）</span>
                </template>
                <div>
                    <v-charts
                        style="height: 350px"
                        :option="workbenchData.visitorOption"
                        :autoresize="true"
                    />
                </div>
            </el-card>
            <el-card class="!border-none mb-4" shadow="never">
                <template #header>
                    <span>小程序&微信公众号</span>
                </template>
                <div>
                    <div v-for="(item, index) in workbenchData.support" :key="index">
                        <div
                            class="flex items-center pb-10 pt-10"
                            :class="{
                                'border-b border-br': index == 0
                            }"
                        >
                            <image-contain
                                :width="120"
                                :height="120"
                                class="flex-none"
                                :src="item.image"
                            />
                            <div class="ml-2">
                                <div>{{ item.title }}</div>
                                <div class="text-tx-regular text-xs mt-4">{{ item.desc }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
        <footer-btns>
           <span> Copyright © 2020-2028 E-WATER v1.2.0</span>
        </footer-btns>
    </div>
</template>

<script lang="ts" setup name="workbench">
import { onMounted, onUnmounted, ref } from 'vue';
import { getWorkbench } from '@/api/app'
import { apiShopWaterStationLists } from '@/api/shop_water_station'
import vCharts from 'vue-echarts'

//查询条件
const queryParams = reactive({
    water_station_id:'',
    start_time:'',
    end_time:''
})

// 表单数据
const workbenchData: any = reactive({
    version: {
        version: '', // 版本号
        website: '', // 官网
        based: '',
        channel: {
            gitee: '',
            website: ''
        }
    },
    support: [],
    today: {}, // 今日数据
    menu: [], // 常用功能
    visitor: [], // 访问量
    article: [], // 文章阅读量
    brandNum: [],


    visitorOption: {
        xAxis: {
            type: 'category',
            data: [0]
        },
        yAxis: {
            type: 'value'
        },
        legend: {
            data: ['销售额']
        },
        itemStyle: {
            // 点的颜色。
            color: 'red'
        },
        tooltip: {
            trigger: 'axis'
        },
        series: [
            {
                name: '销售额',
                data: [0],
                type: 'line',
                smooth: true
            }
        ]
    },
    brandOption: {
        title: {
            text: '单位(件)',
            subtext: '',
            left: 'right'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: '品牌销量',
                type: 'pie',
                radius: '55%',
                center: ['60%', '50%'],
                data: [0],
                label: {
                    show: true,
                },
                emphasis: {
                    label: {
                        show: true
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
            },
        ]
    },

    brandsaleOption: {
        title: {
            text: '单位(元)',
            subtext: '',
            left: 'right'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: '品牌销售额',
                type: 'pie',
                radius: '55%',
                center: ['60%', '50%'],
                data: [0],
                // data: [
                //     // 数据数组，name 为数据项名称，value 为数据项值
                //     { value: 235, name: "张三" },
                // ],
                label: {
                    show: true,
                },
                emphasis: {
                    label: {
                        show: true
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
            },
        ]
    },

    incomeOption: {
        title: {
            text: '单位(元)',
            subtext: '',
            left: 'right'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: '营收总额',
                type: 'pie',
                radius: '55%',
                center: ['60%', '50%'],
                data: [0],
                label: {
                    show: true,
                },
                emphasis: {
                    label: {
                        show: true
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
            },
        ]
    },

    stationincomeOption: {
        title: {
            text: '单位(元)',
            subtext: '',
            left: 'right'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: '门店收入',
                type: 'pie',
                radius: '55%',
                center: ['60%', '50%'],
                data: [0],
                label: {
                    show: true,
                },
                emphasis: {
                    label: {
                        show: true
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
            },
        ]
    }
})

// 获取工作台主页数据
const getData = () => {
    getWorkbench()
        .then((res: any) => {
            workbenchData.version = res.version
            workbenchData.today = res.today
            workbenchData.menu = res.menu
            workbenchData.visitor = res.visitor
            workbenchData.support = res.support
            workbenchData.brandNum = res.brandNum
            workbenchData.brandSale = res.brandSale
            workbenchData.income = res.income
            workbenchData.stationIncome = res.stationIncome

            // 清空echarts 数据
            workbenchData.visitorOption.xAxis.data = []
            workbenchData.visitorOption.series[0].data = []

            // 写入从后台拿来的数据
            res.visitor.date.reverse().forEach((item: any) => {
                workbenchData.visitorOption.xAxis.data.push(item)
            })
            res.visitor.list[0].data.forEach((item: any) => {
                workbenchData.visitorOption.series[0].data.push(item)
            })


            workbenchData.brandOption.series[0].data = []
            res.brandNum.forEach((item: any) => {
                workbenchData.brandOption.series[0].data.push(item)
            })

            workbenchData.brandsaleOption.series[0].data = []
            res.brandSale.forEach((item: any) => {
                workbenchData.brandsaleOption.series[0].data.push(item)
            })

            workbenchData.incomeOption.series[0].data = []
            res.income.forEach((item: any) => {
                workbenchData.incomeOption.series[0].data.push(item)
            })

            workbenchData.stationincomeOption.series[0].data = []
            res.stationIncome.forEach((item: any) => {
                workbenchData.stationincomeOption.series[0].data.push(item)
            })
        })
        .catch((err: any) => {
            console.log('err', err)
        })
}

//门店
const waterStationListOptions = ref<any[]>([])
const getWaterStationList = async () => {
    try {
        const getWaterStationLists : any = await apiShopWaterStationLists({  })
        waterStationListOptions.value = getWaterStationLists.lists
    } catch (e) {
        console.log('err', e)
        //TODO handle the exception
    }
}

getWaterStationList()

const ws = new WebSocket('ws://127.0.0.1:2345')

const connect =() =>{

    ws.onopen = () => {
        console.log('WebSocket connection opened')
        ws.send('111')
    }


    ws.onclose = () => {
        console.log('WebSocket connection closed')
    }

    ws.onerror = (error) => {
        console.error('WebSocket error:', error)
    }

    //接收消息时触发
    ws.onmessage = (event) => {
       // const message = JSON.parse(event.data)
        console.log('Received message:', event)
    }
}
onMounted(() => {
    getData()
    connect()
})
</script>

<style lang="scss" scoped>

    .text-center {

        float: left;
        margin-bottom: 10px
    }

    .text-img {
        float: right;
        width: 60px;
        height:60px;
    }
    .text-yesterday {
        color: white;
        font-size: 14px;
        float: left;
        margin-left: 50px;
        margin-bottom: 10px;
    }
</style>
