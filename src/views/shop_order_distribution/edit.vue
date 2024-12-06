<template>
    <div class="edit-popup">
        <popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit"
               @close="handleClose">
            <el-form ref="formRef" :model="formData" label-width="90px" :rules="formRules">
                <el-form-item label="配送员" prop="staff_id">
                    <el-select class="w-80" v-model="formData.staff_id" placeholder="全部" clearable>
                        <el-option v-for="item in staffListOptions" :key="item.id" :label="item.name"
                                   :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="shopOrderDistributionEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiShopOrderDistributionEdit } from '@/api/shop_order_distribution'
import { apiShopWaterStationStaffs} from "@/api/shop_water_station_staff"
import type { PropType } from 'vue'

defineProps({
    dictData: {
        type: Object as PropType<Record<string, any[]>>,
        default: () => ({})
    }
})
const route = useRoute()
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('edit')


// 弹窗标题
const popupTitle = computed(() => {
    return mode.value == 'edit' ? '派单' : '派单'
})

// 表单数据
const formData = reactive({
    id: '',
    staff_id:''
})


// 表单验证
const formRules = reactive<any>({
    staff_id: [{
        required: true,
        message: '请选择配送员',
        trigger: ['blur']
    }],
})

const staffListOptions = ref<any[]>([])
// 分页相关
const getStaffList = async () => {
    try {
        const staffLists : any = await apiShopWaterStationStaffs({  })
        staffListOptions.value = staffLists.lists
        console.log(staffListOptions.value)
    } catch (e) {
        console.log('err', e)
    }
}
getStaffList()
// 获取详情
const setFormData = async (data: Record<any, any>) => {
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //@ts-ignore
            formData[key] = data[key]
        }
    }
}

// 提交按钮
const handleSubmit = async () => {
    await formRef.value?.validate()
    const data = { ...formData,  }
    await apiShopOrderDistributionEdit(data)
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
    setFormData
})
</script>
