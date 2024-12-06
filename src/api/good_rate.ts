import request from '@/utils/request'

// 商品利润统计列表
export function apiGoodRateLists(params: any) {
    return request.get({ url: '/finance.good_rate/lists', params })
}

export function apiGoodRateSaleData(params: any) {
    return request.get({ url: '/finance.good_rate/sale_data', params })
}

export function apiGoodRateShopData(params: any) {
    return request.get({ url: '/finance.good_rate/shop_data', params })
}

//员工配送数据
export function apiStaffData(params: any) {
    return request.get({ url: '/finance.staff/staff_data', params })
}

//商户营收数据
export function apiShopData(params: any) {
    return request.get({ url: '/finance.income/income', params })
}


//押桶欠桶数据
export function apiGoodBucketLists(params: any) {
    return request.get({ url: '/address.user_address_bucket/lists', params })
}
