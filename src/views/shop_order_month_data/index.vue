<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form class="mb-[-16px]" :model="queryParams" inline>

                <el-form-item label="月份" prop="month">
                    <el-input
                        class="w-[280px]"
                        v-model="queryParams.month"
                        clearable
                        placeholder="202412"
                    />
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input
                        class="w-[280px]"
                        v-model="queryParams.address"
                        clearable
                        placeholder="请输入地址"
                    />
                </el-form-item>

                <el-form-item label="手机号" prop="mobile">
                    <el-input
                        class="w-[280px]"
                        v-model="queryParams.mobile"
                        clearable
                        placeholder="请输入手机号"
                    />
                </el-form-item>

                <el-form-item label="结算状态">
                    <el-select class="w-[280px]" v-model="queryParams.status">
                        <el-option label="全部" value />
                        <el-option label="已结算" :value="1" />
                        <el-option label="未结算" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none" v-loading="pager.loading" shadow="never">
            <div class="mt-4">
                <el-table :data="pager.lists" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="月份" prop="month" show-overflow-tooltip/>
                    <el-table-column label="客户信息" min-width="160">
                        <template #default="{ row }">
                            <div class="flex items-center">
                                <image-contain
                                    class="flex-none mr-2"
                                    :src="row.avatar"
                                    :width="50"
                                    :height="50"
                                    preview-teleported
                                    fit="contain"
                                />
                             {{ row.nickname }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="地址" prop="address" show-overflow-tooltip width="280"/>
                    <el-table-column label="手机号" prop="mobile" show-overflow-tooltip width="200"/>
                    <el-table-column label="订单量(单)" prop="order_num" show-overflow-tooltip/>
                    <el-table-column label="配送商品量(件)" prop="good_num" show-overflow-tooltip/>
                    <el-table-column label="配送总金额(元)" prop="price" show-overflow-tooltip/>
                    <el-table-column label="结算状态" prop="is_pay">
                        <template #default="{ row }">
                            <el-tag type="success" v-if="row.status == 1">已结算</el-tag>
                            <el-tag type="warning" v-else-if="row.status == 0">未结算</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="结算时间" prop="pay_time" show-overflow-tooltip width="200"/>
                    <el-table-column label="操作" width="180" fixed="right">
                        <template #default="{ row }">
                            <el-button v-perms="['order.shop_order/month_order_data_detail']" type="primary" link>
                                <router-link
                                    :to="{
                                    path: 'shop_order_month_data/detail', //菜单->路由路径
                                    query: {
                                        order_month_id: row.id
                                    }
                                }"
                                >
                                    下单记录
                                </router-link>
                            </el-button>

                            <el-button
                                v-perms="['order.shop_order/delete']"
                                type="danger"
                                link
                                @click="handlePaid(row.id)"
                                v-show="row.status == 0"
                            >
                                结算账单
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="flex mt-4 justify-end">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="shopOrderLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import {apiShopOrderMonthOrderData, apiShopOrderDelete, apiShopOrderMonthOrderDone} from '@/api/shop_order'
import { apiShopWaterStationLists } from '@/api/shop_water_station'
import feedback from '@/utils/feedback'

// 查询条件
const queryParams = reactive({
    mobile: '',
    address: '',
    status: '',
    month:'',
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('pay_status,refund_status,pay_type')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiShopOrderMonthOrderData,
    params: queryParams
})

// 删除
const handlePaid = async (id: number | any[]) => {
    await feedback.confirm('确定本月账单已结算？')
    await apiShopOrderMonthOrderDone({ id })
    getLists()
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
getLists()
</script>

