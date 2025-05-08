import { InjectModel } from '@nestjs/mongoose';

// 用于 'crawler' 连接的模型注入
export function InjectCrawlerModel(model: string): PropertyDecorator & ParameterDecorator {
  return InjectModel(model, 'crawler');
}

// 用于 'api' 连接的模型注入
export function InjectApiModel(model: string): PropertyDecorator & ParameterDecorator {
  return InjectModel(model, 'api');
}
