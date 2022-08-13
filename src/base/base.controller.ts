import { Controller } from '@nestjs/common';
import {
  BaseServiceController,
  BaseServiceControllerMethods,
  PingRequest,
  PingResponse,
} from 'idl/base/base_service';

@Controller('base')
@BaseServiceControllerMethods()
export class BaseController implements BaseServiceController {
  async ping(request: PingRequest): Promise<PingResponse> {
    return {
      value: `Hello ${request.name}`,
    };
  }
}
