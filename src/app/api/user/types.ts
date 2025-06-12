export interface Response {
    code?: number;
    data?: LoginUser;
    msg?: string;
    [property: string]: any;
}

export interface LoginUser {
    accountId?: number;
    avatar?: string;
    clientId?: string;
    clientKey?: string;
    clientSecret?: string;
    concatMobile?: string;
    deviceType?: DeviceType;
    email?: string;
    emailRegistration?: boolean;
    grantType?: string;
    hasGaKey?: boolean;
    kycLevel?: number;
    language?: string;
    loginId?: string;
    loginName?: string;
    mobile?: string;
    mobileRegistration?: boolean;
    nationalCode?: string;
    nickname?: string;
    registerType?: number;
    setPassword?: boolean;
    userId?: number;
    userType?: number;
    [property: string]: any;
}

export enum DeviceType {
    App = "APP",
    H5 = "H5",
    PC = "PC",
    Social = "SOCIAL",
}
