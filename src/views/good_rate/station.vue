<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-alert
                type="warning"
                title="温馨提示：门店配送数据在配送完成订单基础下，统计出库商品成本、配送总额、毛收入等"
                :closable="false"
                show-icon
            ></el-alert>
        </el-card>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form
                    class="mb-[-16px]"
                    :model="queryParams"
                    inline
            >
                <el-form-item label="门店" prop="water_station_id">
                    <el-select class="w-80" v-model="queryParams.water_station_id" placeholder="请选择门店" clearable>
                        <el-option v-for="item in stationListOptions" :key="item.id" :label="item.name"
                                   :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="配送时间" prop="date_time">
                    <daterange-picker
                            v-model:startTime="queryParams.start_time"
                            v-model:endTime="queryParams.end_time"
                    />
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
                    <el-table-column label="门店名称" prop="name" show-overflow-tooltip />
                    <el-table-column label="下单客户" prop="user_num" show-overflow-tooltip />
                    <el-table-column label="订单量(单)" prop="done_count" show-overflow-tooltip />
                    <el-table-column label="商品出库量(件)" prop="out_count" show-overflow-tooltip />
                    <el-table-column label="成本(元)" prop="cost_price" show-overflow-tooltip />
                    <el-table-column label="配送总额(元)" prop="price" show-overflow-tooltip />
                    <el-table-column label="毛收入(元)" prop="gross_income" show-overflow-tooltip />
                    <el-table-column label="毛利率" prop="gross_rate" show-overflow-tooltip />
                </el-table>
            </div>
            <div class="flex mt-4 justify-end">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="stationSaleData">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiGoodRateSaleData } from '@/api/good_rate'
import { apiShopWaterStationLists } from '@/api/shop_water_station'


// 查询条件
const queryParams = reactive({
    water_station_id:'',
    //date_time: '',
    start_time: '',
    end_time: '',
})

// 选中数据
const selectData = ref<any[]>([])
const stationListOptions = ref<any[]>([])
const getStationList = async () => {
    try {
        // const userInfo = userStore.userInfo
        // console.log(userInfo)
        const stationLists : any = await apiShopWaterStationLists({ shop_id: 1 })
        stationListOptions.value = stationLists.lists
        console.log(stationListOptions)

    } catch (e) {
        console.log('err', e)
    }
}
getStationList()

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiGoodRateSaleData,
    params: queryParams
})

getLists()
</script>

