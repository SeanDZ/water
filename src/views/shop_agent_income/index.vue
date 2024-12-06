<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form
                class="mb-[-16px]"
                :model="queryParams"
                inline
            >
                <el-form-item label="昵称" prop="nickname">
                    <el-input class="w-[280px]" v-model="queryParams.nickname" clearable placeholder="请输入昵称" />
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input class="w-[280px]" v-model="queryParams.mobile" clearable placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item label="审核状态" prop="status">
                    <el-select class="w-[280px]" v-model="queryParams.status" clearable placeholder="请选择审核状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option
                            v-for="(item, index) in dictData.apply_status"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none" v-loading="pager.loading" shadow="never">
<!--            <el-button v-perms="['agent.shop_agent_income/add']" type="primary" @click="handleAdd">-->
<!--                <template #icon>-->
<!--                    <icon name="el-icon-Plus" />-->
<!--                </template>-->
<!--                新增-->
<!--            </el-button>-->
<!--            <el-button-->
<!--                v-perms="['agent.shop_agent_income/delete']"-->
<!--                :disabled="!selectData.length"-->
<!--                @click="handleDelete(selectData)"-->
<!--            >-->
<!--                删除-->
<!--            </el-button>-->
            <div class="mt-4">
                <el-table :data="pager.lists" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="申请单号" prop="code" min-width="100" />
                    <el-table-column label="昵称" prop="nickname" min-width="100" />
                    <el-table-column label="手机号" prop="mobile" min-width="100" />
                    <el-table-column label="审核状态" prop="status">
                        <template #default="{ row }">
                            <dict-value :options="dictData.apply_status" :value="row.status" />
                        </template>
                    </el-table-column>
                    <el-table-column label="提现备注" prop="remark" show-overflow-tooltip />
                    <el-table-column label="申请时间" prop="create_time" show-overflow-tooltip />
                    <el-table-column label="操作" width="200" fixed="right">
                        <template #default="{ row }">
                            <el-button
                                v-perms="['agent.shop_agent_income/edit']"
                                type="primary"
                                link
                                @click="handleShowIncomeLog(row.id)"
                            >
                                分销记录
                            </el-button>
                            <el-button
                                v-perms="['agent.shop_agent_income/audit']"
                                type="success"
                                link
                                @click="handleAudit(row.id, 1)"
                                v-show="row.status == 2 || row.status == 0"
                            >
                                通过
                            </el-button>
                            <el-button
                                v-perms="['agent.shop_agent_income/audit']"
                                type="danger"
                                link
                                @click="handleAudit(row.id, 2)"
                                v-show="row.status == 0"
                            >
                                驳回
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="flex mt-4 justify-end">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
        <income-log v-model="showIncomeLog" :income-id="selectIncomeId" />
        <edit-popup v-if="showEdit" ref="editRef" :dict-data="dictData" @success="getLists" @close="showEdit = false" />
    </div>
</template>

<script lang="ts" setup name="shopAgentIncomeLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiShopAgentIncomeLists, apiShopAgentIncomeDelete,apiShopAgentIncomeAudit } from '@/api/shop_agent_income'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import IncomeLog from './component/income-log.vue'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)
const showIncomeLog = ref(false)

const selectIncomeId = ref(0)
// 查询条件
const queryParams = reactive({
    nickname: '',
    mobile: '',
    status: '',
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('apply_status')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiShopAgentIncomeLists,
    params: queryParams
})

// 添加
const handleAdd = async () => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('add')
}

// 编辑
const handleEdit = async (data: any) => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('edit')
    editRef.value?.setFormData(data)
}

const handleShowIncomeLog = async (id: number) => {
    showIncomeLog.value = true
    selectIncomeId.value = id
}

// 删除
const handleDelete = async (id: number | any[]) => {
    await feedback.confirm('确定要删除？')
    await apiShopAgentIncomeDelete({ id })
    getLists()
}

//审核
const handleAudit = async (id: number | any[], status: number) => {
    await feedback.confirm('确定要审核？')
    await apiShopAgentIncomeAudit({ id, status })
    getLists()
}

getLists()
</script>

