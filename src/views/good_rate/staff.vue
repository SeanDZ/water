<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form
                    class="mb-[-16px]"
                    :model="queryParams"
                    inline
            >
                <el-form-item label="门店" prop="water_station_id">
                    <el-select class="w-80" v-model="queryParams.water_station_id" placeholder="" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in waterStationListOptions" :key="item.id" :label="item.name"
                                   :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="员工" prop="staff_id">
                    <el-select class="w-80" v-model="queryParams.staff_id" placeholder="" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in staffListOptions" :key="item.id" :label="item.name"
                                   :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="配送时间" prop="pay_time">
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
                <el-table :data="pager.lists" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="员工" prop="name" show-overflow-tooltip />
                    <el-table-column label="门店" prop="station_name" show-overflow-tooltip />
                    <el-table-column label="配送单量" prop="order_num" show-overflow-tooltip />
                    <el-table-column label="配送件数" prop="delivery_num" show-overflow-tooltip />
                    <el-table-column label="配送费" prop="delivery_price" show-overflow-tooltip />
                    <el-table-column label="楼层费" prop="floor_price" show-overflow-tooltip />
                </el-table>
            </div>
            <!--            <div class="flex mt-4 justify-end">-->
            <!--                <pagination v-model="pager" @change="getLists" />-->
            <!--            </div>-->
        </el-card>
    </div>
</template>

<script lang="ts" setup name="staffData">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiStaffData } from '@/api/good_rate'
import { apiShopWaterStationLists } from '@/api/shop_water_station'
import { apiShopWaterStationStaffLists } from '@/api/shop_water_station_staff'

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
    water_station_id:'',
    staff_id:'',
    start_time: '',
    end_time: '',
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
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


//员工
const staffListOptions = ref<any[]>([])
const geStaffList = async () => {
    try {
        const geStaffLists : any = await apiShopWaterStationStaffLists({  })
        staffListOptions.value = geStaffLists.lists
    } catch (e) {
        console.log('err', e)
        //TODO handle the exception
    }
}
geStaffList()

// 获取字典数据
const { dictData } = useDictData('')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiStaffData,
    params: queryParams
})

getLists()
</script>

