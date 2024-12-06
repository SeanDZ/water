<template>
  <div class="edit-popup">
    <popup
      ref="popupRef"
      :title="popupTitle"
      :async="true"
      width="700px"
      @confirm="handleSubmit"
      @close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        label-width="110px"
        :rules="formRules"
      >
        <el-form-item label="名称" prop="title">
          <el-input
            v-model="formData.title"
            maxlength="30"
            show-word-limit
            clearable
            placeholder="请输入名称"
          />
        </el-form-item>
          <el-form-item label="活动图片" prop="img">
              <material-picker v-model="formData.img" />
          </el-form-item>
        <el-form-item label="使用类型" prop="type">
          <el-radio-group
            v-model="formData.type"
            placeholder="请选择使用类型"
            @change="typeChange"
          >
            <el-radio
              v-for="(item, index) in dictData.coupon_type"
              :key="index"
              :label="parseInt(item.value)"
            >
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="指定商品" prop="good" v-if="formData.type == 2">
          <el-tag style="height: 32px"
            v-for="(tag, index) in formData.good"
            :key="index"
            class="mx-1 my-1"
            closable
            @close="handleTagClose"
          >
            {{ tag.name }}
          </el-tag>
          <el-button
            class="button-new-tag ml-1"
            size="default"
            type="success"
            @click="addGoods(formData.good)"
          >
            添加指定商品
          </el-button>
        </el-form-item>
        <el-form-item label="优惠券面值" prop="price">
            <div class="mb-1 flex items-center text-sm">
                <el-input style="width: 180px" v-model="formData.price" clearable placeholder="请输入优惠券面值" type="number">
                    <template #append>元</template>
                </el-input>
            </div>
        </el-form-item>
        <el-form-item label="活动时间" prop="activity_time">
          <el-date-picker
            v-model="formData.activity_time"
            type="datetimerange"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY/MM/DD"
            time-format="hh:mm:ss"
            @change="dealChange"
            unlink-panels
          />
        </el-form-item>

        <el-form-item label="使用限制" prop="limit_use">
            <div class="mb-1 flex items-center text-sm">
                <el-input style="width: 180px" v-model="formData.limit_use" clearable placeholder="请输入使用限制" type="number">
                    <template #append>元</template>
                </el-input>
            </div>
          <el-tag class="ml-2" type="warning" size="large">满x元可使用，不填或填0则无使用门槛</el-tag>
        </el-form-item>
          <el-form-item label="领取限制">
              <el-radio-group v-model="formData.cp_type">
                  <el-radio :label="1">限制领取一次</el-radio>
                  <el-radio :label="2">每天限制领取</el-radio>
              </el-radio-group>
          </el-form-item>
        <el-form-item label="限制数量" prop="limit_num">
            <div class="mb-1 flex items-center text-sm">
                <el-input style="width: 180px" v-model="formData.limit_num" clearable placeholder="请输入限制数量" type="number">
                    <template #append>张</template>
                </el-input>
            </div>
            <el-tag class="ml-2" type="warning" size="large">客户可领取优惠券张数</el-tag>
        </el-form-item>
        <el-form-item label="发行总数量" prop="push_num">
            <div class="mb-1 flex items-center text-sm">
                <el-input style="width: 180px" v-model="formData.push_num" clearable placeholder="请输入发行总数量" type="number">
                    <template #append>张</template>
                </el-input>
            </div>
        </el-form-item>
          <el-form-item label="有效时间" prop="days">
              <div class="mb-1 flex items-center text-sm">
                  <el-input style="width: 180px" v-model="formData.days" clearable placeholder="请输入有效时间" type="number">
                      <template #append>天</template>
                  </el-input>
              </div>
              <el-tag class="ml-2" type="warning" size="large">自客户领取之后优惠券有效期</el-tag>
          </el-form-item>
          <el-form-item label="是否显示">
              <el-radio-group v-model="formData.status">
                  <el-radio :label="1">显示</el-radio>
                  <el-radio :label="0">隐藏</el-radio>
              </el-radio-group>
          </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            clearable
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
    </popup>
    <goods-popup
      v-if="showGoods"
      ref="goodsRef"
      @success="dealTags"
      @close="showGoods = false"
    />
  </div>
</template>
  
<script lang="ts" setup name="shopCouponEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import {
  apiShopCouponAdd,
  apiShopCouponEdit,
  apiShopCouponDetail
} from '@/api/shop_coupon'
import { timeFormat } from '@/utils/util'
import type { PropType } from 'vue'
import { number } from 'echarts/core'
import GoodsPopup from './choose_good.vue'

const goodsRef = shallowRef<InstanceType<typeof GoodsPopup>>()

