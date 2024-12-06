<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <div class="flex flex-wrap">
                <div class="w-1/2 md:w-1/4">
                    <div class="leading-10">总佣金 (元)</div>
                    <div class="text-6xl">{{ agentData.all_commission }}</div>
                </div>
                <div class="w-1/2 md:w-1/4">
                    <div class="leading-10">今日佣金 (元)</div>
                    <div class="text-6xl">{{ agentData.today_commission }}</div>
                </div>
                <div class="w-1/2 md:w-1/4">
                    <div class="leading-10">已发放 (元)</div>
                    <div class="text-6xl">{{ agentData.paid_commission }}</div>
                </div>
                <div class="w-1/2 md:w-1/4">
                    <div class="leading-10">未发放 (元)</div>
                    <div class="text-6xl">{{ agentData.left_commission }}</div>
                </div>
            </div>
        </el-card>
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px] mt-[16px]" :model="queryParams" :inline="true">
                <el-form-item label="昵称">
                    <el-input
                            class="w-[280px]"
                            v-model="queryParams.nickname"
                            placeholder="请输入昵称"
                            clearable
                            @keyup.enter="resetPage"
                    />
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input
                            class="w-[280px]"
                            v-model="queryParams.mobile"
                            placeholder="请输入手机号"
                            clearable
                            @keyup.enter="resetPage"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
                    <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                        <el-table-column label="昵称" prop="nickname" min-width="190" />
                        <el-table-column label="头像" min-width="160">
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
<!--                                    {{ row.nickname }}-->
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="手机号" prop="mobile" min-width="190" />
                        <el-table-column label="总佣金(元)" prop="commission" min-width="190" />
                        <el-table-column label="收入排名" prop="rank" min-width="190" />
<!--                        <el-table-column label="操作" width="350" fixed="right">-->
<!--                            <template #default="{ row }">-->
<!--                                <el-button-->
<!--                                    v-perms="['agent.shop_agent_commission/edit']"-->
<!--                                    type="primary"-->
<!--                                    link-->
<!--                                    @click="handleCommissionLog(row)"-->
<!--                                >-->
<!--                                    佣金记录-->
<!--                                </el-button>-->
<!--                            </template>-->
<!--                        </el-table-column>-->
                    </el-table>

            <div class="flex justify-end mt-4">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
        <edit-popup
            v-if="showEdit"
            ref="editRef"
            @success="getLists"
            @close="showEdit = false"
        />
    </div>
</template>
<script lang="ts" setup name="agentLists">
import { usePaging } from '@/hooks/usePaging'
import { apiShopAgentData, apiShopAgentRank} from "@/api/shop_agent_commission";

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)

const queryParams = reactive({
    nickname: '',
    mobile: '',
})
const agentData = reactive({
    all_commission: 0,
    today_commission: 0,
    paid_commission: 0,
    left_commission: 0
})


// 编辑
const handleCommissionLog = async (data: any) => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('edit')
    editRef.value?.setFormData(data)
}
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: apiShopAgentRank,
    params: queryParams
})

const getAgentStat = async () => {
    const res = await apiShopAgentData()
    console.log(res)
    Object.assign(agentData, res)
}
getAgentStat()
getLists()
</script>
