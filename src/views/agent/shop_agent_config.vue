<template>
    <div class="website-information">
        <el-card class="!border-none" shadow="never">
            <el-alert
                type="warning"
                title="温馨提示：订单配送完成时发放佣金，如果购买电子水票，水票下单配送完成后发放。"
                :closable="false"
                show-icon
            ></el-alert>
        </el-card>
        <el-form ref="formRef" :rules="rules" class="ls-form" :model="formData" label-width="120px">
            <el-card shadow="never" class="!border-none mt-4">
                <div class="text-xl font-medium mb-[20px]">
                    分销设置
                </div>
                <el-form-item label="分销启用" prop="status">
                    <div class="mb-2 flex items-center text-sm">
                        <el-radio-group v-model="formData.status" class="ml-4">
                            <el-radio :label="0" size="large">关闭</el-radio>
                            <el-radio :label="1" size="large">开启</el-radio>
                        </el-radio-group>
                    </div>
                    <span style="font-size: 12px;color: #9ca3af;margin-left: 50px">开启:分销功能启用；关闭:分销功能不可用</span>
                </el-form-item>

                <el-form-item label="自购返佣" prop="is_self">
                    <div class="mb-2 flex items-center text-sm">
                        <el-radio-group v-model="formData.is_self" class="ml-4">
                            <el-radio :label="0" size="large">关闭</el-radio>
                            <el-radio :label="1" size="large">开启</el-radio>
                        </el-radio-group>
                    </div>

                    <span style="font-size: 12px;color: #9ca3af;margin-left: 50px">开启: 分销商自购时可以自购佣金比例获得自购返佣；关闭:没有返佣</span>
                </el-form-item>

                <el-form-item label="分销模式" prop="type">
                    <div class="mb-2 flex items-center text-sm">
                        <el-radio-group v-model="formData.type" class="ml-4">
                            <el-radio :label="1" size="large">后台设置</el-radio>
                            <el-radio :label="2" size="large">人人分销</el-radio>
                            <el-radio :label="3" size="large">满额分销</el-radio>
                        </el-radio-group>
                        <span style="font-size: 12px;color: #9ca3af;margin-left: 50px">"后台设置"仅可后台设置分销员，"人人分销"默认每个用户注册成功后都可以分销，"满额分销"指用户购买商品满足设置的消费金额后自动成为分销员</span>
                    </div>
                </el-form-item>

                <el-form-item label="满额分销最低消费金额" prop="price" label-width="500" v-show="formData.type == 3">
                    <div class="mb-2 flex items-center text-sm">
                        <el-input v-model="formData.price" clearable placeholder="请输入金额" type="number">
                            <template #append>元</template>
                        </el-input>
                    </div>
                    <span style="font-size: 12px;color: #9ca3af;margin-left: 50px">用户消费金额达到设置最低消费金额 即可自动开通分销权限</span>

                </el-form-item>

                <el-form-item label="自购佣金比例" prop="self_rate" v-show="formData.is_self == 1">
                    <div class="mb-2 flex items-center text-sm">
                        <el-input v-model="formData.self_rate" clearable placeholder="请输入比例" type="number">
                            <template #append>%</template>
                        </el-input>
                    </div>
                    <span style="font-size: 12px;color: #9ca3af;margin-left: 50px"> 自己购买返佣比例，例:10 = 返订单金额的10%</span>
                </el-form-item>

                <el-form-item label="一级佣金比例" prop="rate" >
                    <div class="mb-2 flex items-center text-sm">
                        <el-input v-model="formData.rate" clearable placeholder="请输入比例" type="number">
                            <template #append>%</template>
                        </el-input>
                    </div>
                    <span style="font-size: 12px;color: #9ca3af;margin-left: 50px"> 订单交易成功后给上级返佣的比例，例:10 = 返订单金额的10%</span>
                </el-form-item>

                <el-form-item label="二级佣金比例" prop="last_rate">
                    <div class="mb-2 flex items-center text-sm">
                        <el-input v-model="formData.last_rate" clearable placeholder="请输入比例" type="number">
                            <template #append>%</template>
                        </el-input>
                    </div>
                    <span style="font-size: 12px;color: #9ca3af;margin-left: 50px"> 订单交易成功后给上上级返佣的比例，例:5 = 返订单金额的5%</span>
                </el-form-item>

                <el-form-item label="最低提现金额" prop="commission">
                    <div class="mb-2 flex items-center text-sm">
                        <el-input v-model="formData.commission" clearable placeholder="请输入金额" type="number">
                            <template #append>元</template>
                        </el-input>
                    </div>

                    <span style="font-size: 12px;color: #9ca3af;margin-left: 50px"> 佣金达到设置最低提现金额可提现</span>

                </el-form-item>
            </el-card>

        </el-form>
        <footer-btns v-perms="['agent.shop_agent_config/set_agent']">
            <el-button type="primary" @click="handleSubmit">保存</el-button>
        </footer-btns>
    </div>
</template>

<script lang="ts" setup name="shopConfig">
import type { FormInstance } from 'element-plus'
import {apiShopAgentConfigDetail, apiShopAgentConfigSave} from "@/api/shop_agent_commission";
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
    status: 0,
    is_self: 0,
    type:'',
    price:'',
    commission:'',
    rate:'',
    last_rate:'',
    self_rate:'',

})

const getData = async () => {
    const data = await apiShopAgentConfigDetail()
    console.log(formData)
    for (const key in formData) {
        //@ts-ignore
        formData[key] = data[key]
    }
}

const handleSubmit = async () => {
    await formRef.value?.validate()
    await apiShopAgentConfigSave(formData)
    getData()
}

getData()

</script>

<style lang="scss" scoped></style>
