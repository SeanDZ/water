<!-- 网站信息 -->
<template>
    <div class="website-information">

        <el-card class="!border-none" shadow="never">
            <el-page-header content="盘点详情" @back="$router.back()" />
        </el-card>

        <el-form ref="formRef" :rules="rules" class="ls-form" :model="formData" label-width="120px">
            <el-card class="!border-none"  shadow="always">
                <div class="mt-6">
                    <el-table :data="dataSource.list" height="300">
                        <el-table-column label="品牌" prop="brand_name" show-overflow-tooltip />
                        <el-table-column label="商品名称" prop="name" show-overflow-tooltip />
                        <el-table-column label="图片" prop="images" show-overflow-tooltip >
                            <template #default="{ row }">
                                <el-image style="width: 50px; height: 50px" :src="row.images" />
                            </template>
                        </el-table-column>
                        <el-table-column label="数量" prop="num" show-overflow-tooltip />
                    </el-table>
                </div>

            </el-card>

            <el-card shadow="always" class="!border-none mt-4">
                <el-form-item label="提交信息">
                    <el-tag size="large">提交时间：{{dataSource.create_time}}</el-tag>
                    <el-tag class="ml-4" size="large">门店：{{dataSource.water_name}}</el-tag>
                    <el-tag class="ml-6" size="large">提交人：{{dataSource.staff_name}}</el-tag>
                </el-form-item>
                <el-form-item label="提交备注" prop="remark">
                    <div class="mb-2 flex items-center text-sm">
                        <el-input v-model="dataSource.remark" clearable placeholder="" style="width: 500px" disabled/>
                    </div>
                </el-form-item>
                <el-form-item label="状态" prop="remark">
                    <div class="mb-2 flex items-center text-sm">
                        <el-tag type="success" v-if="dataSource.status == 2">已通过</el-tag>
                        <el-tag type="danger" v-else-if="dataSource.status == 3" >已驳回</el-tag>
                        <el-tag type="warning"  v-else >待审核</el-tag>
                    </div>
                </el-form-item>

            </el-card>
        </el-form>
        <footer-btns v-perms="['stock_check.good_stock_check/audit']">
            <el-button v-if="dataSource.status != 2" type="primary" @click="handleSubmit({status:2,id:route.query.id})">通过</el-button>
            <el-button v-if="dataSource.status != 2"   @click="handleSubmit({status:3,id:route.query.id})">驳回</el-button>
        </footer-btns>
    </div>
</template>

<script lang="ts" setup name="pointConfig">
import type { FormInstance } from 'element-plus'
import { apiGoodStockCheckDetail, apiGoodsStockAudit, apiGoodStockCheckLists } from '@/api/good_stock_check'
const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
// 表单数据
const formData = reactive({
    status:'',
    remark:''
})

//字段要和接口对应上
const dataSource : any=reactive({
    status:'',
    remark:'',
    title:'',
    list: [],
})

const getDetails = async () => {
    loading.value = true
    const data = await apiGoodStockCheckDetail({
        id: route.query.id
    })
    Object.keys(data).forEach((key) => {
        dataSource[key] = data[key]
    })
    loading.value = false
    console.log(dataSource.remark)
}


const handleSubmit = async (pro={}) => {
    await formRef.value?.validate()
    await apiGoodsStockAudit({...formData,...pro})
    getDetails()
    // router.back()
    // await apiGoodStockCheckLists({})
}

route.query.id && getDetails()

</script>

<style lang="scss" scoped></style>
