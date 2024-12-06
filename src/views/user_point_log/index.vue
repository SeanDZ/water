<template>
    <div>

        <el-row :gutter="10">
            <el-col :span="6">
                <el-card class="!border-none mb-4 lg:mr-4 lg:w-[350px]" shadow="never">
                    <img style="float: left" width="60" height="60" src="@/assets/images/use.png" alt="" />
                    <div style="float: left;margin-left: 40px">
                        <div class="text-6xl">{{ formData.left_point }}</div>
                        <div class="text-tx-secondary text-xs" style="color: #b7acac;font-size: 14px">
                            当前积分
                        </div>
                    </div>

                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="!border-none mb-4 lg:mr-4 lg:w-[350px]" shadow="never">
                    <img style="float: left" width="60" height="60" src="@/assets/images/jifen.png" alt="" />
                    <div style="float: left;margin-left: 40px">
                        <div class="text-6xl">{{ formData.all_point }}</div>
                        <div class="text-tx-secondary text-xs" style="color: #b7acac;font-size: 14px">
                            累计发放积分
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card class="!border-none mb-4 lg:mr-4 lg:w-[350px]" shadow="never">
                    <img style="float: left" width="60" height="60" src="@/assets/images/used.png" alt="" />
                    <div style="float: left;margin-left: 40px">
                        <div class="text-6xl">{{ formData.used_point }}</div>
                        <div class="text-tx-secondary text-xs" style="color: #b7acac;font-size: 14px">
                            累计消耗积分
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card class="!border-none mb-4 lg:mr-4 lg:w-[350px]" shadow="never">
                    <img style="float: left" width="60" height="60" src="@/assets/images/kc.png" alt="" />
                    <div style="float: left;margin-left: 40px">
                        <div class="text-6xl">{{ formData.dec_point }}</div>
                        <div class="text-tx-secondary text-xs" style="color: #b7acac;font-size: 14px">
                            后台扣除
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>


        <el-card class="!border-none mb-4" shadow="never">
            <el-form
                class="mb-[-16px]"
                :model="queryParams"
                inline
            >
                <el-form-item label="用户昵称" prop="nickname">
                    <el-input class="w-[280px]" v-model="queryParams.nickname" clearable placeholder="请输入用户昵称" />
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input class="w-[280px]" v-model="queryParams.mobile" clearable placeholder="请输入用户手机号" />
                </el-form-item>
                <el-form-item label="类型" prop="type">
                <el-select class="w-[280px]" v-model="queryParams.type" clearable placeholder="请选择类型">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                        v-for="(item, index) in dictData.point_type"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                    />
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
                <el-table :data="pager.lists" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="昵称" prop="nickname" show-overflow-tooltip />
                    <el-table-column label="头像" min-width="70">
                        <template #default="{ row }">
                            <el-avatar :src="row.avatar" :size="50" />
                        </template>
                    </el-table-column>
                    <el-table-column label="手机号" prop="mobile" show-overflow-tooltip/>
                    <el-table-column label="变更前" prop="before_point" show-overflow-tooltip/>
                    <el-table-column label="变更数量" prop="change_point">
                        <template #default="{ row }">
                            <el-tag v-if="row.change_point > 0" type="danger" style="width: 60px;font-size: larger">+{{row.change_point}}</el-tag>
                            <el-tag type="success" v-else style="width: 60px;font-size: larger">{{row.change_point}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="变更后" prop="after_point" show-overflow-tooltip/>
                    <el-table-column label="订单号" prop="order_no" show-overflow-tooltip   width="200"/>
                    <el-table-column label="被邀请人" prop="invitee_username" show-overflow-tooltip />
                    <el-table-column label="类型" prop="type">
                        <template #default="{ row }">
                            <dict-value :options="dictData.point_type" :value="row.type" />
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="remark" show-overflow-tooltip />
                    <el-table-column label="创建时间" prop="create_time" show-overflow-tooltip  width="160"/>
                </el-table>
            </div>
            <div class="flex mt-4 justify-end">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="userPointLogLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiUserPointLogLists, apiUserPointData } from '@/api/user_point_log'


// 查询条件
const queryParams = reactive({
    nickname: '',
    mobile: '',
    type: '',
})
const formData = reactive({
    all_point: 0,
    used_point: 0,
    left_point: 0,
    dec_point:0
})

const getPoint = async () => {
    const data = await apiUserPointData(1)
    console.log(data)
    Object.assign(formData, data)
}

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('point_type')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiUserPointLogLists,
    params: queryParams,
})
getPoint()
getLists()
</script>

