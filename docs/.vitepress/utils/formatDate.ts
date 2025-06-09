import { Post } from "./types.js";

/**
 * 格式化文章更新时间
 * @param raw - 日期字符串
 */
export function formatDate(raw: string | undefined): Post["date"] {
  if (!raw)
    return {
      time: 0,
      string: "",
    };
  const date = new Date(raw);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return {
    time: +date,
    string: `${year}-${month}-${day} ${hour}:${minute}`,
  };
}