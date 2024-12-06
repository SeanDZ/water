import request from '@/utils/request'

// 员工推广佣金列表
export function apiShopStaffCommissionLists(params: any) {
    return request.get({ url: '/staff.shop_staff_commission/lists', params })
}

// 添加员工推广佣金
export function apiShopStaffCommissionAdd(params: any) {
    return request.post({ url: '/staff.shop_staff_commission/add', params })
}

// 编辑员工推广佣金
export function apiShopStaffCommissionEdit(params: any) {
    return request.post({ url: '/staff.shop_staff_commission/edit', params })
}

// 删除员工推广佣金
export function apiShopStaffCommissionDelete(params: any) {
    return request.post({ url: '/staff.shop_staff_commission/delete', params })
}

// 员工推广佣金详情
export function apiShopStaffCommissionDetail(params: any) {
    return request.get({ url: '/staff.shop_staff_commission/detail', params })
}
//发放佣金
export function apiShopStaffCommissionIncome(params: any) {
    return request.post({ url: '/staff.shop_staff_commission/income', params })
}
