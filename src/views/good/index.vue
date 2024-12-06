<template>
  <div>
    <el-card class="!border-none mb-4" shadow="never">
      <el-form class="mb-[-16px]" :model="queryParams" inline>
        <el-form-item label="商品名称" prop="name">
          <el-input
            class="w-[250px]"
            v-model="queryParams.name"
            clearable
            placeholder="请输入商品名称"
          />
        </el-form-item>
        <el-form-item label="商品品牌" prop="good_brand_id">
              <el-select class="w-50" v-model="queryParams.good_brand_id" placeholder="" clearable>
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in goodBrandListOptions" :key="item.id" :label="item.name"
                             :value="item.id" />
              </el-select>
          </el-form-item>
          <el-form-item label="商品分类" prop="good_category_id">
              <el-select class="w-50" v-model="queryParams.good_category_id" placeholder="" clearable>
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in goodCategoryListOptions" :key="item.id" :label="item.name"
                             :value="item.id" />
              </el-select>
          </el-form-item>
        <el-form-item label="是否上架" prop="status">
          <el-select
            class="w-[100px]"
            v-model="queryParams.status"
            clearable
            placeholder="请选择是否上架"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="(item, index) in dictData.good_status"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

          <el-form-item label="是否押桶" prop="is_deposit">
              <el-select class="w-[100px]" v-model="queryParams.is_deposit">
                  <el-option label="全部" value />
                  <el-option label="是" :value="1" />
                  <el-option label="否" :value="0" />
              </el-select>
          </el-form-item>
          <el-form-item label="是否收楼层费" prop="is_floor">
              <el-select class="w-[100px]" v-model="queryParams.is_floor">
                  <el-option label="全部" value />
                  <el-option label="是" :value="1" />
                  <el-option label="否" :value="0" />
              </el-select>
          </el-form-item>
          <el-form-item label="是否热销" prop="is_hot">
              <el-select class="w-[100px]" v-model="queryParams.is_hot">
                  <el-option label="全部" value />
                  <el-option label="是" :value="1" />
                  <el-option label="否" :value="0" />
              </el-select>
          </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="!border-none" v-loading="pager.loading" shadow="never">
<!--      <el-button v-perms="['good.good/add']" type="primary" @click="handleAdd">-->
<!--        <template #icon>-->
<!--          <icon name="el-icon-Plus" />-->
<!--        </template>-->
<!--        新增-->
<!--      </el-button>-->
          <router-link
                  v-perms="['good.good/add','good.good/add:edit']"
                  :to="{
                      path:'good/edit'
                  }"
          >
              <el-button type="primary" class="mb-4">
                  <template #icon>
                      <icon name="el-icon-Plus" />
                  </template>
                  新增
              </el-button>
          </router-link>