// 是否显示商品选择
const showGoods = ref(false)

defineProps({
  dictData: {
    type: Object as PropType<Record<string, any[]>>,
    default: () => ({})
  }
})
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')

// 弹窗标题
const popupTitle = computed(() => {
  return mode.value == 'edit' ? '编辑' : '新增'
})

// const tags = ref([])

const addGoods = async (data: any) => {
  showGoods.value = true
  await nextTick()
  goodsRef.value?.open('goods')
  goodsRef.value?.setFormData(data)
}

const handleTagClose = (index: number) => {
  formData.good.splice(formData.good.indexOf(index), 1)
}

const dealTags = (e) => {
  // console.log(e, 22)
  let zArr = [...formData.good, ...e]
  let obj = {}
  let brr = []
  zArr.forEach((item) => {
    if (obj[item.id] == undefined) {
      obj[item.id] = 1
      // item['good_id'] = item.id
      brr.push(item)
    } else {
      obj[item.id] += 1
    }
  })
  console.log(brr, 444)
  formData.good = brr
}

// 表单数据
const formData = reactive({
  id: '',
  title: '',
    img: '',
  type: '',
  price: '',
  start_date: '',
  end_date: '',
  limit_use: '',
  limit_num: '',
  push_num: '',
  remark: '',
  shop_id: '',
  days: '',
  status:'',
  cp_type: '',
  good: []
})

// 表单验证
const formRules = reactive<any>({
  title: [
    {
      required: true,
      message: '请输入名称',
      trigger: ['blur']
    }
  ],
    img: [
        {
            required: true,
            message: '请上传图片',
            trigger: ['blur']
        }
    ],
  type: [
    {
      required: true,
      message: '请选择使用类型',
      trigger: ['blur']
    }
  ],
  good: [
    {
      required: true,
      message: '请选择商品',
      trigger: ['blur']
    }
  ],
  price: [
    {
      required: true,
      message: '请输入优惠券面值',
      trigger: ['blur']
    }
  ],
  activity_time: [
    {
      required: true,
      message: '活动时间不能为空',
      trigger: ['blur']
    }
  ],
  start_date: [
    {
      required: true,
      message: '请选择活动时间',
      trigger: ['blur']
    }
  ],
  end_date: [
    {
      required: true,
      message: '请选择',
      trigger: ['blur']
    }
  ],
    cp_type: [
        {
            required: true,
            message: '请选择领取限制',
            trigger: ['blur']
        }
    ],
  limit_num: [
    {
      required: true,
      message: '请输入限制数量',
      trigger: ['blur']
    }
  ],
  push_num: [
    {
      required: true,
      message: '请输入发行总数量',
      trigger: ['blur']
    }
  ],
    days: [
        {
            required: true,
            message: '请输入有效时间',
            trigger: ['blur']
        }
    ],
    status: [
        {
            required: true,
            message: '请选择是否显示',
            trigger: ['blur']
        }
    ],

})

const typeChange = (e) => {
  // console.log(e)

  // e == 1 ? (formData.good = [1]) : ''
}

// 获取详情
const setFormData = async (data: Record<any, any>) => {
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      //@ts-ignore

      if (key == 'good') {
        for (const ei in data[key]) {
          formData[key][ei] = data[key][ei]
          formData[key][ei]['id'] = data[key][ei]['good_id']
        }
      } else if (key == 'limit_use') {
        formData[key] = Number(data[key])
      } else {
        formData[key] = data[key]
      }
    }
  }
  formData['activity_time'] = [data['start_date'], data['end_date']]
  console.log(formData, 111)
}

const dealChange = (e) => {
  // console.log(e)
  formData.start_date = e[0]
  formData.end_date = e[1]
}

const getDetail = async (row: Record<string, any>) => {
  const data = await apiShopCouponDetail({
    id: row.id
  })
  setFormData(data)
}

// 提交按钮
const handleSubmit = async () => {
  console.log(formData)
  await formRef.value?.validate()
    if(formData['good'] && formData['good'].length > 0){
        for (const ei in formData['good']) {
            // formData['good'][ei] = data[key][ei]
            formData['good'][ei]['good_id'] = formData['good'][ei]['id']
        }
    }

  const data = { ...formData }
  mode.value == 'edit'
    ? await apiShopCouponEdit(data)
    : await apiShopCouponAdd(data)
  popupRef.value?.close()
  emit('success')
}

//打开弹窗
const open = (type = 'add') => {
  mode.value = type
  popupRef.value?.open()
}

// 关闭回调
const handleClose = () => {
  emit('close')
}

defineExpose({
  open,
  setFormData,
  getDetail
})
</script>
  