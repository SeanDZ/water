import request from '@/utils/request'

// 门店商品列表
export function apiShopWaterStationGoodLists(params: any) {
    return request.get({ url: '/station.shop_water_station_good/lists', params })
}

// 添加门店商品
export function apiShopWaterStationGoodAdd(params: any) {
    return request.post({ url: '/station.shop_water_station_good/add', params })
}

// 编辑门店商品
export function apiShopWaterStationGoodEdit(params: any) {
    return request.post({ url: '/station.shop_water_station_good/edit', params })
}

// 删除门店商品
export function apiShopWaterStationGoodDelete(params: any) {
    return request.post({ url: '/station.shop_water_station_good/delete', params })
}

// 门店商品详情
export function apiShopWaterStationGoodDetail(params: any) {
    return request.get({ url: '/station.shop_water_station_good/detail', params })
}

// 门店商品上下架
export function apiShopWaterStationGoodStatus(params: any) {
    return request.post({ url: '/station.shop_water_station_good/sale_status', params })
}

// 批量上下架
export function apiShopWaterStationGoodStatus2(params: any) {
    return request.post({ url: '/station.shop_water_station_good/sales_status', params })
}