<!--        <el-button-->
<!--        v-perms="['good.good/delete']"-->
<!--        :disabled="!selectData.length"-->
<!--        @click="handleDelete(selectData)"-->
<!--      >-->
<!--        删除-->
<!--      </el-button>-->
      <div class="mt-4">
        <el-table :data="pager.lists" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="ID" prop="id" show-overflow-tooltip />
          <el-table-column
            label="品牌"
            prop="brand_name"
            show-overflow-tooltip
          />
          <el-table-column
            label="分类"
            prop="cate_name"
            show-overflow-tooltip
          />
          <el-table-column label="商品名称" prop="name" show-overflow-tooltip />
          <el-table-column label="是否上架" prop="status">
            <template #default="{ row }">
              <el-switch
                v-perms="['good.good/edit']"
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="changeStatus($event, row, 'status')"
              />
            </template>
          </el-table-column>
          <el-table-column label="商品类型" prop="type">
            <template #default="{ row }">
              <dict-value
                :options="dictData.type"
                :value="row.type"
                :config="{ label: 'name', value: 'value' }"
              />
            </template>
          </el-table-column>
          <el-table-column label="售价" prop="price" show-overflow-tooltip />
          <el-table-column
            label="成本价"
            prop="cost_price"
            show-overflow-tooltip
          />
          <el-table-column label="是否押桶" prop="is_deposit">
            <template #default="{ row }">
              <el-switch
                v-perms="['good.good/edit']"
                v-model="row.is_deposit"
                :active-value="1"
                :inactive-value="0"
                @change="changeStatus($event, row, 'is_deposit')"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="空桶押金"
            prop="deposit_price"
            show-overflow-tooltip
          />
            <el-table-column label="热销" prop="is_hot">
                <template #default="{ row }">
                    <el-tag v-if="row.is_hot == 1">是</el-tag>
                    <el-tag type="danger"  v-else >否</el-tag>
                </template>
            </el-table-column>
          <el-table-column label="销量" prop="num" show-overflow-tooltip />
          <el-table-column label="检查库存" prop="type">
              <template #default="{ row }">
                  <el-tag  v-if="row.is_limit == 1">是</el-tag>
                  <el-tag type="danger" v-else >否</el-tag>
              </template>
          </el-table-column>
          <el-table-column label="商品图片" prop="images">
            <template #default="{ row }">
              <el-image style="width: 50px; height: 50px" :src="row.images" />
            </template>
          </el-table-column>
          <el-table-column label="排序" prop="order" show-overflow-tooltip />
          <el-table-column label="楼层费" prop="is_floor">
            <template #default="{ row }">
              <el-switch
                v-perms="['good.good/edit']"
                v-model="row.is_floor"
                :active-value="1"
                :inactive-value="0"
                @change="changeStatus($event, row, 'is_floor')"
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
<!--              <el-button-->
<!--                v-perms="['good.good/edit']"-->
<!--                type="primary"-->
<!--                link-->
<!--                @click="handleEdit(row)"-->
<!--              >-->
<!--                编辑-->
<!--              </el-button>-->

                <el-button
                        v-perms="['good.good/edit','good.good/add:edit']"
                        type="primary"
                        link
                >
                    <router-link
                            :to="{
                                    path: 'good/edit', //菜单->路由路径
                                    query: {
                                        id: row.id
                                    }
                                }"
                    >
                        编辑
                    </router-link>
                </el-button>


                <el-button
                v-perms="['good.good/delete']"
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

<script lang="ts" setup name="goodLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiGoodLists, apiGoodEdit, apiGoodDelete } from '@/api/good'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
import {apiGoodBrandLists} from "@/api/good_brand";
import {apiGoodCategoryLists, apiGoodCategoryLists2} from "@/api/good_category";


const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)

// 查询条件
const queryParams = reactive({
  name: '',
  status: '',
  is_deposit:'',
  is_hot:'',
  good_brand_id:'',
  good_category_id:''
})

const changeStatus = async (deal: any, row: any, type: any) => {
  try {
    if (type == 'status') {
      row.status = deal
    } else if (type == 'is_deposit') {
      row.is_deposit = deal
    } else if (type == 'is_floor') {
      row.is_floor = deal
    }
    await apiGoodEdit(row)
    getLists()
  } catch (error) {
    getLists()
  }
}

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
  selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('good_status,type,is_deposit')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
  fetchFun: apiGoodLists,
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
  await apiGoodDelete({ id })
  getLists()
}

const goodBrandListOptions = ref<any[]>([])
const getGoodBrandList = async () => {
    try {
        const goodBrandListLists : any = await apiGoodBrandLists({  })
        goodBrandListOptions.value = goodBrandListLists.lists
    } catch (e) {
        console.log('err', e)
    }
}
getGoodBrandList()


const goodCategoryListOptions = ref<any[]>([])
// 分页相关
const getGoodCategoryList = async () => {
    try {
        const goodCategoryListLists : any = await apiGoodCategoryLists2({  })
        goodCategoryListOptions.value = goodCategoryListLists.lists
    } catch (e) {
        console.log('err', e)
    }
}
getGoodCategoryList()



getLists()
</script>