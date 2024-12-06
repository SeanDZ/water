<template>
    <div class="log-popup">

        <popup ref="popupRef" :title="popupTitle" :async="true" width="1100px" confirmButtonText="" cancelButtonText="">

        <el-card class="!border-none mb-4" shadow="never">
            <el-form
                class="mb-[-16px]"
                :model="queryParams"
                inline
            >
                <el-form-item label="商品名称" prop="name">
                    <el-input class="w-[280px]" v-model="queryParams.name" clearable placeholder="商品名称" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
<!--                    <el-button @click="resetParams">重置</el-button>-->
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none" v-loading="pager.loading" shadow="never">
            <div class="mt-4">
                <el-table :data="pager.lists" @selection-change="handleSelectionChange">
                    <el-table-column label="商品名称" prop="name" show-overflow-tooltip />
                    <el-table-column label="类型" prop="type_name" show-overflow-tooltip />
                    <el-table-column label="数量" prop="num" show-overflow-tooltip width="200" />
                    <el-table-column label="备注" prop="remark" show-overflow-tooltip />
                    <el-table-column label="操作人" prop="op_name" show-overflow-tooltip />
                    <el-table-column label="操作时间" prop="create_time" show-overflow-tooltip />
                </el-table>
            </div>
            <div class="flex mt-4 justify-end">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>

        </popup>
    </div>
</template>

<script lang="ts" setup name="userBucketLogLists">
import Popup from "@/components/popup/index.vue";
import { usePaging } from '@/hooks/usePaging'
import { apiUserBucketLog } from '@/api/user_address'
import { ref } from 'vue'

const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('log')
// 弹窗标题
const popupTitle = computed(() => {
    return mode.value == 'log' ? '押桶记录' : ''
})
// 查询条件
const queryParams = reactive({
    name: '',
    address_id:'',
    type:2
})


// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}
const setFormData = async (data : Record<any, any>,type:any) => {
    queryParams.address_id = data.id
    queryParams.type = type
    getLists()
}
// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiUserBucketLog,
    params: queryParams,
})

getLists()


//打开弹窗
const open = (type = 'order') => {
    mode.value = type

    popupRef.value?.open()
}

defineExpose({
    open,
    setFormData
})

</script>

