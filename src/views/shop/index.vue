<template>
  <div>
    <el-card class="!border-none mb-4" shadow="never">
      <el-form class="mb-[-16px]" :model="queryParams" inline>
        <el-form-item label="商户名称" prop="name">
          <el-input
            class="w-[280px]"
            v-model="queryParams.name"
            clearable
            placeholder="请输入商户名称"
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
        <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="!border-none" v-loading="pager.loading" shadow="never">
      <el-button v-perms="['shop.shop/add']" type="primary" @click="handleAdd">
        <template #icon>
          <icon name="el-icon-Plus" />
        </template>
        新增
      </el-button>
      <el-button
        v-perms="['shop.shop/delete']"
        :disabled="!selectData.length"
        @click="handleDelete(selectData)"
      >
        删除
      </el-button>
      <div class="mt-4">
        <el-table :data="pager.lists" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="ID" prop="id" show-overflow-tooltip />
          <el-table-column label="商户名称" prop="name" show-overflow-tooltip />
          <el-table-column label="手机号" prop="mobile" show-overflow-tooltip />
          <el-table-column
            label="门店数量"
            prop="water_station_num"
            show-overflow-tooltip
          />
          <el-table-column
            label="员工数量"
            prop="water_staff_num"
            show-overflow-tooltip
          />
          <el-table-column
            label="有效期"
            prop="end_time"
            show-overflow-tooltip
          />
          <el-table-column label="小程序码" prop="app_img">
            <template #default="{ row }">
              <el-image
                style="width: 50px; height: 50px"
                :src="row.app_img"
              />
            </template>
          </el-table-column>
          <el-table-column label="商家收款码" prop="pay_img">
            <template #default="{ row }">
              <el-image style="width: 50px; height: 50px" :src="row.pay_img" />
            </template>
          </el-table-column>
          <el-table-column
            label="APPID"
            prop="app_id"
            show-overflow-tooltip
          />
          <el-table-column
            label="商户号"
            prop="pay_mchid"
            show-overflow-tooltip
          />

            <el-table-column label="版本" prop="status">
                <template #default="{ row }">
                    <el-tag v-if="row.version == 1">单店版</el-tag>
                    <el-tag type="success" v-else-if="row.version == 2">连锁版</el-tag>
                    <el-tag type="warning" v-else>企业版</el-tag>
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
          <el-table-column
            label="创建时间"
            prop="create_time"
            show-overflow-tooltip
          />
          <el-table-column label="操作" width="280" fixed="right">
            <template #default="{ row }">
              <el-button
                v-perms="['shop.shop/edit']"
                type="primary"
                link
                @click="handleEdit(row)"
              >
                编辑
              </el-button>

              <el-button
                      link
                      type="warning"
                      v-perms="['shop.shop/per']"
                      @click="handleAuth(row)"
              >
                  分配权限
              </el-button>
                <el-button
                        v-perms="['shop.shop/password']"
                        type="success"
                        link
                        @click="handlePassword(row.id,row.mobile)"
                >
                    重置密码
                </el-button>
              <el-button
                v-perms="['shop.shop/delete']"
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
      <auth-popup v-if="showAuth" ref="authRef" @success="getLists" @close="showAuth = false" />

  </div>
</template>

<script lang="ts" setup name="shopLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiShopLists, apiShopDelete,apiShopPassword } from '@/api/shop'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
import AuthPopup from './auth.vue'
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const authRef = shallowRef<InstanceType<typeof AuthPopup>>()
// 是否显示编辑框
const showEdit = ref(false)
const showAuth = ref(false)

// 查询条件
const queryParams = reactive({
  name: '',
  mobile: ''
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
  selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('status')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: apiShopLists,
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

//分配权限
const handleAuth = async (data: any) => {
    showAuth.value = true
    await nextTick()
    authRef.value?.open()
    authRef.value?.setFormData(data)
}

// 删除
const handleDelete = async (id: number | any[]) => {
  await feedback.confirm('确定要删除？')
  await apiShopDelete({ id })
  getLists()
}

const handlePassword = async (id: number,mobile:bigint | any[]) => {
    let pass = 'Wt'+ mobile.slice(-6)
    console.log(pass)
    await feedback.confirm(`重置后新密码 ${pass}  ，确定要重置？`)
    await apiShopPassword({ id })
}

getLists()
</script>

