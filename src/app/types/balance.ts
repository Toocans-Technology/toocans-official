/**
 * BalanceVo，现金资产表(TbBalance)实体类
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
    /**
     * 对应的usdt计价可用总资产
     */
    availableAssetTotal?: number;
    createdAt?:           number;
    id?:                  number;
    /**
     * 负债资产
     */
    indebted?: number;
    /**
     * 已冻结资产。
     */
    locked?: number;
    /**
     * 实时价格
     */
    marketPrice?: number;
    /**
     * 价格变化涨跌幅
     */
    marketPriceChange?: number;
    tokenId?:           string;
    /**
     * 总资产
     */
    total?:     number;
    updatedAt?: number;
    userId?:    number;
    [property: string]: any;
}

/**
 * RListBalanceVo，响应信息主体
 */
export interface Response {
    code?: number;
    data?: BalanceVo[];
    msg?:  string;
    [property: string]: any;
}

export interface Request {
    tokenId?: string;
    [property: string]: any;
}
