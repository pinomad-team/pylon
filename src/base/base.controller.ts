import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import {
  BaseServiceController,
  BaseServiceControllerMethods,
  PingRequest,
  PingResponse,
} from '@proto/idl/base/base_service';
import * as xid from 'xid';

@Controller('base')
@BaseServiceControllerMethods()
export class BaseController implements BaseServiceController {
  async ping(request: PingRequest, metadata: Metadata): Promise<PingResponse> {
    return {
      value: `Hello ${request.name}`,
      xid: xid.generateId(),
    };
  }
}
