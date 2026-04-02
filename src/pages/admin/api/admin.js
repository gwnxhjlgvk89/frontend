/**
 * 管理员 API 模块
 * 处理社团和学生的 CRUD 操作
 * 基于已实现的 get, post, patch, put, del 五个基础方法
 */

import { get, post, patch, put, del } from "@/utils/request.js";

/**
 * ═══════════════════════════════════════════════════════════════
 * 社团管理 API
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * 获取所有社团
 * @returns {Promise}
 */
export const getClubs = async () => {
  return await get("/admin/clubs");
};

/**
 * 获取单个社团详情
 * @param {string} clubName - 社团名称
 * @returns {Promise}
 */
export const getClubDetail = async (clubName) => {
  return await get(`/admin/clubs/${clubName}`);
};

/**
 * 创建社团
 * @param {Object} data - 社团数据
 * @param {string} data.club_name - 社团名称（必填）
 * @param {string} data.super_club - 一级社团（必填）
 * @param {string} data.teacher_advisor - 指导老师
 * @param {string} data.club_president - 社长
 * @param {string} data.description - 社团简介
 * @param {string} data.description_detail - 社团详细介绍
 * @param {string} data.cover_image - 封面图片URL
 * @param {string} data.activity_position - 活动地点
 * @param {string} data.activity_time - 活动时间
 * @param {number} data.foundation_year - 成立年份
 * @param {number} data.total_quota - 总名额
 * @param {number} data.reserved_quota - 预留名额
 * @param {number} data.club_status - 社团状态 0-未开放 1-抢课中 2-名额已满 3-已结束
 * @param {boolean} data.has_major_limit - 是否限制专业
 * @returns {Promise}
 */
export const createClub = (data) => {
  return post("/admin/clubs", data);
};

/**
 * 更新社团信息
 * @param {string} clubName - 社团名称
 * @param {Object} data - 更新的社团数据
 * @returns {Promise}
 */
export const updateClub = (clubName, data) => {
  return put(`/admin/clubs/${clubName}`, data);
};

/**
 * 删除社团
 * @param {string} clubName - 社团名称
 * @returns {Promise}
 */
export const deleteClub = (clubName) => {
  return del(`/admin/clubs/${clubName}`);
};

/**
 * 更新社团状态
 * @param {string} clubName - 社团名称
 * @param {number} status - 新状态 0-未开放 1-抢课中 2-名额已满 3-已结束
 * @returns {Promise}
 */
export const updateClubStatus = (clubName, status) => {
  return patch(`/admin/clubs/${clubName}/status`, { club_status: status });
};

/**
 * 更新社团名额
 * @param {string} clubName - 社团名称
 * @param {Object} data - 名额数据
 * @param {number} data.total_quota - 总名额
 * @param {number} data.reserved_quota - 预留名额
 * @returns {Promise}
 */
export const updateClubQuota = (clubName, data) => {
  return patch(`/admin/clubs/${clubName}/quota`, data);
};

/**
 * 获取社团已选学生列表
 * @param {string} clubName - 社团名称
 * @returns {Promise}
 */
export const getClubStudents = (clubName) => {
  return get(`/admin/clubs/${clubName}/students`);
};

/**
 * ═══════════════════════════════════════════════════════════════
 * 学生管理 API
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * 获取所有学生
 * @returns {Promise}
 */
export const getStudents = async () => {
  return await get("/admin/students");
};

/**
 * 获取单个学生详情
 * @param {string} studentId - 学号
 * @returns {Promise}
 */
export const getStudentDetail = async (studentId) => {
  return await get(`/admin/students/${studentId}`);
};

/**
 * 创建学生
 * @param {Object} data - 学生数据
 * @param {string} data.student_id - 学号（必填）
 * @param {string} data.name - 姓名（必填）
 * @param {string} data.email - 邮箱
 * @param {string} data.phone - 电话
 * @param {string} data.class_name - 班级名称（必填）
 * @param {string} data.major_name - 专业名称（必填）
 * @param {string} data.department - 学院/系部（必填）
 * @param {string} data.password_hash - 密码哈希（可选，系统自动生成）
 * @param {number} data.account_status - 账号状态 1-正常 0-禁用
 * @returns {Promise}
 */
export const createStudent = (data) => {
  return post("/admin/students", data);
};

/**
 * 更新学生信息
 * @param {string} studentId - 学号
 * @param {Object} data - 更新的学生数据
 * @returns {Promise}
 */
export const updateStudent = (studentId, data) => {
  return put(`/admin/students/${studentId}`, data);
};

