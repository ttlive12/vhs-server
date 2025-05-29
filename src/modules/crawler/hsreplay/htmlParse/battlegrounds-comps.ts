import * as cheerio from 'cheerio';
import type { IBattlegroundsComp, IBattlegroundsCompDetail } from '@/modules/shared/interfaces';

/**
 * 解析战棋流派数据
 * @param html HTML页面内容
 * @returns 解析后的战棋流派数据数组
 */
export function parseBattlegroundsComps(html: string): IBattlegroundsComp[] {
  const $ = cheerio.load(html);

  // 提取所有 <meta name="description"> 标签的 content 属性
  const descriptions: string[] = [];
  $('meta[name="description"]').each((_, el) => {
    const content = $(el).attr('content');
    if (content) {
      descriptions.push(content);
    }
  });

  // 删除第一项
  descriptions.shift();

  // 查找包含react_context数据的script标签
  const reactContextScript = $('script#react_context');

  if (reactContextScript.length === 0) {
    throw new Error('未找到react_context script标签');
  }

  const jsonText = reactContextScript.text().trim();

  if (!jsonText) {
    throw new Error('react_context script标签内容为空');
  }

  // 解析JSON数据
  const rawData = JSON.parse(jsonText) as IBattlegroundsComp[];

  if (!Array.isArray(rawData)) {
    throw new TypeError('react_context数据格式不正确，应该是数组');
  }

  return rawData.map((item, index) => ({
    ...item,
    comp_summary: descriptions[index],
  }));
}

/**
 * 解析具体战棋流派详细数据
 * @param html HTML页面内容
 * @returns 解析后的战棋流派详细数据
 */
export function parseBattlegroundsCompDetail(html: string): IBattlegroundsCompDetail {
  const $ = cheerio.load(html);

  // 查找包含react_context数据的script标签
  const reactContextScript = $('script#react_context');

  if (reactContextScript.length === 0) {
    throw new Error('未找到react_context script标签');
  }

  const jsonText = reactContextScript.text().trim();

  if (!jsonText) {
    throw new Error('react_context script标签内容为空');
  }

  // 解析JSON数据
  const rawData = JSON.parse(jsonText) as IBattlegroundsCompDetail;

  return rawData;
}
