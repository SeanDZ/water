<template>
    <div>

        <el-row :gutter="10">
            <el-col :span="6">
                <el-card class="!border-none mb-4 lg:mr-4 lg:w-[350px]" shadow="never">
                    <img style="float: left" width="60" height="60" src="@/assets/images/stock.png" alt="" />
                    <div style="float: left;margin-left: 40px">
                        <div class="text-6xl">{{ stockData.stock }}</div>
                        <div class="text-tx-secondary text-xs" style="color: #b7acac;font-size: 14px">
                            成品库存合计
                        </div>
                    </div>

                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="!border-none mb-4 lg:mr-4 lg:w-[350px]" shadow="never">
                    <img style="float: left" width="60" height="60" src="@/assets/images/bstock.png" alt="" />
                    <div style="float: left;margin-left: 40px">
                        <div class="text-6xl">{{ stockData.bstock }}</div>
                        <div class="text-tx-secondary text-xs" style="color: #b7acac;font-size: 14px">
                            空桶库存合计
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card class="!border-none mb-4 lg:mr-4 lg:w-[350px]" shadow="never">
                    <img style="float: left" width="60" height="60" src="@/assets/images/own.png" alt="" />
                    <div style="float: left;margin-left: 40px">
                        <div class="text-6xl">{{ stockData.own_stock }}</div>
                        <div class="text-tx-secondary text-xs" style="color: #b7acac;font-size: 14px">
                            用户欠桶合计
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card class="!border-none mb-4 lg:mr-4 lg:w-[350px]" shadow="never">
                    <img style="float: left" width="60" height="60" src="@/assets/images/ya.png" alt="" />
                    <div style="float: left;margin-left: 40px">
                        <div class="text-6xl">{{ stockData.ya_stock }}</div>
                        <div class="text-tx-secondary text-xs" style="color: #b7acac;font-size: 14px">
                            用户押桶合计
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>



        <el-card class="!border-none mb-4" shadow="never">
            <el-form
                class="mb-[-16px]"
                :model="queryParams"
                inline
            >
                <el-form-item label="所属门店" prop="water_station_id">
                    <el-select class="w-80" v-model="queryParams.water_station_id" placeholder="" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in waterStationListOptions" :key="item.id" :label="item.name"
                                   :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称" prop="name">
                    <el-input class="w-[280px]" v-model="queryParams.name" clearable placeholder="请输入商品名称" />
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
                    <el-table-column label="所属门店" prop="water_station_name" show-overflow-tooltip />
                    <el-table-column label="品牌" prop="brand_name" show-overflow-tooltip />
                    <el-table-column label="商品名称" prop="good_name" show-overflow-tooltip />
                    <el-table-column label="商品库存" prop="stock" show-overflow-tooltip />
                    <el-table-column label="空桶库存" prop="bstock" show-overflow-tooltip />
                    <el-table-column label="客户押桶数量" prop="ya_bucket" show-overflow-tooltip />
                    <el-table-column label="总押金(元)" prop="bucket_price" show-overflow-tooltip />
                    <el-table-column label="客户欠桶数量" prop="qian_bucket" show-overflow-tooltip />
                    <el-table-column label="操作" width="200" fixed="right">
                        <template #default="{ row }">
                             <el-button
                                v-perms="['stock.goods_stock/edit']"
                                type="primary"
                                link
                                @click="handleEdit(row)"
                            >
                                商品出入库
                            </el-button>

                            <el-button
                                v-perms="['stock.goods_stock/edit2']"
                                type="primary"
                                link
                                @click="handleEdit2(row)"
                            >
                                空桶出入库
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
        <edit2-popup v-if="showEdit2" ref="edit2Ref" :dict-data="dictData" @success="getLists" @close="showEdit2 = false" />

    </div>
</template>

<script lang="ts" setup name="goodsStockLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import {apiGoodsStockLists, apiGoodsStockDelete, apiGoodsStockData} from '@/api/goods_stock'
import { apiShopWaterStationLists } from '@/api/shop_water_station'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
import Edit2Popup from './edit2.vue';


const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const edit2Ref = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)
const showEdit2 = ref(false)


// 查询条件
const queryParams = reactive({
    water_station_id: '',
    name: '',
})
const stockData = reactive({
    stock: 0,
    bstock: 0,
    own_stock: 0,
    ya_stock: 0
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
    fetchFun: apiGoodsStockLists,
    params: queryParams
})

const getData = async () => {
    const data = await apiGoodsStockData(1)
    console.log(data)
    Object.assign(stockData, data)
}

// 添加
const handleAdd = async () => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('add')
}

// 成品库存修正
const handleEdit = async (data: any) => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('edit')
    editRef.value?.setFormData(data)
}

// 空桶库存修正
const handleEdit2 = async (data: any) => {
    showEdit2.value = true
    await nextTick()
    edit2Ref.value?.open('edit2')
    edit2Ref.value?.setFormData(data)
}

// 删除
const handleDelete = async (id: number | any[]) => {
    await feedback.confirm('确定要删除？')
    await apiGoodsStockDelete({ id })
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
getData()
</script>

