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
        <el-form-item label="审核状态" prop="apply_status">
          <el-select
            class="w-[280px]"
            v-model="queryParams.apply_status"
            clearable
            placeholder="请选择审核状态"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="(item, index) in dictData.apply_status"
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
          <el-table-column
            label="客户昵称"
            prop="nickname"
            show-overflow-tooltip
          />
            <el-table-column label="头像" min-width="100">
                <template #default="{ row }">
                    <el-avatar :src="row.avatar" style="width:50px;height: 50px;border-radius: 50%"/>
                </template>
            </el-table-column>
          <el-table-column label="地址" prop="address" />
          <el-table-column
            label="所属门店"
            prop="water_station_name"
            show-overflow-tooltip
          />
          <el-table-column label="商品" prop="name" show-overflow-tooltip />
          <el-table-column label="退桶数量" prop="num" show-overflow-tooltip />
          <el-table-column label="备注" prop="remark" show-overflow-tooltip />
          <el-table-column label="审核状态" prop="apply_status">
            <template #default="{ row }">
              <dict-value
                :options="dictData.apply_status"
                :value="row.apply_status"
                :config="{ label: 'name', value: 'value' }"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="申请时间"
            prop="create_time"
            show-overflow-tooltip
          />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button
                v-perms="['address.user_address_bucket_history/pass']"
                type="primary"
                link
                @click="handlePass(row.id)"
              >
                通过
              </el-button>
              <el-button
                v-perms="['address.user_address_bucket_history/reject']"
                type="danger"
                link
                @click="handleReject(row.id)"
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

<script lang="ts" setup name="userAddressBucketHistoryLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import {
  apiUserAddressBucketHistoryPass,
  apiUserAddressBucketHistoryReject,
  apiUserAddressBucketHistoryLists
} from '@/api/user_address_bucket_history'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)

// 查询条件
const queryParams = reactive({
  user_id: '',
  address_id: '',
  apply_status: ''
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
  selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('apply_status')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: apiUserAddressBucketHistoryLists,
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

const handlePass = async (id: number | any[]) => {
  await feedback.confirm('确定要通过审核？')
  await apiUserAddressBucketHistoryPass({ id })
  getLists()
}

const handleReject = async (id: number | any[]) => {
  await feedback.confirm('确定要驳回申请？')
  await apiUserAddressBucketHistoryReject({ id })
  getLists()
}

getLists()
</script>

