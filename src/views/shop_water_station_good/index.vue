<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form
                class="mb-[-16px]"
                :model="queryParams"
                inline
            >
                <el-form-item label="门店" prop="water_station_id">
                    <el-select class="w-[180px]" v-model="queryParams.water_station_id" placeholder="" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in waterStationListOptions" :key="item.id" :label="item.name"
                                   :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="商品名称" prop="name">
                    <el-input class="w-[180px]" v-model="queryParams.name" clearable placeholder="请输入商品名称" />
                </el-form-item>
                <el-form-item label="售卖状态" prop="is_sale">
                <el-select class="w-[100px]" v-model="queryParams.is_sale" clearable placeholder="请选择售卖状态">
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
            <el-tabs v-model="activeTab" @tab-change="handleTabChange">
                <el-tab-pane
                    v-for="(item, index) in tabLists"
                    :label="`${item.name}`"
                    :name="index"
                    :key="index"
                >
            <el-button
                v-perms="['station.shop_water_station_good/delete']"
                :disabled="!selectData.length"
                @click="handleStatus2(selectData)"
            >
                批量上架
            </el-button>

            <el-button
                v-perms="['station.shop_water_station_good/delete']"
                :disabled="!selectData.length"
                @click="handleStatus3(selectData)"
            >
                批量下架
            </el-button>
            <div class="mt-4">
                <el-table :data="pager.lists" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="门店" prop="station_name" show-overflow-tooltip />
                    <el-table-column label="商品品牌" prop="brand_name" show-overflow-tooltip />
                    <el-table-column label="商品名称" prop="name" show-overflow-tooltip />
                    <el-table-column label="商品类型" prop="type" show-overflow-tooltip >
                        <template #default="{ row }">
                            <el-tag v-if="row.type == 1">普通商品</el-tag>
                            <el-tag type="success" v-else-if="row.type == 2">水票套餐</el-tag>
                            <el-tag type="warning" v-else>组合商品</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="售卖状态" prop="status">
                        <template #default="{ row }">
                            <el-tag type="success" v-if="row.is_sale == 1">售卖中</el-tag>
                            <el-tag type="danger" v-else>已下架</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="售价(元)" prop="price" width="160" show-overflow-tooltip />
                    <el-table-column label="创建时间" prop="create_time" show-overflow-tooltip />
                    <el-table-column label="操作" width="120" fixed="right">
                        <template #default="{ row }">
                             <el-button
                                v-perms="['station.shop_water_station_good/edit']"
                                type="primary"
                                link
                                @click="handleEdit(row)"
                            >
                                编辑
                            </el-button>
                            <el-button
                                v-perms="['station.shop_water_station_good/sale_status']"
                                type="danger"
                                link
                                v-show="row.is_sale == 1"
                                @click="handleStatus(row.id, 0)"
                            >
                                下架
                            </el-button>

                            <el-button
                                v-perms="['station.shop_water_station_good/sale_status']"
                                type="success"
                                link
                                v-show="row.is_sale == 0"
                                @click="handleStatus(row.id, 1)"
                            >
                                上架
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

<script lang="ts" setup name="shopWaterStationGoodLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import {
    apiShopWaterStationGoodLists,
    apiShopWaterStationGoodDelete,
    apiShopWaterStationGoodStatus,
    apiShopWaterStationGoodStatus2
} from '@/api/shop_water_station_good'
import { apiShopWaterStationLists } from '@/api/shop_water_station'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)


// 查询条件
const queryParams = reactive({
    water_station_id: '',
    name: '',
    is_sale: '',
    type: 1
})

const activeTab = ref(0)
const tabLists = ref([
    {
        name: '普通商品',
        type: 1,
        numKey: '0'
    },
    {
        name: '水票套餐',
        type: 2,
        numKey: '0'
    },
    {
        name: '组合商品',
        type: 3,
        numKey: '0'
    },
])

const handleTabChange = (index: any) => {
    queryParams.type = tabLists.value[index].type as number
    resetPage()
}


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
    fetchFun: apiShopWaterStationGoodLists,
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
    await apiShopWaterStationGoodDelete({ id })
    getLists()
}

//上下架
const handleStatus = async (id: number | any[], type: number) => {
    await feedback.confirm('确定要更新门店商品售卖状态？')
    await apiShopWaterStationGoodStatus({ id, type })
    getLists()
}

const handleStatus2 = async (id: number | any[]) => {
    await feedback.confirm('确定要批量上架门店商品？')
    const type = 1
    await apiShopWaterStationGoodStatus2({ id, type })
    getLists()
}
const handleStatus3 = async (id: number | any[]) => {
    await feedback.confirm('确定要批量下架门店商品？')
    const type = 0
    await apiShopWaterStationGoodStatus2({ id, type })
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

getLists()
</script>

