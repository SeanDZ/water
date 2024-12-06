<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form
                    class="mb-[-16px]"
                    :model="queryParams"
                    inline
            >
                <el-form-item label="盘点单号" prop="check_no">
                    <el-input class="w-[280px]" v-model="queryParams.check_no" clearable placeholder="请输入盘点单号" />
                </el-form-item>

                <el-form-item label="门店" prop="water_station_id">
                    <el-select class="w-80" v-model="queryParams.water_station_id" placeholder="" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in waterStationListOptions" :key="item.id" :label="item.name"
                                   :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="类型" prop="type">
                    <el-select class="w-[280px]" v-model="queryParams.type" clearable placeholder="请选择类型">
                        <el-option label="全部" value=""> </el-option>
                        <el-option label="成品入库" value="1" ></el-option>
                        <el-option label="空桶返厂" value="2" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select class="w-[280px]" v-model="queryParams.status" clearable placeholder="请选择状态">
                        <el-option label="全部" value=""> </el-option>
                        <el-option label="待审核" value="1" ></el-option>
                        <el-option label="已通过" value="2" ></el-option>
                        <el-option label="已驳回" value="3" ></el-option>
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
            <el-button
                    v-perms="['stock_check.good_stock_check/delete']"
                    :disabled="!selectData.length"
                    type="primary"
                    @click="handleDelete(selectData)"
            >
                删除
            </el-button>
            <div class="mt-4">
                <el-table :data="pager.lists" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="盘点单号" prop="check_no" show-overflow-tooltip />
                    <el-table-column label="门店" prop="water_station_name"></el-table-column>
                    <el-table-column label="提交人" prop="staff_name"></el-table-column>
                    <el-table-column label="类型" prop="type">
                        <template #default="{ row }">
                            <el-tag  v-if="row.type == 1">成品入库</el-tag>
                            <el-tag type="danger" v-else >空桶返厂</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="status">
                        <template #default="{ row }">
                            <el-tag v-if="row.status == 1">待审核</el-tag>
                            <el-tag type="success" v-else-if="row.status == 2" >已通过</el-tag>
                            <el-tag type="danger" v-else >已驳回</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="remark" show-overflow-tooltip />
                    <el-table-column label="创建时间" prop="create_time" show-overflow-tooltip />
                    <el-table-column label="操作" width="180" fixed="right">
                        <template #default="{ row }">
<!--                            <el-button-->
<!--                                    v-perms="['stock_check.good_stock_check/edit']"-->
<!--                                    type="primary"-->
<!--                                    link-->
<!--                                    @click="handleEdit(row.id)"-->
<!--                            >-->
<!--                                详情-->
<!--                            </el-button>-->

                            <el-button v-perms="['stock_check.good_stock_check/infos']" type="primary" link>
                                <router-link
                                    :to="{
                                    path: 'good_stock_check/edit', //菜单->路由路径
                                    query: {
                                        id: row.id
                                    }
                                }"
                                >
                                    详情
                                </router-link>
                            </el-button>


                            <el-button
                                    v-if="row.status != 2"
                                    v-perms="['stock_check.good_stock_check/delete']"
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

<script lang="ts" setup name="goodStockCheckLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiGoodStockCheckLists, apiGoodStockCheckDelete } from '@/api/good_stock_check'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
import {apiShopWaterStationLists} from "@/api/shop_water_station";

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)


// 查询条件
const queryParams = reactive({
    check_no: '',
    water_station_id: '',
    type: '',
    status: '',
    create_time: '',
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
    fetchFun: apiGoodStockCheckLists,
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
    await apiGoodStockCheckDelete({ id })
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
        //TODO handle the exception
    }
}
getWaterStationList()
getLists()
</script>

