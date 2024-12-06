<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-alert
                type="warning"
                title="温馨提示：用户账户变动记录"
                :closable="false"
                show-icon
            ></el-alert>
            <el-form ref="formRef" class="mb-[-16px] mt-[16px]" :model="queryParams" :inline="true">
                <el-form-item label="用户信息">
                    <el-input
                        class="w-[280px]"
                        v-model="queryParams.user_info"
                        placeholder="请输入昵称/手机号"
                        clearable
                        @keyup.enter="resetPage"
                    />
                </el-form-item>
                <el-form-item label="变动类型">
                    <el-select class="w-[280px]" v-model="queryParams.change_type">
                        <el-option label="全部" value />
                        <el-option label="余额下单" value="98" />
                        <el-option label="用户充值" value="99" />
                        <el-option label="后台扣除" value="100" />
                        <el-option label="后台增加" value="200" />
                        <el-option label="平台退款" value="101" />
                        <el-option label="用户退款" value="201"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="记录时间">
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
        <el-card class="!border-none mt-4" shadow="never">
            <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                <el-table-column label="用户ID" prop="user_id" min-width="100" />
                <el-table-column label="头像/昵称" min-width="160">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <image-contain
                                class="flex-none mr-2"
                                :src="row.avatar"
                                :width="40"
                                :height="40"
                                preview-teleported
                                fit="contain"
                            />
                            {{ row.nickname }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="手机号" prop="mobile" min-width="100" />
                <el-table-column label="变动前金额" prop="before_amount" min-width="100" />
                <el-table-column label="变动金额" prop="change_amount" min-width="100">
                    <template #default="{ row }">
                        <el-tag v-if="row.change_amount > 0" type="danger" style="font-size: larger">+{{row.change_amount}}</el-tag>
                        <el-tag type="success" v-else style="font-size: larger">{{row.change_amount}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="变动后金额" prop="after_amount" min-width="100" />
                <el-table-column label="变动类型" prop="change_type" min-width="120">
                    <template #default="{ row }">
                        <el-tag v-if="row.change_type == 98">余额下单</el-tag>
                        <el-tag type="success" v-else-if="row.change_type == 99" >用户充值</el-tag>
                        <el-tag type="success" v-else-if="row.change_type == 100" >后台扣除</el-tag>
                        <el-tag type="success" v-else-if="row.change_type == 200" >后台增加</el-tag>
                        <el-tag type="success" v-else-if="row.change_type == 101" >平台退款</el-tag>
                        <el-tag type="success" v-else-if="row.change_type == 201" >用户退款</el-tag>
                        <el-tag type="danger" v-else ></el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="来源单号" prop="source_sn" min-width="100" />
                <el-table-column label="记录时间" prop="create_time" min-width="120" />
            </el-table>
            <div class="flex justify-end mt-4">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
    </div>
</template>
<script lang="ts" setup name="articleLists">
import { getUmChangeType, accountLog } from '@/api/finance'
import { useDictOptions } from '@/hooks/useDictOptions'
import { usePaging } from '@/hooks/usePaging'
const queryParams = reactive({
    user_info: '',
    change_type: '',
    start_time: '',
    end_time: ''
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: accountLog,
    params: queryParams
})

const { optionsData } = useDictOptions<{
    change_type: Record<number, string>
}>({
    change_type: {
        api: getUmChangeType
    }
})

getLists()
</script>
