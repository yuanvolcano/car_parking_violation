import { ELikeOp, IPostItem } from '@/types/types';

import { httpPromise } from './http-instance';

export const BASE_URL = 'http://121.41.226.90:8080';

/** 登录 */
export const LOGIN_URL = `${BASE_URL}/login/loginOrRegister`;

export interface IReqLogin {
  code: string;
}

export interface IResLogin {
  data: string;
}

export function apiLogin(data: IReqLogin) {
  return httpPromise<IResLogin>(LOGIN_URL, data, 'POST');
}

/** 更新用户信息 */
export const SAVE_USER_INFO = `${BASE_URL}/user/update`;

export interface IReqUserUpdate {
  nickName: string;
  headImgUrl: string;
  carInfo: string;
  driveYear: 0;
  location: string;
}

export interface IResBase {
  data: boolean;
}

export function apiUserUpdate(data: IReqUserUpdate) {
  return httpPromise<IResBase>(SAVE_USER_INFO, data, 'POST');
}

/** 获取用户列表 */
export const ARTICLE_LIST = `${BASE_URL}/article/pageArticle`;

export interface IReqArticleList {
  keyword: string;
  orderBy: number; // 1-时间，2-距离
  longitude: number;
  latitude: number;
  nextStartId: number; // 下次查询的起始文章ID
}

export interface IResArticleList {
  maxId: number;
  articleList: IPostItem[];
}

export function apiArticleList(data: IReqArticleList) {
  return httpPromise<IResArticleList>(ARTICLE_LIST, data, 'POST');
}

/** 点赞、点踩 */
export const LIKE_OPERATOR = `${BASE_URL}/article/likeOperate`;

export interface IReqLikeOperate {
  likeType: ELikeOp;
  articleCode: string;
}

export interface IResLikeOperate {
  likeNum: number;
  unLikeNum: number;
}

export function apiLikeOperate(data: IReqLikeOperate) {
  return httpPromise<IResLikeOperate>(LIKE_OPERATOR, data, 'POST');
}

/** 发帖 */
export const ARTICLE_SAVE = `${BASE_URL}/article/save`;

export interface IReqArticleSave {
  title: string;
  content: string;
  location: string;
  longitude: number;
  latitude: number;
  fileUrlList: string[];
}

export function apiArticleSave(data: IReqArticleSave) {
  return httpPromise<IResBase>(ARTICLE_SAVE, data, 'POST');
}

/** 上传文件 */
export const FILE_UPLOAD = `${BASE_URL}/file/upload`;
