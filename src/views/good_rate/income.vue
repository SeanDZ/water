<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form
                    class="mb-[-16px]"
                    :model="queryParams"
                    inline
            >
                <el-form-item label="配送时间" prop="done_time">
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
                    <el-table-column label="统计" prop="name" show-overflow-tooltip />
                    <el-table-column label="今日" prop="today" show-overflow-tooltip />
                    <el-table-column label="昨日" prop="yesterday" show-overflow-tooltip />
                    <el-table-column label="本周" prop="this_week" show-overflow-tooltip />
                    <el-table-column label="上周" prop="last_week" show-overflow-tooltip />
                    <el-table-column label="本月" prop="this_month" show-overflow-tooltip />
                    <el-table-column label="上月" prop="last_month" show-overflow-tooltip />
                    <el-table-column label="自定义时间" prop="ps_time" show-overflow-tooltip />
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="staffData">
import { usePaging } from '@/hooks/usePaging'
import { apiShopData } from '@/api/good_rate'

// 查询条件
const queryParams = reactive({
    start_time: '',
    end_time: '',
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}


// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiShopData,
    params: queryParams,
})

getLists()
</script>

