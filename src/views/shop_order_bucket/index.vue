<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form class="mb-[-16px]" :model="queryParams" inline>
                <el-form-item label="客户昵称" prop="nickname">
                    <el-input
                            class="w-[280px]"
                            v-model="queryParams.nickname"
                            clearable
                            placeholder="请输入客户昵称"
                    />
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input
                            class="w-[280px]"
                            v-model="queryParams.address"
                            clearable
                            placeholder="请输入地址"
                    />
                </el-form-item>
                <el-form-item label="下单门店" prop="water_station_id">
                    <el-select class="w-[280px]" v-model="queryParams.water_station_id" placeholder="" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in waterStationListOptions" :key="item.id" :label="item.name"
                                   :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="退桶状态" prop="apply_status">
                    <el-select
                            class="w-[280px]"
                            v-model="queryParams.apply_status"
                            clearable
                            placeholder="请选择退费状态"
                    >
                        <el-option label="全部" value=""></el-option>
                        <el-option label="未退桶" value="0"></el-option>
                        <el-option label="已退桶" value="1"></el-option>
                        <el-option label="已驳回" value="2"></el-option>
                        <el-option label="待审核" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="订单号" prop="trade_no">
                    <el-input
                            class="w-[280px]"
                            v-model="queryParams.trade_no"
                            clearable
                            placeholder="请输入订单号"
                    />
                </el-form-item>
                <el-form-item label="支付时间" prop="pay_time">
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
            <div class="mt-4">
                <el-table :data="pager.lists" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="客户信息" width="180">
                        <template #default="{ row }">
                            <div>昵称：{{row.nickname}}</div>
                            <div>手机号：{{row.mobile}}</div>
                            <div>地址：{{row.address}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="头像" min-width="60">
                        <template #default="{ row }">
                            <el-avatar :src="row.avatar" :size="50" />
                        </template>
                    </el-table-column>
                    <el-table-column label="门店" prop="water_station_name" show-overflow-tooltip/>
                    <el-table-column label="订单号" prop="trade_no" show-overflow-tooltip/>
                    <el-table-column label="支付状态" prop="is_pay">
                        <template #default="{ row }">
                            <dict-value
                                    :options="dictData.pay_status"
                                    :value="row.is_pay"
                                    :config="{ label: 'name', value: 'value' }"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column label="支付方式" prop="pay_type">
                        <template #default="{ row }">
                            <el-tag v-if="row.pay_type == 1">微信支付</el-tag>
                            <el-tag type="success" v-else-if="row.pay_type == 2">线下支付</el-tag>
                            <el-tag type="warning" v-else>余额支付</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="apply_status">
                        <template #default="{ row }">
                            <el-tag v-if="row.apply_status == 0">未退桶</el-tag>
                            <el-tag type="success" v-else-if="row.apply_status == 1" >已退桶</el-tag>
                            <el-tag type="warning" v-else-if="row.apply_status == 2" >已驳回</el-tag>
                            <el-tag type="danger" v-else >待审核</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="支付时间"
                            prop="pay_time"
                            show-overflow-tooltip
                    />
                    <el-table-column
                        label="押桶数量"
                        prop="num"
                        show-overflow-tooltip
                    />
                    <el-table-column
                            label="总金额"
                            prop="bucket_price"
                            show-overflow-tooltip
                    />

                    <el-table-column label="来源" prop="source">
                        <template #default="{ row }">
                            <el-tag type="success" v-if="row.source == 1">小程序</el-tag>
                            <el-tag type="warning" v-else-if="row.source == 2">配送端</el-tag>
                            <el-tag type="danger" v-else>后台</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" fixed="right">
                        <template #default="{ row }">
                            <el-button v-perms="['order.shop_order_bucket/detail']" type="primary" link>
                                <router-link
                                        :to="{
                                    path: 'shop_order_bucket/detail', //菜单->路由路径
                                    query: {
                                        id: row.id
                                    }
                                }"
                                >
                                    详情
                                </router-link>
                            </el-button>


                            <el-button
                                    v-perms="['order.shop_order/refund']"
                                    type="success"
                                    link
                                    @click="handleRefund(row.id)"
                                    v-show="row.apply_status == 0 || row.apply_status ==2"
                            >
                                退桶
                            </el-button>

                            <el-button
                                v-perms="['address.user_address_bucket_order/pass']"
                                type="warning"
                                link
                                @click="handlePass(row.id)"
                                v-show="row.apply_status == 3"
                            >
                                通过
                            </el-button>
                            <el-button
                                v-perms="['address.user_address_bucket_order/reject']"
                                type="danger"
                                link
                                @click="handleEdit(row.id)"
                                v-show="row.apply_status == 3"
                            >
                                驳回
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="flex mt-4 justify-end">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
        <edit-popup
                v-if="showEdit"
                ref="editRef"
                :dict-data="dictData"
                @success="getLists"
                @close="showEdit = false"
        />
    </div>
</template>

<script lang="ts" setup name="shopOrderLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiShopOrderBucketLists, apiShopOrderDelete,apiShopOrderRefund, apiShopOrderPass,apiShopOrderReject } from '@/api/shop_order'
import { apiShopWaterStationLists } from '@/api/shop_water_station'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
import {apiShopOrderDistributionLists} from "@/api/shop_order_distribution";

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)

// 查询条件
const queryParams = reactive({
    nickname: '',
    address: '',
    is_pay: '',
    apply_status: '',
    pay_type: '',
    pay_time: '',
    trade_no: '',
    transaction_id: '',
    start_time: '',
    end_time: '',
    type:'',
    water_station_id:''
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('pay_status,refund_status,pay_type')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiShopOrderBucketLists,
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
    await apiShopOrderDelete({ id })
    getLists()
}

const handleRefund = async (id: number | any[]) => {
    await feedback.confirm('用户押桶会减少，确定要退桶？')
    await apiShopOrderRefund({ id })
    getLists()
}

const handlePass = async (id: number | any[]) => {
    await feedback.confirm('确定要通过退桶申请？')
    await apiShopOrderPass({ id })
    getLists()
}

const handleReject = async (id: number | any[]) => {
    await feedback.confirm('确定要驳回申请？')
    await apiShopOrderReject({ id })
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

