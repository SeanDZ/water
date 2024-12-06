<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form
                class="mb-[-16px]"
                :model="queryParams"
                inline
            >
                <el-form-item label="门店" prop="water_station_id">
                    <el-select class="w-[280px]" v-model="queryParams.water_station_id" placeholder="" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in waterStationListOptions" :key="item.id" :label="item.name"
                                   :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="供应商" prop="supplier_id">
                    <el-select class="w-[280px]" v-model="queryParams.supplier_id" placeholder="" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in supplierListOptions" :key="item.id" :label="item.title"
                                   :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="进货单号" prop="order_sn">
                      <el-input class="w-[280px]" v-model="queryParams.order_sn" clearable placeholder="请输入进货单号" />
                  </el-form-item>
                <el-form-item label="状态" prop="apply_status">
                    <el-select class="w-[280px]" v-model="queryParams.apply_status" clearable placeholder="请选择状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option
                            v-for="(item, index) in dictData.apply_status"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="创建时间" prop="create_time">
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
                <router-link
                        v-perms="['purchase.shop_purchase_order/add', 'purchase.shop_purchase_order/edit']"
                        :to="{
                        path: getRoutePath('purchase.shop_purchase_order/add:edit')
                    }"
                >
                    <el-button type="primary" class="mb-4">
                        <template #icon>
                            <icon name="el-icon-Plus" />
                        </template>
                        新增
                    </el-button>
                </router-link>
            <el-button
                v-perms="['purchase.shop_purchase_order/delete']"
                :disabled="!selectData.length"
                @click="handleDelete(selectData)"
                style="margin-left: 20px;margin-top: -13px"
            >
                删除
            </el-button>
            <div class="mt-4">
                <el-table :data="pager.lists" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="进货门店" prop="name" show-overflow-tooltip />
                    <el-table-column label="供应商" prop="title" show-overflow-tooltip />
                    <el-table-column label="进货单号" prop="order_sn" show-overflow-tooltip />
                    <el-table-column label="实付金额" prop="price" show-overflow-tooltip />
                    <el-table-column label="状态" prop="apply_status">
                        <template #default="{ row }">
                            <dict-value :options="dictData.apply_status" :value="row.apply_status" />
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="remark" show-overflow-tooltip />
                    <el-table-column label="采购申请人" prop="admin_name" show-overflow-tooltip />
                    <el-table-column label="审核人" prop="audit_name" show-overflow-tooltip />
                    <el-table-column label="审核时间" prop="audit_time" show-overflow-tooltip />
                    <el-table-column label="创建时间" prop="create_time" show-overflow-tooltip />
                    <el-table-column label="操作" width="120" fixed="right">
                        <template #default="{ row }">

                            <el-button
                                    v-perms="['purchase.shop_purchase_order/add', 'purchase.shop_purchase_order/edit']"
                                    type="primary"
                                    link
                            >
                                <router-link
                                        :to="{
                                    path: getRoutePath('purchase.shop_purchase_order/add:edit'),
                                    query: {
                                        id: row.id
                                    }
                                }"
                                >
                                    详情
                                </router-link>
                            </el-button>

                            <el-button
                                v-perms="['purchase.shop_purchase_order/delete']"
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

<script lang="ts" setup name="shopPurchaseOrderLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiShopPurchaseOrderLists, apiShopPurchaseOrderDelete } from '@/api/shop_purchase_order'
import { apiShopWaterStationLists } from '@/api/shop_water_station'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
import { getRoutePath } from "@/router";
import { apiShopSupplierLists } from "@/api/shop_supplier";

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)


// 查询条件
const queryParams = reactive({
    water_station_id: '',
    supplier_id: '',
    order_sn: '',
    apply_status: '',
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
const { dictData } = useDictData('apply_status')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiShopPurchaseOrderLists,
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
    await apiShopPurchaseOrderDelete({ id })
    getLists()
}

//门店
const waterStationListOptions = ref<any[]>([])
const getWaterStationList = async () => {
    try {
        const getWaterStationLists : any = await apiShopWaterStationLists({  })
        waterStationListOptions.value = getWaterStationLists.lists
    } catch (e) {
        console.log('err', e)
    }
}
getWaterStationList()

//供应商
const supplierListOptions = ref<any[]>([])
const getSupplierList = async () => {
    try {
        const supplierLists : any = await apiShopSupplierLists({  })
        supplierListOptions.value = supplierLists.lists
    } catch (e) {
        console.log('err', e)
    }
}
getSupplierList()

getLists()
</script>

