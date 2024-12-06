<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form
                class="mb-[-16px]"
                :model="queryParams"
                inline
            >
                <el-form-item label="员工" prop="staff_id">
                    <el-input class="w-[200px]" v-model="queryParams.name" clearable placeholder="请输入员工" />
                </el-form-item>
                <el-form-item label="配送单号" prop="order_id">
                    <el-input class="w-[200px]" v-model="queryParams.distribution_no" clearable placeholder="请输入配送单号" />
                </el-form-item>
                <el-form-item label="发放状态">
                    <el-select class="w-[200px]" v-model="queryParams.status">
                        <el-option label="全部" value />
                        <el-option label="未发放" :value="1" />
                        <el-option label="已发放" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="配送时间" prop="pay_time">
                    <daterange-picker
                        v-model:startTime="queryParams.start_time"
                        v-model:endTime="queryParams.end_time"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>

<!--                    <export-data-->
<!--                            class="ml-2.5"-->
<!--                            :fetch-fun="apiShopStaffCommissionLists"-->
<!--                            :params="queryParams"-->
<!--                            :page-size="pager.size"-->
<!--                    />-->
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none" v-loading="pager.loading" shadow="never">
<!--            <el-button v-perms="['staff.shop_staff_commission/add']" type="primary" @click="handleAdd">-->
<!--                <template #icon>-->
<!--                    <icon name="el-icon-Plus" />-->
<!--                </template>-->
<!--                新增-->
<!--            </el-button>-->
            <el-button
                    v-perms="['staff.shop_staff_commission/income']"
                    :disabled="!selectData.length"
                    @click="handleIncome(selectData)"
            >
                发放
            </el-button>
            <el-button
                v-perms="['staff.shop_staff_commission/delete']"
                :disabled="!selectData.length"
                @click="handleDelete(selectData)"
            >
                删除
            </el-button>
            <div class="mt-4">
                <el-table :data="pager.lists" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="员工" prop="name" show-overflow-tooltip />
                    <el-table-column label="配送单号" prop="distribution_no" show-overflow-tooltip />
                    <el-table-column label="送达时间" prop="done_time" show-overflow-tooltip />
                    <el-table-column label="佣金(元)" prop="commission" show-overflow-tooltip />
                    <el-table-column label="发放状态" prop="status">
                        <template #default="{ row }">
                            <el-tag   v-if="row.status == 1">未发放</el-tag>
                            <el-tag type="success" v-else-if="row.status == 2">已发放</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" prop="create_time" show-overflow-tooltip />
                    <el-table-column label="操作" width="120" fixed="right">
                        <template #default="{ row }">
<!--                             <el-button-->
<!--                                v-perms="['staff.shop_staff_commission/edit']"-->
<!--                                type="primary"-->
<!--                                link-->
<!--                                @click="handleEdit(row)"-->
<!--                            >-->
<!--                                编辑-->
<!--                            </el-button>-->
                            <el-button
                                    v-if="row.id > 0"
                                    v-show="row.status == 1"
                                    v-perms="['staff.shop_staff_commission/income']"
                                    type="success"
                                    link
                                    @click="handleIncome(row.id)"
                            >
                                发放
                            </el-button>
                            <el-button
                                v-if="row.id > 0"
                                v-perms="['staff.shop_staff_commission/delete']"
                                type="danger"
                                link
                                @click="handleDelete(row.id)"
                            >
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="flex mt-4 justify-end">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
        <edit-popup v-if="showEdit" ref="editRef" :dict-data="dictData" @success="getLists" @close="showEdit = false" />
    </div>
</template>

<script lang="ts" setup name="shopStaffCommissionLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import {
    apiShopStaffCommissionLists,
    apiShopStaffCommissionDelete,
    apiShopStaffCommissionIncome
} from '@/api/shop_staff_commission'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)


// 查询条件
const queryParams = reactive({
    name: '',
    distribution_no: '',
    status: '',
    start_time: '',
    end_time: '',
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
    fetchFun: apiShopStaffCommissionLists,
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

// 删除
const handleDelete = async (id: number | any[]) => {
    await feedback.confirm('确定要删除？')
    await apiShopStaffCommissionDelete({ id })
    getLists()
}

//发放佣金
const handleIncome = async (id: number | any[]) => {
    await feedback.confirm('确定已发放佣金？')
    await apiShopStaffCommissionIncome({ id })
    getLists()
}
onActivated(() => {
    getLists()
})
getLists()
</script>

