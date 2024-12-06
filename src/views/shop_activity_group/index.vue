<template>
  <div>
    <el-card class="!border-none mb-4" shadow="never">
      <el-form class="mb-[-16px]" :model="queryParams" inline>
        <el-form-item label="订单号" prop="trade_no">
          <el-input
            class="w-[280px]"
            v-model="queryParams.trade_no"
            clearable
            placeholder="请输入订单号"
          />
        </el-form-item>
          <el-form-item label="团码" prop="group_sn">
              <el-input
                      class="w-[280px]"
                      v-model="queryParams.group_sn"
                      clearable
                      placeholder="请输入团码"
              />
          </el-form-item>
        <el-form-item label="用户手机号" prop="mobile">
          <el-input
            class="w-[280px]"
            v-model="queryParams.mobile"
            clearable
            placeholder="请输入用户手机号"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            class="w-[280px]"
            v-model="queryParams.status"
            clearable
            placeholder="请选择状态"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="(item, index) in dictData.group_status"
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
            label="活动名称"
            prop="title"
            show-overflow-tooltip
          />
            <el-table-column
                    label="拼团团码"
                    prop="group_sn"
                    show-overflow-tooltip
            />
          <el-table-column
            label="订单号"
            prop="trade_no"
            show-overflow-tooltip
          />
            <el-table-column
                    label="昵称"
                    prop="nickname"
                    show-overflow-tooltip
            />
            <el-table-column label="头像" min-width="100">
                <template #default="{ row }">
                    <el-avatar :src="row.avatar" :size="50" />
                </template>
            </el-table-column>

            <el-table-column
            label="手机号"
            prop="mobile"
            show-overflow-tooltip
          />

            <el-table-column label="是否发起者" prop="is_main">
                <template #default="{ row }">
                    <el-tag v-if="row.is_main == 1">是</el-tag>
                    <el-tag type="danger" v-else>否</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="拼团商品" width="280">
                <template #default="{row}">
                    <div v-for="(item,index) in row.goods" :key="index" class='flex-row align-center' style="display: flex;align-items: center;margin-bottom: 6px;">
                        <el-image style="width: 40px; height: 40px;margin-right:6px" :src="item.images" fit="contain"></el-image>
                        <div style="margin-left: 5px">
                            {{item.name}} * {{item.good_num}}
                        </div>
                    </div>
                </template>
            </el-table-column>

          <el-table-column
            label="发起时间"
            prop="start_time"
            show-overflow-tooltip
          />
          <el-table-column
            label="结束时间"
            prop="end_time"
            show-overflow-tooltip
          />
          <el-table-column label="状态" prop="status">
            <template #default="{ row }">
              <dict-value
                :options="dictData.group_status"
                :value="row.status"
                :config="{ label: 'name', value: 'value' }"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if = "row.status != 2"
                v-perms="['activity_group.shop_activity_group/order_group']"
                type="primary"
                link
                @click="handleSuccess(row.id)"
              >
                一键成团
              </el-button>
              <el-button
                v-perms="['activity_group.shop_activity_group/delete']"
                type="danger"
                link
                @click="handleDelete(row.id)"
              >
                删除
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

<script lang="ts" setup name="shopActivityGroupLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import {
    apiShopActivityGroupLists,
    apiShopActivityGroupDelete,
    apiShopActivityGroupSuccess,
} from '@/api/shop_activity_group'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)

// 查询条件
const queryParams = reactive({
  trade_no: '',
  group_sn:'',
  mobile: '',
  status: ''
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
  selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('group_status')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: apiShopActivityGroupLists,
  params: queryParams
})

// 添加
const handleAdd = async () => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('add')
}

// 编辑
// const handleEdit = async (data: any) => {
//   showEdit.value = true
//   await nextTick()
//   editRef.value?.open('edit')
//   editRef.value?.setFormData(data)
// }

//一键成团
const handleSuccess = async (id: number | any[]) => {
    await feedback.confirm('确定一键拼团成功？')
    await apiShopActivityGroupSuccess({ id })
    getLists()
}

// 删除
const handleDelete = async (id: number | any[]) => {
  await feedback.confirm('确定要删除？')
  await apiShopActivityGroupDelete({ id })
  getLists()
}

getLists()
</script>

