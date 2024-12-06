<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form
                class="mb-[-16px]"
                :model="queryParams"
                inline
            >
                <el-form-item label="用户昵称" prop="user_id">
                    <el-input class="w-[280px]" v-model="queryParams.nickname" clearable placeholder="请输入用户昵称" />
                </el-form-item>
                <el-form-item label="手机号" prop="user_id">
                    <el-input class="w-[280px]" v-model="queryParams.mobile" clearable placeholder="手机号" />
                </el-form-item>
                <el-form-item label="订单号" prop="trade_no">
                    <el-input class="w-[280px]" v-model="queryParams.trade_no" clearable placeholder="请输入订单" />
                </el-form-item>
                <el-form-item label="发放状态">
                    <el-select class="w-[280px]" v-model="queryParams.is_paid">
                        <el-option label="全部" value />
                        <el-option label="已发放" :value="1" />
                        <el-option label="未发放" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none" v-loading="pager.loading" shadow="never">
<!--            <el-button v-perms="['agent.shop_agent_commission/add']" type="primary" @click="handleAdd">-->
<!--                <template #icon>-->
<!--                    <icon name="el-icon-Plus" />-->
<!--                </template>-->
<!--                新增-->
<!--            </el-button>-->
<!--            <el-button-->
<!--                v-perms="['agent.shop_agent_commission/delete']"-->
<!--                :disabled="!selectData.length"-->
<!--                @click="handleDelete(selectData)"-->
<!--            >-->
<!--                删除-->
<!--            </el-button>-->
            <div class="mt-4">
                <el-table :data="pager.lists" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="ID" prop="id" show-overflow-tooltip width="50"/>
                    <el-table-column label="昵称" prop="nickname" show-overflow-tooltip />
                    <el-table-column label="手机号" prop="mobile" show-overflow-tooltip />
                    <el-table-column label="订单号" prop="trade_no" show-overflow-tooltip width="200"/>
<!--                    <el-table-column-->
<!--                        label="订单号"-->
<!--                        prop="trade_no"-->
<!--                        width="150"-->
<!--                    >-->
<!--                        <template #default="{ row }">-->
<!--                            <el-button v-perms="['address.user_address/log']"-->
<!--                                       type="primary"-->
<!--                                       link  @click="handleBucketLog(row,1)">{{row.bucket_add}}</el-button>-->
<!--                        </template>-->
<!--                    </el-table-column>-->

                    <el-table-column label="实付金额" prop="pay_price" show-overflow-tooltip />
                    <el-table-column label="佣金比例(%)" prop="rate" show-overflow-tooltip />
                    <el-table-column label="佣金(元)" prop="commission" show-overflow-tooltip />
                    <el-table-column label="佣金类型" prop="type">
                        <template #default="{ row }">
                            <el-tag v-if="row.type == 1">一级返佣</el-tag>
                            <el-tag type="danger" v-else>二级返佣</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="发放状态" prop="type">
                        <template #default="{ row }">
                            <el-tag type="success" v-if="row.is_paid == 1">已发放</el-tag>
                            <el-tag type="warning" v-else>未发放</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" prop="create_time" show-overflow-tooltip />
<!--                    <el-table-column label="操作" width="120" fixed="right">-->
<!--                        <template #default="{ row }">-->
<!--                             <el-button-->
<!--                                v-perms="['agent.shop_agent_commission/edit']"-->
<!--                                type="primary"-->
<!--                                link-->
<!--                                @click="handleEdit(row)"-->
<!--                            >-->
<!--                                编辑-->
<!--                            </el-button>-->
<!--                            <el-button-->
<!--                                v-perms="['agent.shop_agent_commission/delete']"-->
<!--                                type="danger"-->
<!--                                link-->
<!--                                @click="handleDelete(row.id)"-->
<!--                            >-->
<!--                                删除-->
<!--                            </el-button>-->
<!--                        </template>-->
<!--                    </el-table-column>-->
                </el-table>
            </div>
            <div class="flex mt-4 justify-end">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
        <edit-popup v-if="showEdit" ref="editRef" :dict-data="dictData" @success="getLists" @close="showEdit = false" />
    </div>
</template>

<script lang="ts" setup name="shopAgentCommissionLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiShopAgentCommissionLists, apiShopAgentCommissionDelete } from '@/api/shop_agent_commission'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)


// 查询条件
const queryParams = reactive({
    nickname: '',
    trade_no: '',
    mobile:'',
    is_paid: '',
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
    fetchFun: apiShopAgentCommissionLists,
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
    await apiShopAgentCommissionDelete({ id })
    getLists()
}

getLists()
</script>

