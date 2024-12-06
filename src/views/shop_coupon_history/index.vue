<template>
  <div>
    <el-card class="!border-none mb-4" shadow="never">
      <el-form class="mb-[-16px]" :model="queryParams" inline>
        <el-form-item label="昵称" prop="nickname">
          <el-input
            class="w-[280px]"
            v-model="queryParams.nickname"
            clearable
            placeholder="请输入用户昵称"
          />
        </el-form-item>
          <el-form-item label="手机号" prop="mobile">
              <el-input
                      class="w-[280px]"
                      v-model="queryParams.mobile"
                      clearable
                      placeholder="请输入手机号"
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
              v-for="(item, index) in dictData.coupon_status"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券" prop="title">
          <el-input
            class="w-[280px]"
            v-model="queryParams.title"
            clearable
            placeholder="请输入优惠券"
          />
        </el-form-item>
        <el-form-item label="获取渠道" prop="type">
          <el-select
            class="w-[280px]"
            v-model="queryParams.type"
            clearable
            placeholder="请选择获取渠道"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="(item, index) in dictData.coupon_source"
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
            <el-table-column label="客户昵称" prop="nickname" show-overflow-tooltip />
            <el-table-column label="头像" min-width="100">
                <template #default="{ row }">
                    <el-avatar :src="row.avatar" :size="50" />
                </template>
            </el-table-column>
            <el-table-column label="手机号" prop="mobile" show-overflow-tooltip />
          <el-table-column label="状态" prop="status">
            <template #default="{ row }">
              <dict-value
                :options="dictData.coupon_status"
                :value="row.status"
                :config="{ label: 'name', value: 'value' }"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="优惠券"
            prop="title"
            show-overflow-tooltip
          />
          <el-table-column
            label="订单号"
            prop="shop_order_id"
            show-overflow-tooltip
          />
          <el-table-column label="获取渠道" prop="type">
            <template #default="{ row }">
              <dict-value
                :options="dictData.coupon_source"
                :value="row.type"
                :config="{ label: 'name', value: 'value' }"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="获取时间"
            prop="create_time"
            show-overflow-tooltip
          />
          <el-table-column
            label="使用时间"
            prop="update_time"
            show-overflow-tooltip
          />
<!--          <el-table-column label="操作" width="120" fixed="right">-->
<!--            <template #default="{ row }">-->
<!--              <el-button-->
<!--                v-perms="['coupon_history.shop_coupon_history/edit']"-->
<!--                type="primary"-->
<!--                link-->
<!--                @click="handleEdit(row)"-->
<!--              >-->
<!--                编辑-->
<!--              </el-button>-->
<!--              <el-button-->
<!--                v-perms="['coupon_history.shop_coupon_history/delete']"-->
<!--                type="danger"-->
<!--                link-->
<!--                @click="handleDelete(row.id)"-->
<!--              >-->
<!--                删除-->
<!--              </el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
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

<script lang="ts" setup name="shopCouponHistoryLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import {
  apiShopCouponHistoryLists,
  apiShopCouponHistoryDelete
} from '@/api/shop_coupon_history'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)

// 查询条件
const queryParams = reactive({
  nickname: '',
  mobile: '',
  status: '',
  title: '',
  type: ''
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
  selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('coupon_status,coupon_source')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: apiShopCouponHistoryLists,
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
  await apiShopCouponHistoryDelete({ id })
  getLists()
}

getLists()
</script>

