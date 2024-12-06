<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form
                class="mb-[-16px]"
                :model="queryParams"
                inline
            >
                <el-form-item label="商品品牌" prop="good_brand_id">
                    <el-select class="w-80" v-model="queryParams.good_brand_id" placeholder="" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in goodBrandListOptions" :key="item.id" :label="item.name"
                                   :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称" prop="name">
                    <el-input class="w-[280px]" v-model="queryParams.name" clearable placeholder="请输入商品名称" />
                </el-form-item>
                <el-form-item label="所属门店" prop="water_station_id">
                    <el-select class="w-80" v-model="queryParams.water_station_id" placeholder="" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in waterStationListOptions" :key="item.id" :label="item.name"
                                   :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="支付时间" prop="pay_time">
                    <daterange-picker
                        v-model:startTime="queryParams.start_time"
                        v-model:endTime="queryParams.end_time"
                        :shortcuts="shortcuts"
                        type="daterange"
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
                <el-table :data="pager.lists" @selection-change="handleSelectionChange" class-name="sale-data">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="商品品牌" prop="brand_name" show-overflow-tooltip />
                    <el-table-column label="图片" prop="images">
                        <template #default="{ row }">
                            <el-image style="width:50px;height:50px;" :src="row.images" />
                        </template>
                    </el-table-column>
                    <el-table-column label="商品名称" prop="name" show-overflow-tooltip />
                    <el-table-column label="销售量" prop="num" show-overflow-tooltip />
                    <el-table-column label="销售额(元)" prop="price" show-overflow-tooltip />
                    <el-table-column label="销售额排名" prop="rank" show-overflow-tooltip />
                </el-table>
            </div>
<!--            <div class="flex mt-4 justify-end">-->
<!--                <pagination v-model="pager" @change="getLists" />-->
<!--            </div>-->
        </el-card>
    </div>
</template>

<script lang="ts" setup name="goodRateLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiGoodRateLists } from '@/api/good_rate'
import { apiGoodBrandLists } from "@/api/good_brand";
import { apiShopWaterStationLists } from '@/api/shop_water_station'


const shortcuts = [
    {
        text: '最近七天',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: '最近一月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: '最近三个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
]
// 查询条件
const queryParams = reactive({
    id:'',
    good_brand_id: '',
    water_station_id:'',
    name: '',
    pay_time: '',
    start_time: '',
    end_time: '',
    type: '',
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}

const goodBrandListOptions = ref<any[]>([])
const getGoodBrandList = async () => {
    try {
        const goodBrandListLists : any = await apiGoodBrandLists({ shop_id: 1 })
        goodBrandListOptions.value = goodBrandListLists.lists
    } catch (e) {
        console.log('err', e)
    }
}
getGoodBrandList()

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

// 获取字典数据
const { dictData } = useDictData('')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiGoodRateLists,
    params: queryParams
})

getLists()
</script>
<style>
/* 给el-table的第一行设置样式 */
.sale-data .el-table__body-wrapper tr:first-child td {
    background-color: #F2F2F2FF;
}
</style>
