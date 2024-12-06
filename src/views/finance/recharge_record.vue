<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-alert
                type="warning"
                title="温馨提示：用户充值记录"
                :closable="false"
                show-icon
            ></el-alert>
            <el-form ref="formRef" class="mb-[-16px] mt-[16px]" :model="queryParams" :inline="true">
                <el-form-item label="充值单号">
                    <el-input
                        class="w-[280px]"
                        v-model="queryParams.sn"
                        placeholder="请输入充值单号"
                        clearable
                        @keyup.enter="resetPage"
                    />
                </el-form-item>
                <el-form-item label="用户信息">
                    <el-input
                        class="w-[280px]"
                        v-model="queryParams.user_info"
                        placeholder="请输入用户昵称/手机号"
                        clearable
                        @keyup.enter="resetPage"
                    />
                </el-form-item>
                <el-form-item label="支付方式">
                    <el-select class="w-[280px]" v-model="queryParams.pay_way">
                        <el-option label="全部" value />
                        <el-option label="后台充值" :value="1" />
                        <el-option label="微信支付" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="支付状态">
                    <el-select class="w-[280px]" v-model="queryParams.pay_status">
                        <el-option label="全部" value />
                        <el-option label="未支付" :value="0" />
                        <el-option label="已支付" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="支付时间">
                    <daterange-picker
                        v-model:startTime="queryParams.start_time"
                        v-model:endTime="queryParams.end_time"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                    <export-data
                        class="ml-2.5"
                        :fetch-fun="rechargeLists"
                        :params="queryParams"
                        :page-size="pager.size"
                    />
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                <el-table-column label="头像/昵称" min-width="160">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <image-contain
                                class="flex-none mr-2"
                                :src="row.avatar"
                                :width="50"
                                :height="50"
                                preview-teleported
                                fit="contain"
                            />
                            {{ row.nickname }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="手机号" prop="mobile" min-width="100" />
                <el-table-column label="充值单号" prop="sn" min-width="190" />
                <el-table-column label="充值金额" prop="order_amount" min-width="100">
                </el-table-column>
                <el-table-column label="支付方式" prop="pay_way" min-width="100" >
                    <template #default="{ row }">
                        <el-tag v-if="row.pay_way == 1">后台充值</el-tag>
                        <el-tag type="success" v-else>微信支付</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="支付状态" prop="pay_status" min-width="100">
                    <template #default="{ row }">
                        <el-tag type="success" v-if="row.pay_status == 1">已支付</el-tag>
                        <el-tag  v-else>未支付</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="支付时间" prop="pay_time" min-width="180" />
                <el-table-column label="退款状态" prop="refund_status" min-width="100">
                    <template #default="{ row }">
                        <el-tag type="success" v-if="row.refund_status == 0">未退款</el-tag>
                        <el-tag type="danger" v-else-if="row.refund_status == 1">已退款</el-tag>
                        <el-tag  v-else>退款部分</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
<!--                        <el-button-->
<!--                            v-if="row.pay_status == 1"-->
<!--                            v-perms="['recharge.recharge/refund']"-->
<!--                            type="primary"-->
<!--                            link-->
<!--                            :disabled="row.refund_status == 1"-->
<!--                            @click="handleRefund(row.id)"-->
<!--                        >-->
<!--                            退款-->
<!--                        </el-button>-->

                        <el-button
                            v-if="row.refund_status != 1 && row.pay_status == 1"
                            v-perms="['recharge.recharge/refund']"
                            link
                            type="primary"
                            @click="handleAccount(row)"
                        >
                            退款
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>


        <account-popup
            v-if="showAccount"
            ref="AccountRef"
            @success="getLists"
            @close="showAccount = false"
        />
    </div>
</template>
<script lang="ts" setup name="rechargeLists">
import { rechargeLists, refund } from '@/api/finance'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import AccountPopup from "@/views/finance/refund_edit.vue";
const queryParams = reactive({
    sn: '',
    user_info: '',
    pay_way: '',
    pay_status: '',
    start_time: '',
    end_time: ''
})
const AccountRef = shallowRef<InstanceType<typeof AccountPopup>>()
const showAccount = ref(false)

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: rechargeLists,
    params: queryParams
})

const handleAccount = async (data: any) => {
    showAccount.value = true
    await nextTick()
    AccountRef.value?.open('account')
    AccountRef.value?.setFormData(data)
}
// const handleRefund = async (id: number) => {
//     await feedback.confirm('确认退款？')
//     await refund({
//         recharge_id: id
//     })
//     getLists()
// }

getLists()
</script>
