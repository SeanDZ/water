<template>
  <div>
    <el-card class="!border-none mb-4" shadow="never">
        <el-alert
                type="warning"
                title="温馨提示：用户邀请好友注册并购买，仅限首单，订单配送完成后自动发放水票商品（邀新活动进行中的只能设置一个）"
                :closable="false"
                show-icon
        ></el-alert>
      <el-form class="mb-[-16px] mt-[16px]" :model="queryParams" inline>
        <el-form-item label="活动标题" prop="name">
          <el-input
            class="w-[280px]"
            v-model="queryParams.name"
            clearable
            placeholder="请输入活动标题"
          />
        </el-form-item>
<!--        <el-form-item label="面向用户" prop="user_limit">-->
<!--          <el-select-->
<!--            class="w-[280px]"-->
<!--            v-model="queryParams.user_limit"-->
<!--            clearable-->
<!--            placeholder="请选择面向用户"-->
<!--          >-->
<!--            <el-option label="全部" value=""></el-option>-->
<!--            <el-option-->
<!--              v-for="(item, index) in dictData.user_limit"-->
<!--              :key="index"-->
<!--              :label="item.name"-->
<!--              :value="item.value"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
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
        v-perms="['activity.shop_invite_activity/add']"
        type="primary"
        @click="handleAdd"
      >
        <template #icon>
          <icon name="el-icon-Plus" />
        </template>
        新增
      </el-button>
      <el-button
        v-perms="['activity.shop_invite_activity/delete']"
        :disabled="!selectData.length"
        @click="handleDelete(selectData)"
      >
        删除
      </el-button>
      <div class="mt-4">
        <el-table :data="pager.lists" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="活动标题" prop="name" show-overflow-tooltip />
            <el-table-column label="活动图片" prop="img">
                <template #default="{ row }">
                    <el-image style="width: 50px; height: 50px" :src="row.img" />
                </template>
            </el-table-column>

            <el-table-column
            label="商品信息"
            prop="good_name"
            show-overflow-tooltip
          />
          <el-table-column
            label="水票价值"
            prop="price"
            show-overflow-tooltip
          />
          <el-table-column
            label="水票数量"
            prop="ticket_num"
            show-overflow-tooltip
          />
          <el-table-column
            label="开始时间"
            prop="start_time"
            show-overflow-tooltip
          />
          <el-table-column
            label="结束时间"
            prop="end_time"
            show-overflow-tooltip
          />
          <el-table-column
            label="库存"
            prop="stock_num"
            show-overflow-tooltip
          />
            <el-table-column label="活动状态" prop="ac_status">
                <template #default="{ row }">
                    <el-tag v-if="row.ac_status == 0">未开始</el-tag>
                    <el-tag type="success" v-else-if="row.ac_status == 1" >进行中</el-tag>
                    <el-tag type="danger" v-else >已结束</el-tag>
                </template>
            </el-table-column>

          <el-table-column
            label="已发放"
            prop="received_num"
            show-overflow-tooltip
          />
<!--          <el-table-column label="面向用户" prop="user_limit">-->
<!--            <template #default="{ row }">-->
<!--              <dict-value-->
<!--                :options="dictData.user_limit"-->
<!--                :value="row.user_limit"-->
<!--                :config="{ label: 'name', value: 'value' }"-->
<!--              />-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="状态" prop="status">
            <template #default="{ row }">
              <dict-value
                :options="dictData.status"
                :value="row.status"
                :config="{ label: 'name', value: 'value' }"
              />
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
                v-if = "row.ac_status != 2"
                v-perms="['activity.shop_invite_activity/edit']"
                type="primary"
                link
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                v-perms="['activity.shop_invite_activity/delete']"
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

<script lang="ts" setup name="shopInviteActivityLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import {
  apiShopInviteActivityLists,
  apiShopInviteActivityDelete
} from '@/api/shop_invite_activity'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)

// 查询条件
const queryParams = reactive({
  name: '',
  user_limit: 1,
  status: ''
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
  selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('user_limit,status')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: apiShopInviteActivityLists,
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
  await apiShopInviteActivityDelete({ id })
  getLists()
}

getLists()
</script>

