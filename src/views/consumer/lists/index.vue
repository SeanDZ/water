<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="客户信息">
                    <el-input
                        class="w-[280px]"
                        v-model="queryParams.keyword"
                        placeholder="昵称/手机号码"
                        clearable
                        @keyup.enter="resetPage"
                    />
                </el-form-item>
                <el-form-item label="是否VIP">
                    <el-select class="w-[280px]" v-model="queryParams.vip">
                        <el-option label="全部" value />
                        <el-option label="是" :value="1" />
                        <el-option label="否" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="注册时间">
                    <daterange-picker
                        v-model:startTime="queryParams.create_time_start"
                        v-model:endTime="queryParams.create_time_end"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                    <export-data
                        class="ml-2.5"
                        :fetch-fun="getUserList"
                        :params="queryParams"
                        :page-size="pager.size"
                    />
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                <el-table-column label="ID" prop="id" min-width="50" />
                <el-table-column label="头像" min-width="100">
                    <template #default="{ row }">
                        <el-avatar :src="row.avatar" :size="50" />
                    </template>
                </el-table-column>
                <el-table-column label="昵称" prop="nickname" min-width="100" />
                <el-table-column label="手机号码" prop="mobile" min-width="100" />
                <el-table-column label="消费金额(元)" prop="price" min-width="100" />
                <el-table-column label="水票(张)" prop="ticket" min-width="80" />
                <el-table-column label="首购/复购/未成交" prop="status" min-width="120">
                    <template #default="{ row }">
                        <el-tag v-if="row.type == 0">未成交</el-tag>
                        <el-tag type="success" v-else-if="row.type == 1" >首购</el-tag>
                        <el-tag type="danger" v-else >复购</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否VIP" prop="vip">
                    <template #default="{ row }">
                        <el-tag type="danger" v-if="row.vip == 0">否</el-tag>
                        <el-tag type="success" v-else-if="row.vip == 1">是</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="账户余额(元)" prop="user_money" min-width="120" />
                <el-table-column label="积分" prop="point" min-width="50" />
                <el-table-column label="分销权限" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-switch v-perms="['user.user/agent']" v-model="row.is_agent"
                                   :active-value="1" :inactive-value="0" @change="changeStatus($event, row)" />
                    </template>
                </el-table-column>
                <el-table-column label="注册时间" prop="create_time" min-width="120" />
                <el-table-column label="操作" width="250" fixed="right">
                    <template #default="{ row }">
                        <el-button
                            v-perms="['user.user/ticket']"
                            type="success"
                            link
                            @click="handleTicket(row)"
                        >
                            水票
                        </el-button>
                        <el-button
                            v-perms="['user.user/account']"
                            type="warning"
                            link
                            @click="handleAccount(row)"
                        >
                            余额
                        </el-button>
                        <el-button
                            v-perms="['user.user/point']"
                            type="success"
                            link
                            @click="handlePoint(row)"
                        >
                            积分
                        </el-button>

                        <el-button v-perms="['user.user/detail']" type="primary" link>
                            <router-link
                                :to="{
                                    path: getRoutePath('user.user/detail'),
                                    query: {
                                        id: row.id
                                    }
                                }"
                            >
                                详情
                            </router-link>
                        </el-button>
                        <el-button
                            v-perms="['user.user/delete']"
                            type="danger"
                            link
                            @click="handleDelete(row.id)"
                        >
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
        <point-popup
            v-if="showPint"
            ref="pointRef"
            @success="getLists"
            @close="showPint = false"
        />


        <account-popup
            v-if="showAccount"
            ref="AccountRef"
            @success="getLists"
            @close="showAccount = false"
        />

        <tickets-popup
            v-if="showTickets"
            ref="TicketsRef"
            @success="getLists"
            @close="showTickets = false"
        />
    </div>
</template>
<script lang="ts" setup name="consumerLists">
import { usePaging } from '@/hooks/usePaging'
import { getRoutePath } from '@/router'
import { getUserList, deleteUser, setUserAgent } from '@/api/consumer'
import PointPopup from './point.vue'
import AccountPopup from './acount.vue'
import TicketsPopup from './tickets.vue'
import feedback from "@/utils/feedback";
const queryParams = reactive({
    keyword: '',
    create_time_start: '',
    create_time_end: '',
    vip:''
})

const pointRef = shallowRef<InstanceType<typeof PointPopup>>()
const AccountRef = shallowRef<InstanceType<typeof AccountPopup>>()
const TicketsRef = shallowRef<InstanceType<typeof TicketsPopup>>()
// 是否显示编辑框
const showPint = ref(false)
const showAccount = ref(false)
const showTickets = ref(false)

//禁用
const handleDelete = async (id: number | any[]) => {
    await feedback.confirm('删除后客户不能在线下单，确定要删除？')
    await deleteUser({ id })
    getLists()
}

const handleTicket = async (data: any) => {
    showTickets.value = true
    await nextTick()
    TicketsRef.value?.open('ticket')
    console.log(data)
    TicketsRef.value?.setFormData(data)
}

// 积分
const handlePoint = async (data: any) => {
    showPint.value = true
    await nextTick()
    pointRef.value?.open('point')
    pointRef.value?.setFormData(data)
}

const handleAccount = async (data: any) => {
    showAccount.value = true
    await nextTick()
    AccountRef.value?.open('account')
    AccountRef.value?.setFormData(data)
}

const changeStatus = async (is_agent : any, row : any) => {
    try {
        // console.log(is_show,id)
        row.is_agent = is_agent
        await setUserAgent(row)
        getLists()
    } catch (error) {
        getLists()
    }
}

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: getUserList,
    params: queryParams
})
onActivated(() => {
    getLists()
})

getLists()
</script>
