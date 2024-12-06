import request from '@/utils/request'

// 商户门店列表
export function apiShopWaterStationLists(params: any) {
    return request.get({ url: '/station.shop_water_station/lists', params })
}

// 添加商户门店
export function apiShopWaterStationAdd(params: any) {
    return request.post({ url: '/station.shop_water_station/add', params })
}

// 编辑商户门店
export function apiShopWaterStationEdit(params: any) {
    return request.post({ url: '/station.shop_water_station/edit', params })
}

// 删除商户门店
export function apiShopWaterStationDelete(params: any) {
    return request.post({ url: '/station.shop_water_station/delete', params })
}

// 商户门店详情
export function apiShopWaterStationDetail(params: any) {
    return request.get({ url: '/station.shop_water_station/detail', params })
}