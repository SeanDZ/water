<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-alert
                    type="warning"
                    title="温馨提示：累计售出包含线上销售和线下添加水票"
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
                <el-form-item label="水票" prop="name">
                    <el-input class="w-[280px]" v-model="queryParams.name" clearable placeholder="请输入水票名称" />
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
                    <el-table-column label="水票商品" prop="name" show-overflow-tooltip />
                    <el-table-column label="未使用" prop="unused" show-overflow-tooltip />
                    <el-table-column label="已使用" prop="used" show-overflow-tooltip />
                    <el-table-column label="已过期" prop="expire_num" show-overflow-tooltip />
                    <el-table-column label="累计赠送" prop="gift_num" show-overflow-tooltip />
                    <el-table-column label="积分兑换" prop="point_num" show-overflow-tooltip />
                    <el-table-column label="累计售出" prop="sale_num" show-overflow-tooltip />
                </el-table>
            </div>
            <div class="flex mt-4 justify-end">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="userTicketLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiUserTicketLists, apiUserTicketDelete } from '@/api/user_ticket'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'

// 查询条件
const queryParams = reactive({
    name: '',
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiUserTicketLists,
    params: queryParams
})


getLists()
</script>

