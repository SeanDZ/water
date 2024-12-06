<!-- 网站信息 -->
<template>
    <div class="website-information">
        <el-form ref="formRef" :rules="rules" class="ls-form" :model="formData" label-width="120px">
            <el-card shadow="never" class="!border-none mt-4">
                <el-form-item label="货到付款" prop="accept_type">
                    <div class="mb-2 flex items-center text-sm">
                        <el-radio-group v-model="formData.offline_pay" class="ml-4">
                            <el-radio :label="0" size="large">关闭</el-radio>
                            <el-radio :label="1" size="large">开启</el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>
            </el-card>
        </el-form>
        <footer-btns v-perms="['shop.shop_config/set_pay_type']">
            <el-button type="primary" @click="handleSubmit">保存</el-button>
        </footer-btns>
    </div>
</template>

<script lang="ts" setup name="shopConfig">
import { apiShopPayType, apiShopPayTypeSet } from '@/api/shop_config'
import type { FormInstance } from 'element-plus'
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
    offline_pay: 0,
})

const getData = async () => {
    const data = await apiShopPayType()
    console.log(formData)
    for (const key in formData) {
        //@ts-ignore
        formData[key] = data[key]
    }
}

const handleSubmit = async () => {
    await formRef.value?.validate()
    await apiShopPayTypeSet(formData)
    getData()
}

getData()

</script>

<style lang="scss" scoped></style>
