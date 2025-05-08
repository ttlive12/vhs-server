/**
 * 批量操作 URL 参数（添加、更新、删除）
 *
 * @param url - 原始 URL 路径与查询字符串（如 "/meta?format=213"）
 * @param operations - 操作对象，键为参数名，值为参数值或 null（表示删除）
 * @returns 修改后的完整 URL 字符串
 */
export function modifyParams(url: string, operations: Record<string, string | null | undefined>): string {
  const [pathPart, searchPart] = url.split('?');
  const params = new URLSearchParams(searchPart || '');

  for (const [key, value] of Object.entries(operations)) {
    if (value === null || value === undefined || value === '') {
      // 删除参数
      params.delete(key);
    } else {
      // 添加或更新参数
      params.set(key, value);
    }
  }

  return pathPart + (params.toString() ? `?${params.toString()}` : '');
}
