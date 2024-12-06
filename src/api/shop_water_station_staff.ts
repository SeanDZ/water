import request from '@/utils/request'

// 员工管理列表
export function apiShopWaterStationStaffLists(params: any) {
    return request.get({ url: '/staff.shop_water_station_staff/lists', params })
}

// 添加员工管理
export function apiShopWaterStationStaffAdd(params: any) {
    return request.post({ url: '/staff.shop_water_station_staff/add', params })
}

// 编辑员工管理
export function apiShopWaterStationStaffEdit(params: any) {
    return request.post({ url: '/staff.shop_water_station_staff/edit', params })
}

// 删除员工管理
export function apiShopWaterStationStaffDelete(params: any) {
    return request.post({ url: '/staff.shop_water_station_staff/delete', params })
}

// 员工管理详情
export function apiShopWaterStationStaffDetail(params: any) {
    return request.get({ url: '/staff.shop_water_station_staff/detail', params })
}


// 水站下员工
export function apiShopWaterStationStaffs(params: any) {
    return request.get({ url: '/staff.shop_water_station_staff/staff', params })
}