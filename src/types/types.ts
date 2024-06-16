export interface ILabelValue {
  label: string;
  value: string | number;
  [key: string]: any;
}

export interface IBaseInfo {
  headImgUrl: string; // 头像信息
  nickName: string; // 名称
  carInfo: string; // 车辆信息
  driveYear: number; // 驾龄
  location: string; // 常停车地
}

export interface IPostItem extends IBaseInfo {
  articleCode: string; // 文章ID
  userId: string; // 文章作者ID
  userLocation: string;
  location: string; // 文章发表位置
  content: string;
  createTime: string;
  fileUrlList: string[];
  likeNum: number; // 点赞数量
  unLikeNum: number; // 踩数量
  isLike: boolean; // 本人是否点赞
  isUnlike: boolean; // 本人是否点踩
}

export enum ELikeOp {
  LIKE = 1,
  CANCEL_LIKE = 2,
  UNLIKE = 3,
  CANCEL_UNLIKE = 4,
}

export interface IReqLikeOp {
  articleCode: string;
  likeType: ELikeOp;
}

export interface ILocation {
  longitude: number;
  latitude: number;
}

export enum ECode {
  TOKEN_OUT = 1001,
}
