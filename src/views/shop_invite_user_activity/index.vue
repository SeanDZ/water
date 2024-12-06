<template>
  <div>
    <el-card class="!border-none mb-4" shadow="never">
      <el-form class="mb-[-16px]" :model="queryParams" inline>
        <el-form-item label="邀请人昵称" prop="nickname">
          <el-input
            class="w-[250px]"
            v-model="queryParams.nickname"
            clearable
            placeholder="请输入客户昵称"
          />
        </el-form-item>
        <el-form-item label="邀请人手机号" prop="mobile">
          <el-input
            class="w-[250px]"
            v-model="queryParams.mobile"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>

          <el-form-item label="被邀请人昵称" prop="invite_nickname">
              <el-input
                      class="w-[250px]"
                      v-model="queryParams.invite_nickname"
                      clearable
                      placeholder="请输入客户昵称"
              />
          </el-form-item>
          <el-form-item label="被邀请人手机号" prop="invite_mobile">
              <el-input
                      class="w-[250px]"
                      v-model="queryParams.invite_mobile"
                      clearable
                      placeholder="请输入手机号"
              />
          </el-form-item>
<!--        <el-form-item label="状态" prop="status">-->
<!--          <el-select-->
<!--            class="w-[280px]"-->
<!--            v-model="queryParams.status"-->
<!--            clearable-->
<!--            placeholder="请选择状态"-->
<!--          >-->
<!--            <el-option label="全部" value=""></el-option>-->
<!--            <el-option-->
<!--              v-for="(item, index) in dictData.invite_status"-->
<!--              :key="index"-->
<!--              :label="item.name"-->
<!--              :value="item.value"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="!border-none" v-loading="pager.loading" shadow="never">
      <div class="mt-4">
        <el-table :data="pager.lists" @selection-change="handleSelectionChange">
          <el-table-column label="ID" prop="id" show-overflow-tooltip />
          <el-table-column
            label="邀请人昵称"
            prop="invite_nickname"
            show-overflow-tooltip
          />
            <el-table-column label="头像" min-width="100">
                <template #default="{ row }">
                    <el-avatar :src="row.invite_avatar" :size="50" />
                </template>
            </el-table-column>
          <el-table-column
            label="邀请人手机号"
            prop="invite_mobile"
            show-overflow-tooltip
          />

            <el-table-column
                    label="被邀请人昵称"
                    prop="nickname"
                    show-overflow-tooltip
            />
            <el-table-column label="头像" min-width="100">
                <template #default="{ row }">
                    <el-avatar :src="row.avatar" :size="50" />
                </template>
            </el-table-column>
            <el-table-column
                    label="被邀请人手机号"
                    prop="mobile"
                    show-overflow-tooltip
            />
            <el-table-column label="是否已首购" prop="is_order">
                <template #default="{ row }">
                    <el-tag v-if="row.is_order == 0">否</el-tag>
                    <el-tag type="success" v-else >是</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="create_time" show-overflow-tooltip />

            <!--          <el-table-column label="状态" prop="status">-->
<!--            <template #default="{ row }">-->
<!--              <dict-value-->
<!--                :options="dictData.invite_status"-->
<!--                :value="row.status"-->
<!--                :config="{ label: 'name', value: 'value' }"-->
<!--              />-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="操作" width="120" fixed="right">-->
<!--            <template #default="{ row }">-->
<!--              <el-button-->
<!--                v-perms="['activity.shop_invite_user_activity/delete']"-->
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

<script lang="ts" setup name="shopInviteUserActivityLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiShopInviteUserActivityLists } from '@/api/shop_invite_user_activity'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)

// 查询条件
const queryParams = reactive({
  nickname: '',
  mobile: '',
  invite_nickname:'',
  invite_mobile: ''
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
  selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('invite_status')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: apiShopInviteUserActivityLists,
  params: queryParams
})

// 删除
// const handleDelete = async (id: number | any[]) => {
//   await feedback.confirm('确定要删除？')
//   await apiShopInviteUserActivityDelete({ id })
//   getLists()
// }

getLists()
</script>

