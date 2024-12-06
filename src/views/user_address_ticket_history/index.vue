<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form
                class="mb-[-16px]"
                :model="queryParams"
                inline
            >
                <el-form-item label="客户昵称" prop="nickname">
                    <el-input class="w-[280px]" v-model="queryParams.nickname" clearable placeholder="客户昵称" />
                </el-form-item>
                <el-form-item label="水票商品" prop="good_name">
                    <el-input class="w-[280px]" v-model="queryParams.good_name" clearable placeholder="请输入水票商品" />
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input class="w-[280px]" v-model="queryParams.address" clearable placeholder="请输入地址" />
                </el-form-item>
                <el-form-item label="收货手机号" prop="mobile">
                    <el-input class="w-[280px]" v-model="queryParams.mobile" clearable placeholder="收货手机号" />
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
                    <el-table-column label="客户昵称" prop="nickname" show-overflow-tooltip />
                    <el-table-column label="头像" min-width="60">
                        <template #default="{ row }">
                            <el-avatar :src="row.avatar" :size="50" />
                        </template>
                    </el-table-column>
                    <el-table-column label="地址信息" width="250">
                        <template #default="{ row }">
                            <div v-show="row.address_id != 0">收货人：{{row.name}}</div>
                            <div v-show="row.address_id != 0">手机号：{{row.mobile}}</div>
                            <div v-show="row.address_id != 0">地址：{{row.address}} {{row.number}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品" prop="good_name" show-overflow-tooltip />
                    <el-table-column label="变更前" prop="before_num" show-overflow-tooltip />
                    <el-table-column label="变更数量" prop="num">
                        <template #default="{ row }">
                            <el-tag v-if="row.num > 0" type="danger" style="width: 60px;font-size: larger">+{{row.num}}</el-tag>
                            <el-tag type="success" v-else style="width: 60px;font-size: larger">{{row.num}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="变更后" prop="after_num" show-overflow-tooltip />
                    <el-table-column label="类型" prop="type" show-overflow-tooltip />
                    <el-table-column label="订单号" prop="order_no" show-overflow-tooltip />
                    <el-table-column label="备注" prop="description" show-overflow-tooltip />
                    <el-table-column label="更新时间" prop="create_time" show-overflow-tooltip  width="180"/>
<!--                    <el-table-column label="操作" width="120" fixed="right">-->
<!--                        <template #default="{ row }">-->
<!--                             <el-button-->
<!--                                v-perms="['ticket_history.user_address_ticket_history/edit']"-->
<!--                                type="primary"-->
<!--                                link-->
<!--                                @click="handleEdit(row)"-->
<!--                            >-->
<!--                                编辑-->
<!--                            </el-button>-->
<!--                            <el-button-->
<!--                                v-perms="['ticket_history.user_address_ticket_history/delete']"-->
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

<script lang="ts" setup name="userAddressTicketHistoryLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiUserAddressTicketHistoryLists, apiUserAddressTicketHistoryDelete } from '@/api/user_address_ticket_history'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)


// 查询条件
const queryParams = reactive({
    nickname: '',
    address: '',
    mobile: '',
    good_name:'',
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
    fetchFun: apiUserAddressTicketHistoryLists,
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
    await apiUserAddressTicketHistoryDelete({ id })
    getLists()
}

getLists()
</script>

