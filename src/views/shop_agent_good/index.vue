<template>
    <div>
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
                <el-form-item label="商品类型" prop="type">
                    <el-select class="w-[150px]" v-model="queryParams.type">
                        <el-option label="全部" value />
                        <el-option label="普通商品" :value="1" />
                        <el-option label="组合商品" :value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none" v-loading="pager.loading" shadow="never">
            <el-button v-perms="['agent.shop_agent_commission/cancel_agent_good']" :disabled="!selectData.length"
                       @click="handleDelete(selectData)">
                取消分销
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
                            <el-tag type="success" v-else-if="row.type == 3">组合套餐</el-tag>
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
                    <el-table-column label="自购佣金" prop="commission1" show-overflow-tooltip />
                    <el-table-column label="一级佣金" prop="commission2" show-overflow-tooltip />
                    <el-table-column label="二级佣金" prop="commission3" show-overflow-tooltip />
                    <el-table-column label="是否参与分销" prop="is_agent">
                        <template #default="{ row }">
                            <el-tag type="danger" v-if="row.is_agent == 0">不参与</el-tag>
                            <el-tag type="success" v-else>参与</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right">
                        <template #default="{ row }">
                            <el-button
                                v-show="row.is_agent == 0"
                                v-perms="['agent.shop_agent_commission/set_agent_good']"
                                type="success"
                                link
                                @click="handleAgent(row.id)"
                            >
                                参与分销
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="flex mt-4 justify-end">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="goodBrandLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import {apiAllGood, apiCancelGood} from '@/api/good'
import feedback from '@/utils/feedback'
import { apiShopAgentGoodSet, apiShopAgentGoodCancel } from "@/api/shop_agent_commission";



// 查询条件
const queryParams = reactive({
    name: '',
    status:'',
    type:''
})


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
    fetchFun: apiAllGood,
    params: queryParams
})


const handleAgent = async (id : number | any[]) => {
    await feedback.confirm('确定商品要参与分销？')
    await apiShopAgentGoodSet({ id })
    getLists()
}

const handleDelete = async (id : number | any[]) => {
    await feedback.confirm('确定要取消参与？')
    await apiShopAgentGoodCancel({ id })
    getLists()
}


getLists()
</script>