/**
 * 删除学生
 * @param {string} studentId - 学号
 * @returns {Promise}
 */
export const deleteStudent = (studentId) => {
  return del(`/admin/students/${studentId}`);
};

/**
 * 更新学生账号状态
 * @param {string} studentId - 学号
 * @param {number} status - 新状态 1-正常 0-禁用
 * @returns {Promise}
 */
export const updateStudentStatus = (studentId, status) => {
  return patch(`/admin/students/${studentId}/status`, {
    account_status: status,
  });
};

/**
 * 重置学生密码
 * @param {string} studentId - 学号
 * @returns {Promise}
 */
export const resetStudentPassword = (studentId) => {
  return post(`/admin/students/${studentId}/password/reset`, {});
};

/**
 * 将学生加入预留名单
 * @param {string} studentId - 学号
 * @param {string} clubName - 社团名称
 * @returns {Promise}
 */
export const reserveStudent = (studentId, clubName) => {
  return post(`/admin/students/${studentId}/reserve`, { club_name: clubName });
};

/**
 * 将学生从预留名单中移除
 * @param {string} studentId - 学号
 * @returns {Promise}
 */
export const unreserveStudent = (studentId) => {
  return del(`/admin/students/${studentId}/reserve`);
};

/**
 * 为学生强制分配社团
 * @param {string} studentId - 学号
 * @param {string} clubName - 社团名称
 * @returns {Promise}
 */
export const assignClubToStudent = (studentId, clubName) => {
  return post(`/admin/students/${studentId}/assign-club`, {
    club_name: clubName,
  });
};

/**
 * 将学生从社团中移除
 * @param {string} studentId - 学号
 * @returns {Promise}
 */
export const removeClubFromStudent = (studentId) => {
  return del(`/admin/students/${studentId}/club`);
};

/**
 * ═══════════════════════════════════════════════════════════════
 * 数据统计 API
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * 获取系统统计数据
 * @returns {Promise}
 */
export const getSystemStats = () => {
  return get("/admin/stats");
};

/**
 * 获取社团选课统计
 * @returns {Promise}
 */
export const getClubStats = () => {
  return get("/admin/stats/clubs");
};

/**
 * 获取学生选社统计
 * @returns {Promise}
 */
export const getStudentStats = () => {
  return get("/admin/stats/students");
};

/**
 * ═══════════════════════════════════════════════════════════════
 * 数据导入/导出 API
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * 导出社团数据为 Excel
 * @returns {Promise}
 */
export const exportClubsToExcel = () => {
  return get("/admin/export/clubs");
};

/**
 * 导出学生数据为 Excel
 * @returns {Promise}
 */
export const exportStudentsToExcel = () => {
  return get("/admin/export/students");
};

/**
 * 批量导入学生数据
 * @param {FormData} formData - 包含 file 的 FormData
 * @returns {Promise}
 */
export const importStudentsFromExcel = (formData) => {
  return post("/admin/import/students", formData);
};

/**
 * 批量导入社团数据
 * @param {FormData} formData - 包含 file 的 FormData
 * @returns {Promise}
 */
export const importClubsFromExcel = (formData) => {
  return post("/admin/import/clubs", formData);
};

/**
 * ═══════════════════════════════════════════════════════════════
 * 数据初始化 API
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * 初始化系统（清空所有数据，谨慎使用）
 * @returns {Promise}
 */
export const initializeSystem = () => {
  return post("/admin/initialize", {});
};

/**
 * 重置选社状态（将所有学生的选社状态设为未选）
 * @returns {Promise}
 */
export const resetAllSelections = () => {
  return post("/admin/reset-selections", {});
};

/**
 * ═══════════════════════════════════════════════════════════════
 * 导出对象（方便使用）
 * ═══════════════════════════════════════════════════════════════
 */

const adminApi = {
  // 社团管理
  getClubs,
  getClubDetail,
  createClub,
  updateClub,
  deleteClub,
  updateClubStatus,
  updateClubQuota,
  getClubStudents,

  // 学生管理
  getStudents,
  getStudentDetail,
  createStudent,
  updateStudent,
  deleteStudent,
  updateStudentStatus,
  resetStudentPassword,
  reserveStudent,
  unreserveStudent,
  assignClubToStudent,
  removeClubFromStudent,

  // 数据统计
  getSystemStats,
  getClubStats,
  getStudentStats,

  // 数据导入/导出
  exportClubsToExcel,
  exportStudentsToExcel,
  importStudentsFromExcel,
  importClubsFromExcel,

  // 数据初始化
  initializeSystem,
  resetAllSelections,
};

export default adminApi;
