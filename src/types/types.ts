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
}

export interface IPostItem extends IBaseInfo {
  id: string; // 文章ID
  userId: string; // 文章作者ID
  userLocation: string;
  location: string; // 文章发表位置
  content: string;
  createTime: string;
  fileUrlList: string[];
  likeNum: number; // 点赞数量
  unLikeNum: number; // 踩数量
}
