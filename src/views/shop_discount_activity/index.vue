<template>
  <div>
    <el-card class="!border-none mb-4" shadow="never">
      <el-form class="mb-[-16px]" :model="queryParams" inline>
        <el-form-item label="活动名称" prop="name">
          <el-input
            class="w-[280px]"
            v-model="queryParams.name"
            clearable
            placeholder="请输入活动名称"
          />
        </el-form-item>
        <el-form-item label="优惠类型" prop="type">
          <el-select
            class="w-[280px]"
            v-model="queryParams.type"
            clearable
            placeholder="请选择优惠类型"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="(item, index) in dictData.discount_type"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
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
              v-for="(item, index) in dictData.status"
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
      <el-button
        v-perms="['activity.shop_discount_activity/add']"
        type="primary"
        @click="handleAdd"
      >
        <template #icon>
          <icon name="el-icon-Plus" />
        </template>
        新增
      </el-button>
      <el-button
        v-perms="['activity.shop_discount_activity/delete']"
        :disabled="!selectData.length"
        @click="handleDelete(selectData)"
      >
        删除
      </el-button>
      <div class="mt-4">
        <el-table :data="pager.lists" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="活动名称" prop="name" show-overflow-tooltip />
            <el-table-column label="活动图片" prop="img">
                <template #default="{ row }">
                    <el-image style="width: 50px; height: 50px" :src="row.img" />
                </template>
            </el-table-column>
          <el-table-column
            label="开始日期"
            prop="start_date"
            show-overflow-tooltip
          />
          <el-table-column
            label="结束日期"
            prop="end_date"
            show-overflow-tooltip
          />
            <el-table-column label="活动状态" prop="dc_status">
                <template #default="{ row }">
                    <el-tag v-if="row.dc_status == 0">未开始</el-tag>
                    <el-tag type="success" v-else-if="row.dc_status == 1" >进行中</el-tag>
                    <el-tag type="danger" v-else >已结束</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="优惠类型" prop="type">
            <template #default="{ row }">
              <dict-value
                :options="dictData.discount_type"
                :value="row.type"
                :config="{ label: 'name', value: 'value' }"
              />
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status">
            <template #default="{ row }">
              <dict-value
                :options="dictData.status"
                :value="row.status"
                :config="{ label: 'name', value: 'value' }"
              />
            </template>
          </el-table-column>
            <el-table-column label="参与商品" prop="good_type">
                <template #default="{ row }">
                    <el-tag v-if="row.good_type == 1">部分商品</el-tag>
                    <el-tag type="danger"  v-else >全部商品</el-tag>
                </template>
            </el-table-column>
          <el-table-column
            label="创建时间"
            prop="create_time"
            show-overflow-tooltip
          />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if = "row.dc_status != 2"
                v-perms="['activity.shop_discount_activity/edit']"
                type="primary"
                link
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                v-perms="['activity.shop_discount_activity/delete']"
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

<script lang="ts" setup name="shopDiscountActivityLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import {
  apiShopDiscountActivityLists,
  apiShopDiscountActivityDelete
} from '@/api/shop_discount_activity'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)

// 查询条件
const queryParams = reactive({
  name: '',
  type: '',
  status: ''
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
  selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('discount_type,status')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: apiShopDiscountActivityLists,
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
  await apiShopDiscountActivityDelete({ id })
  getLists()
}

getLists()
</script>

