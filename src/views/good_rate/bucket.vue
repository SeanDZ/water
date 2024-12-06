<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form
                    class="mb-[-16px]"
                    :model="queryParams"
                    inline
            >

                <el-form-item label="商品名称" prop="name">
                    <el-input class="w-[280px]" v-model="queryParams.name" clearable placeholder="请输入商品名称" />
                </el-form-item>
                <el-form-item label="商品品牌" prop="good_brand_id">
                    <el-select class="w-80" v-model="queryParams.good_brand_id" placeholder="" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in goodBrandListOptions" :key="item.id" :label="item.name"
                                   :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="选择门店" prop="water_station_id">
                    <el-select class="w-80" v-model="queryParams.water_station_id" placeholder="" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in waterStationListOptions" :key="item.id" :label="item.name"
                                   :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none" v-loading="pager.loading" shadow="never">
            <div class="mt-4">
                <el-table :data="pager.lists" @selection-change="handleSelectionChange" class-name="sale-data">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="商品ID" prop="good_id" show-overflow-tooltip />
                    <el-table-column label="图片" prop="images">
                        <template #default="{ row }">
                            <el-image style="width:50px;height:50px;" :src="row.images" />
                        </template>
                    </el-table-column>
                    <el-table-column label="商品名称" prop="name" show-overflow-tooltip />
                    <el-table-column label="商品品牌" prop="brand_name" show-overflow-tooltip />
                    <el-table-column label="押桶数量" prop="ya_num" show-overflow-tooltip />
                    <el-table-column label="欠桶数量" prop="owe_num" show-overflow-tooltip />
                </el-table>
            </div>
            <div class="flex mt-4 justify-end">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="bucketLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiGoodBucketLists } from '@/api/good_rate'
import { apiGoodBrandLists } from "@/api/good_brand";
import { apiShopWaterStationLists } from '@/api/shop_water_station'

// 查询条件
const queryParams = reactive({
    good_brand_id: '',
    water_station_id:'',
    name: '',
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}

const goodBrandListOptions = ref<any[]>([])
const getGoodBrandList = async () => {
    try {
        const goodBrandListLists : any = await apiGoodBrandLists({ shop_id: 1 })
        goodBrandListOptions.value = goodBrandListLists.lists
    } catch (e) {
        console.log('err', e)
    }
}
getGoodBrandList()

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

// 获取字典数据
const { dictData } = useDictData('')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiGoodBucketLists,
    params: queryParams
})

getLists()
</script>
