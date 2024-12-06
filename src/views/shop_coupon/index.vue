<template>
  <div>
    <el-card class="!border-none mb-4" shadow="never">
      <el-form class="mb-[-16px]" :model="queryParams" inline>
        <el-form-item label="名称" prop="title">
          <el-input
            class="w-[280px]"
            v-model="queryParams.title"
            clearable
            placeholder="请输入名称"
          />
        </el-form-item>
        <el-form-item label="使用范围" prop="type">
          <el-select
            class="w-[280px]"
            v-model="queryParams.type"
            clearable
            placeholder="请选择使用范围"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="(item, index) in dictData.coupon_type"
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
        v-perms="['coupon.shop_coupon/add']"
        type="primary"
        @click="handleAdd"
      >
        <template #icon>
          <icon name="el-icon-Plus" />
        </template>
        新增
      </el-button>
      <el-button
        v-perms="['coupon.shop_coupon/delete']"
        :disabled="!selectData.length"
        @click="handleDelete(selectData)"
      >
        删除
      </el-button>
      <div class="mt-4">
        <el-table :data="pager.lists" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="活动名称" prop="title" show-overflow-tooltip />
            <el-table-column label="图片" prop="img">
                <template #default="{ row }">
                    <el-image style="width: 50px; height: 50px" :src="row.img" />
                </template>
            </el-table-column>
          <el-table-column label="使用范围" prop="type">
            <template #default="{ row }">
              <dict-value
                :options="dictData.coupon_type"
                :value="row.type"
                :config="{ label: 'name', value: 'value' }"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="活动时间"
            prop="activity_time"
            show-overflow-tooltip
            width="330"
          />
            <el-table-column label="活动状态" prop="activity_status">
                <template #default="{ row }">
                    <el-tag v-if="row.activity_status == 0">未开始</el-tag>
                    <el-tag type="success" v-else-if="row.activity_status == 1">进行中</el-tag>
                    <el-tag type="warning" v-else >已结束</el-tag>
                </template>
            </el-table-column>
          <el-table-column
                  label="优惠券面值"
                  prop="price"
                  show-overflow-tooltip
          />
            <el-table-column label="是否显示" prop="cp_type">
                <template #default="{ row }">
                    <el-tag type="success" v-if="row.status == 1">显示</el-tag>
                    <el-tag type="danger" v-else >隐藏</el-tag>
                </template>
            </el-table-column>
          <el-table-column
            label="使用限制"
            prop="limit_use"
            show-overflow-tooltip
          />
            <el-table-column label="领取限制" prop="cp_type" width="100">
                <template #default="{ row }">
                    <el-tag v-if="row.cp_type == 1">限制领取一次</el-tag>
                    <el-tag type="danger" v-else >每天限制领取</el-tag>
                </template>
            </el-table-column>
          <el-table-column
            label="限制数量"
            prop="limit_num"
            show-overflow-tooltip
          />
          <el-table-column
            label="发行总量"
            prop="push_num"
            show-overflow-tooltip
          />
            <el-table-column
                    label="已领取"
                    prop="received_num"
                    show-overflow-tooltip
            />
            <el-table-column
                    label="已使用"
                    prop="used_num"
                    show-overflow-tooltip
            />
            <el-table-column
                    label="未使用"
                    prop="now_num"
                    show-overflow-tooltip
            />
          <el-table-column label="备注" prop="remark" show-overflow-tooltip />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button
                v-perms="['coupon.shop_coupon/edit']"
                type="primary"
                link
                @click="handleEdit(row)"
                v-show="row.activity_status < 2"
              >
                编辑
              </el-button>
              <el-button
                v-perms="['coupon.shop_coupon/delete']"
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

<script lang="ts" setup name="shopCouponLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiShopCouponLists, apiShopCouponDelete } from '@/api/shop_coupon'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)

// 查询条件
const queryParams = reactive({
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
const { dictData } = useDictData('coupon_type')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: apiShopCouponLists,
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
  await apiShopCouponDelete({ id })
  getLists()
}

getLists()
</script>

