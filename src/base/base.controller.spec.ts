import { Test, TestingModule } from '@nestjs/testing';
import { BaseController } from './base.controller';

describe('BaseController', () => {
  let controller: BaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BaseController],
    }).compile();

    controller = module.get<BaseController>(BaseController);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
    const { value } = await controller.ping({
      name: 'John',
    });
    expect(value).toEqual('Hello John');
  });
});
