/**
 * UserVerify，券商-国家代码表(TbUserVerify)实体类
 */
export interface UserVerify {
  /**
   * 证件反面照片url
   */
  cardBackUrl?: string;
  /**
   * 证件正面照片url
   */
  cardFrontUrl?: string;
  /**
   * 手持证件照片url
   */
  cardHandUrl?: string;
  /**
   * 证件号码
   */
  cardNo?: string;
  /**
   * 证件号码散列值
   */
  cardNoHash?: string;
  /**
   * 证件类型
   */
  cardType?: number;
  /**
   * country_code
   */
  countryCode?: string;
  created?: number;
  /**
   * 数据加密标识 1已加密 0未加密
   */
  dataEncrypt?: boolean;
  /**
   * 数据加解密密钥
   */
  dataSecret?: string;
  displayFailedReason?: string;
  /**
   * 人脸核身照片url
   */
  facePhotoUrl?: string;
  /**
   * 人脸核身视频url
   */
  faceVideoUrl?: string;
  /**
   * 姓氏
   */
  firstName?: string;
  /**
   * 全名
   */
  fullName?: string;
  /**
   * 性别：1 男 2 女
   */
  gender?: number;
  id?: number;
  /**
   * kyc级别: 0-未认证 1-初级认证
   */
  kycLevel?: number;
  /**
   * 国籍：保存country里面的id
   */
  nationality?: number;
  /**
   * user id passed check: 1 true 0 false
   */
  passedIdCheck?: number;
  /**
   * 名字
   */
  secondName?: string;
  /**
   * 提交时间
   */
  submissionTime?: number;
  /**
   * 更新时间
   */
  updated?: number;
  /**
   * 用户ID
   */
  userId?: number;
  /**
   * 驳回原因
   */
  verifyReason?: string;
  /**
   * 状态：0 未提交 ,1 审核中  2 审核通过 3 审核未通过，重新上传
   */
  verifyStatus?: number;
  /**
   * 录制视频url
   */
  videoUrl?: string;
  [property: string]: any;
}

export interface UserVerifyResponse {
  code?: number;
  data?: UserVerify;
  msg?: string;
  [property: string]: any;
}
