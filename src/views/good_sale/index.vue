<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-alert
                type="warning"
                title="温馨提示：会员用户默认根据平台设置的会员折扣价，拼团和秒杀等营销活动商品不根据折扣价出售"
                :closable="false"
                show-icon
            ></el-alert>
        </el-card>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form class="mb-[-16px]" :model="queryParams" inline>
                <el-form-item label="商品名称" prop="name">
                    <el-input class="w-[280px]" v-model="queryParams.name" clearable placeholder="请输入名称" />
                </el-form-item>
                <el-form-item label="是否上架" prop="status">
                    <el-select
                        class="w-[150px]"
                        v-model="queryParams.status"
                        clearable
                        placeholder="请选择是否上架"
                    >
                        <el-option label="全部" value=""></el-option>
                        <el-option
                            v-for="(item, index) in dictData.good_status"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none" v-loading="pager.loading" shadow="never">
            <el-tabs v-model="activeTab" @tab-change="handleTabChange">
                <el-tab-pane
                    v-for="(item, index) in tabLists"
                    :label="`${item.name}`"
                    :name="index"
                    :key="index"
                >
            <el-button v-perms="['good.good/cancel_sale']" :disabled="!selectData.length"
                       @click="handleDelete(selectData)">
                取消参与
            </el-button>
            <div class="mt-4">
                <el-table :data="pager.lists" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="商品名称" prop="name" show-overflow-tooltip />
                    <el-table-column label="品牌" prop="brand_name" show-overflow-tooltip />
                    <el-table-column label="图片" prop="images">
                        <template #default="{ row }">
                            <el-image  v-show="row.images" style="width:50px;height:50px;" :src="row.images" />
                        </template>
                    </el-table-column>
                    <el-table-column label="类型" prop="status">
                        <template #default="{ row }">
                            <el-tag v-if="row.type == 1">普通商品</el-tag>
                            <el-tag type="danger" v-else-if="row.type == 2">水票套餐</el-tag>
                            <el-tag type="danger" v-else-if="row.type == 3">组合套餐</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否上架" prop="status">
                        <template #default="{ row }">
                            <el-tag v-if="row.status == 1">售卖中</el-tag>
                            <el-tag type="danger" v-else>已下架</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="成本价" prop="cost_price" show-overflow-tooltip />
                    <el-table-column label="售价" prop="price" show-overflow-tooltip />
                    <el-table-column label="折扣价" prop="vip_price" width="150" show-overflow-tooltip />
                    <el-table-column label="是否参与折扣" prop="is_vip">
                        <template #default="{ row }">
                            <el-tag v-if="row.is_vip == 0">不参与</el-tag>
                            <el-tag type="success" v-else>参与</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="160" fixed="right">
                        <template #default="{ row }">
                            <el-button v-perms="['good.good_brand/edit']" type="primary" link @click="handleEdit(row)">
                                设置折扣价
                            </el-button>
                            <el-button v-if="row.is_vip == 0" v-perms="['good.good/set_sale']" type="danger" link @click="handleSet(row.id,row.type)">
                                参与折扣
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
                </el-tab-pane>
            </el-tabs>
            <div class="flex mt-4 justify-end">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
        <edit-popup v-if="showEdit" ref="editRef" :dict-data="dictData" @success="getLists" @close="showEdit = false" />
    </div>
</template>

<script lang="ts" setup name="goodBrandLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiVipGood, apiCancelGood, apiSetSaleGood } from '@/api/good'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)


// 查询条件
const queryParams = reactive({
    name: '',
    status: '',
    type: 1
})


const activeTab = ref(0)
const tabLists = ref([
    {
        name: '普通商品',
        type: 1,
        numKey: '0'
    },
    // {
    //     name: '水票套餐',
    //     type: 2,
    //     numKey: '0'
    // },
    {
        name: '组合商品',
        type: 3,
        numKey: '0'
    },
])


// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val : any[]) => {
    selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('good_status,type,is_deposit')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiVipGood,
    params: queryParams
})


// 编辑
const handleEdit = async (data : any) => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('edit')
    editRef.value?.setFormData(data)
}


const handleTabChange = (index: any) => {
    queryParams.type = tabLists.value[index].type as number
    resetPage()
}


//取消参与
const handleDelete = async (id: number | any[]) => {
    await feedback.confirm('确定要取消参与？')
    await apiCancelGood({ id, type: queryParams.type })
    getLists()
}
const handleSet = async (id: number, type: number | any[]) => {
    await feedback.confirm('确定要参与折扣？')
    await apiSetSaleGood({ id, type })
    getLists()
}
getLists()
</script>