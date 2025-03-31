/**
 * RListBalanceVo, 响应信息主体
 */
export interface UserBalanceResponse {
    code?: number;
    data?: BalanceVo[];
    msg?: string;
    [property: string]: any;
}

/**
 * BalanceVo, 现金资产表(TbBalance)实体类
 */
export interface BalanceVo {
    /**
     * 交易账号
     */
    accountId?: number;
    /**
     * 1现货，2期权，3期货，4杠杆账户
     */
    accountType?: number;
    /**
     * 对应的usdt计价总资产
     */
    assetTotal?: number;
    /**
     * 可用资产
     */
    available?: number;
    createdAt?: number;
    id?: number;
    /**
     * 负债资产
     */
    indebted?: number;
    /**
     * 指数价格
     */
    indexPrice?: number;
    /**
     * 已冻结资产。
     */
    locked?: number;
    /**
     * 指数涨跌幅
     */
    priceChange?: number;
    tokenId?: string;
    /**
     * 总资产
     */
    total?: number;
    updatedAt?: number;
    userId?: number;
    [property: string]: any;
}
