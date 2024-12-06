<template>
    <div class="code-preview">
        <el-dialog v-model="show" width="1000px" title="分销记录">
            <el-table size="large" v-loading="loading" :data="logLists" height="500">
                <el-table-column label="客户昵称" prop="nickname" min-width="150" />
                <el-table-column label="订单号" prop="trade_no" min-width="250" />
                <el-table-column label="类型" prop="type" min-width="100" >
                    <template #default="{ row }">
                        <el-tag type="success" v-if="row.type == 1">一级佣金</el-tag>
                        <el-tag type="warning" v-else-if="row.type == 2">二级佣金</el-tag>
                        <el-tag v-else>自购</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="比例" prop="rate" min-width="100" >
                    <template #default="{ row }"> {{ row.rate }}% </template>
                </el-table-column>
                <el-table-column label="佣金" prop="commission" min-width="100" />
                <el-table-column label="下单时间" prop="pay_time" min-width="200" />
            </el-table>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { refundLog } from '@/api/finance'
import { apiShopAgentIncomeDetail } from '@/api/shop_agent_income'
const loading = ref(false)
const logLists = ref([])
const props = defineProps<{
    modelValue: boolean
    incomeId: number
}>()

const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void
}>()

const show = computed<boolean>({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

const getRefundLog = async () => {
    loading.value = true
    logLists.value = []
    try {
        const res = await apiShopAgentIncomeDetail({
            record_id: props.incomeId
        })
        logLists.value = res
    } catch (error) {}
    loading.value = false
}

watch(show, (value) => {
    if (value) {
        getRefundLog()
    }
})
</script>
