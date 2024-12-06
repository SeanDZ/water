<!-- 网站信息 -->
<template>
    <div class="website-information">
        <el-form ref="formRef" :rules="rules" class="ls-form" :model="formData" label-width="120px">

            <el-card shadow="never" class="!border-none mt-4">
                <div class="text-xl font-medium mb-[20px]">
                    积分设置
                </div>


                <el-form-item label="注册赠送积分" prop="invite_point_type">
                    <div class="mb-2 flex items-center text-sm">
                        <el-radio-group v-model="formData.invite_point_type" class="ml-4">
                            <el-radio :label="0" size="large">关闭</el-radio>
                            <el-radio :label="1" size="large">开启</el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>
                <el-form-item label="注册赠送数量" prop="invite_point" v-show="formData.invite_point_type == 1">
                    <div class="mb-2 flex items-center text-sm">
                        <el-input-number v-model="formData.invite_point" clearable placeholder=""/>
                    </div>
                    <span style="color: #e6a23c;margin-left: 15px">新用户注册赠送积分数量。</span>
                </el-form-item>

                <el-form-item label="下单赠送积分" prop="order_point_type">
                    <div class="mb-2 flex items-center text-sm">
                        <el-radio-group v-model="formData.order_point_type" class="ml-4">
                            <el-radio :label="0" size="large">关闭</el-radio>
                            <el-radio :label="1" size="large">开启</el-radio>
                        </el-radio-group>
                    </div>
                </el-form-item>
                <el-form-item label="下单赠送数量" prop="order_point"  v-show="formData.order_point_type == 1">
                    <div class="mb-2 flex items-center text-sm">
                        <el-input-number v-model="formData.order_point" clearable placeholder=""/>
                    </div>
                    <span style="color: #e6a23c;margin-left: 15px">订单配送完成后，配送商品总金额每满10元可获得积分数量。</span>
                </el-form-item>
                <el-form-item label="积分使用上限" prop="limit_point">
                    <div class="mb-2 flex items-center text-sm">
                        <el-input-number v-model="formData.limit_point" clearable placeholder=""/>
                    </div>
                    <span style="color: #e6a23c;margin-left: 15px">单次兑换使用积分上限，如果填写0 则不限制！</span>
                </el-form-item>
            </el-card>

        </el-form>
        <footer-btns v-perms="['point.point_config/set_point']">
            <el-button type="primary" @click="handleSubmit({type:1})">保存</el-button>
        </footer-btns>
    </div>
</template>

<script lang="ts" setup name="pointConfig">
import { apiPointConfigDetail, apiPointConfigSet } from '@/api/point_config'
import type { FormInstance } from 'element-plus'
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
    order_point: 0,
    invite_point: 0,
    limit_point: 0,
    order_point_type: 0,
    invite_point_type: 0,
})

const getData = async () => {
    const data = await apiPointConfigDetail()
    console.log(formData)
    for (const key in formData) {
        //@ts-ignore
        formData[key] = data[key]
    }
}

const handleSubmit = async (pro={}) => {
    await formRef.value?.validate()
    await apiPointConfigSet({...formData,...pro})
    getData()
}

getData()

</script>

<style lang="scss" scoped></style>
