<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-alert
                type="warning"
                title="温馨提示：积分商城兑换商品会作为水票存入客户默认地址上"
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
                <el-form-item label="商品名称" prop="name">
                    <el-input class="w-[280px]" v-model="queryParams.name" clearable placeholder="请输入商品名称" />
                </el-form-item>
                                <el-form-item label="状态" prop="status">
                    <el-select class="w-[280px]" v-model="queryParams.status" clearable placeholder="请选择状态">
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
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none" v-loading="pager.loading" shadow="never">
            <el-button v-perms="['point.point_good/add']" type="primary" @click="handleAdd">
                <template #icon>
                    <icon name="el-icon-Plus" />
                </template>
                新增
            </el-button>
            <el-button
                v-perms="['point.point_good/delete']"
                :disabled="!selectData.length"
                @click="handleDelete(selectData)"
            >
                删除
            </el-button>
            <div class="mt-4">
                <el-table :data="pager.lists" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="商品名称" prop="name" show-overflow-tooltip />
                    <el-table-column label="图片" prop="images">
                        <template #default="{ row }">
                            <el-image style="width: 50px; height: 50px" :src="row.images" />
                        </template>
                    </el-table-column>
                    <el-table-column label="售价" prop="price" show-overflow-tooltip />
                    <el-table-column label="成本价" prop="cost_price" show-overflow-tooltip />
                    <el-table-column label="需要积分" prop="point" show-overflow-tooltip />
                    <el-table-column label="库存" prop="stock" show-overflow-tooltip />
                    <el-table-column label="限制兑换数量" prop="limit_num" show-overflow-tooltip />
                    <el-table-column label="水票有效期(天)" prop="days" show-overflow-tooltip />
                    <el-table-column label="状态" prop="status">
                        <template #default="{ row }">
                            <el-tag v-if="row.status == 1" type="success" style="width: 60px">上架</el-tag>
                            <el-tag  v-else type="danger" style="width: 60px">下架</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="累计兑换" prop="num" show-overflow-tooltip />
                    <el-table-column label="排序" prop="order" show-overflow-tooltip />
                    <el-table-column label="创建时间" prop="create_time" show-overflow-tooltip />
                    <el-table-column label="操作" width="120" fixed="right">
                        <template #default="{ row }">
                             <el-button
                                v-perms="['point.point_good/edit']"
                                type="primary"
                                link
                                @click="handleEdit(row)"
                            >
                                编辑
                            </el-button>
                            <el-button
                                v-perms="['point.point_good/delete']"
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

<script lang="ts" setup name="pointGoodLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiPointGoodLists, apiPointGoodDelete } from '@/api/point_good'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)


// 查询条件
const queryParams = reactive({
    name: '',
    status: '',
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('good_status')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiPointGoodLists,
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
    await apiPointGoodDelete({ id })
    getLists()
}

getLists()
</script>

