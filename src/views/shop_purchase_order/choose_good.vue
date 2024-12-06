<template>
    <div class="goods-popup">
        <popup
                ref="popupRef"
                :title="popupTitle"
                :async="true"
                width="1000px"
                @confirm="handleSubmit"
                @close="handleClose"
        >
            <el-card class="!border-none" shadow="never">
                <el-form class="mb-[-16px]" :model="queryParams" inline>
                    <el-form-item label="商品名称" prop="name">
                        <el-input
                                class="w-[280px]"
                                v-model="queryParams.name"
                                clearable
                                placeholder="请输入商品名称"
                        />
                    </el-form-item>
                    <el-form-item label="商品品牌" prop="good_brand_id">
                        <el-select class="w-50" v-model="queryParams.good_brand_id" placeholder="" clearable>
                            <el-option label="全部" value=""></el-option>
                            <el-option v-for="item in goodBrandListOptions" :key="item.id" :label="item.name"
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
                <div>
                    <el-table
                            :data="pager.lists"
                            @selection-change="handleSelectionChange"
                    >
                        <el-table-column type="selection" width="55" />
                        <el-table-column label="商品图片" prop="images">
                            <template #default="{ row }">
                                <el-image style="width: 40px; height: 40px" :src="row.images" />
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="品牌"
                                prop="brand_name"
                                show-overflow-tooltip
                        />
                        <el-table-column
                                label="商品名称"
                                prop="name"
                                show-overflow-tooltip
                        />

                        <el-table-column label="售价" prop="price" show-overflow-tooltip />
                        <el-table-column
                                label="成本价"
                                prop="cost_price"
                                show-overflow-tooltip
                        />

                        <el-table-column
                                label="创建时间"
                                prop="create_time"
                                show-overflow-tooltip
                        />
                    </el-table>
                </div>
                <div class="flex mt-4 justify-end">
                    <pagination v-model="pager" @change="getLists" />
                </div>
            </el-card>
        </popup>
    </div>
</template>

<script lang="ts" setup name="goodLists">
import Popup from '@/components/popup/index.vue'
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiGoodLists } from '@/api/good'
import { apiGoodBrandLists } from "@/api/good_brand";

const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('goods')
const emit = defineEmits(['success', 'close'])
// 弹窗标题
const popupTitle = computed(() => {
    return mode.value == 'goods' ? '选择商品' : ''
})

// 查询条件
const queryParams = reactive({
    name: '',
    good_brand_id: '',
    good_id: ''
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
    selectData.value = val
}

const goodBrandListOptions = ref<any[]>([])
const getGoodBrandList = async () => {
    try {
        const goodBrandListLists : any = await apiGoodBrandLists({  })
        goodBrandListOptions.value = goodBrandListLists.lists
    } catch (e) {
        console.log('err', e)
    }
}
getGoodBrandList()

// 获取字典数据
const { dictData } = useDictData('good_status,type,is_deposit')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiGoodLists,
    params: queryParams
})

// 获取详情
const setFormData = async (data: Array) => {
    queryParams.good_id = ''

    for (let i in data) {
        queryParams.good_id += ',' + data[i].id
    }
    queryParams.good_id = queryParams.good_id.substring(1)

    getLists()
    // console.log(data);
}

// 提交按钮
const handleSubmit = async () => {
    try {
        popupRef.value?.close()
        emit('success', selectData.value)
    } catch (e) {
        console.log('err', e)
        //TODO handle the exception
    }
}

//打开弹窗
const open = () => {
    popupRef.value?.open()
}

defineExpose({
    open,
    setFormData
})
</script>