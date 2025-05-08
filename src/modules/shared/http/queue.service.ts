import { Injectable, Logger } from '@nestjs/common';
import PQueue from 'p-queue';

/**
 * 请求队列服务
 * 负责管理HTTP请求队列，确保同一会话下的请求按顺序执行
 */
@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);
  /** 请求队列数组，每个队列对应一个会话 */
  private readonly requestQueues: PQueue[] = [];

  /**
   * 初始化请求队列
   * @param concurrency 并发队列数量
   */
  initQueues(concurrency: number): void {
    // 清空现有队列
    this.requestQueues.length = 0;

    // 创建新队列
    for (let i = 0; i < concurrency; i++) {
      this.requestQueues.push(new PQueue({ concurrency: 1 })); // 每个队列只允许一个请求同时进行
    }

    this.logger.log(`已初始化 ${concurrency} 个请求队列`);
  }

  /**
   * 将请求添加到队列中执行
   * @param requestFn 请求函数
   * @returns 请求结果和使用的队列索引
   */
  async enqueue<T>(requestFn: (queueIndex: number) => Promise<T>): Promise<T> {
    // 选择合适的队列
    const queueIndex = this.selectQueueIndex();

    // 确保队列索引有效
    const queue = this.requestQueues[queueIndex % this.requestQueues.length];

    const result = await queue.add(async () => {
      return await requestFn(queueIndex);
    });
    return result as T;
  }

  /**
   * 选择一个合适的队列索引
   * 策略：选择当前任务最少的队列
   * @returns 队列索引
   * @private 私有方法，只在服务内部使用
   */
  private selectQueueIndex(): number {
    // 声明变量
    let minQueueSize: number;
    let selectedIndex: number;

    // 初始化变量
    minQueueSize = Infinity;
    selectedIndex = 0;

    // 找出当前任务最少的队列
    this.requestQueues.forEach((queue, index) => {
      if (queue.size < minQueueSize) {
        minQueueSize = queue.size;
        selectedIndex = index;
      }
    });

    return selectedIndex;
  }

  /**
   * 获取队列数量
   */
  getQueueCount(): number {
    return this.requestQueues.length;
  }

  /**
   * 获取所有队列的剩余任务数量
   * @returns 包含每个队列剩余任务数的数组
   */
  getQueuesStatus(): Array<{ queueIndex: number; pending: number }> {
    return this.requestQueues.map((queue, index) => ({
      queueIndex: index,
      pending: queue.size,
    }));
  }

  /**
   * 获取所有队列的剩余任务总数
   * @returns 所有队列剩余任务总数
   */
  getTotalPendingTasks(): number {
    return this.requestQueues.reduce((total, queue) => total + queue.size, 0);
  }
}
