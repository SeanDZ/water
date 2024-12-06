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
            class="w-[250px]"
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
            <el-table-column label="客户信息" width="180">
                <template #default="{ row }">
                    <div>昵称：{{row.nickname}}</div>
                    <div>手机号：{{row.mobile}}</div>
                    <div>地址：{{row.address}}</div>
                </template>
            </el-table-column>
            <el-table-column label="头像" min-width="80">
                <template #default="{ row }">
                    <el-avatar :src="row.avatar" :size="50" />
                </template>
            </el-table-column>
          <el-table-column
            label="所属门店"
            prop="water_station_name"
            show-overflow-tooltip
          />
            <el-table-column label="退桶商品（名称/退桶数量/单价）" width="500">
                <template #default="{ row }">
                    <el-table :data="row.bucket_info" :show-header="false">
                        <el-table-column prop="name" label="商品名称"> </el-table-column>
<!--                        <el-table-column prop="images" label="图片">-->
<!--                            <el-image style="width: 50px; height: 50px" :src="row.bucket_info.images" />-->
<!--                        </el-table-column>-->
                        <el-table-column prop="num" label="数量"> </el-table-column>
                        <el-table-column prop="price" label="单价"> </el-table-column>
                    </el-table>
                </template>
            </el-table-column>

          <el-table-column label="退桶总数量" prop="num" show-overflow-tooltip />
          <el-table-column label="审核状态" prop="apply_status">
            <template #default="{ row }">
              <dict-value
                :options="dictData.apply_status"
                :value="row.apply_status"
                :config="{ label: 'name', value: 'value' }"
              />
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" show-overflow-tooltip />
          <el-table-column
            label="申请时间"
            prop="create_time"
            show-overflow-tooltip
          />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button
                v-perms="['address.user_address_bucket_order/pass']"
                v-if="row.apply_status != 1"
                type="primary"
                link
                @click="handlePass(row.id)"
              >
                通过
              </el-button>
              <el-button
                v-perms="['address.user_address_bucket_order/reject']"
                v-if="row.apply_status == 0"
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

<script lang="ts" setup name="userAddressBucketOrderLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import {
  apiUserAddressBucketOrderLists,
  apiUserAddressBucketOrderDelete,
  apiUserAddressBucketOrderPass,
  apiUserAddressBucketOrderReject
} from '@/api/user_address_bucket_order'
import feedback from '@/utils/feedback'

// 是否显示编辑框
const showEdit = ref(false)

// 查询条件
const queryParams = reactive({
  nickname: '',
  address: '',
  apply_status: '',
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
  fetchFun: apiUserAddressBucketOrderLists,
  params: queryParams
})


// 删除
const handleDelete = async (id: number | any[]) => {
  await feedback.confirm('确定要删除？')
  await apiUserAddressBucketOrderDelete({ id })
  getLists()
}
const handlePass = async (id: number | any[]) => {
  await feedback.confirm('确定要通过退桶申请？')
  await apiUserAddressBucketOrderPass({ id })
  getLists()
}

const handleReject = async (id: number | any[]) => {
  await feedback.confirm('确定要驳回申请？')
  await apiUserAddressBucketOrderReject({ id })
  getLists()
}

getLists()
</script>

