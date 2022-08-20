import { Metadata } from '@grpc/grpc-js';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FIREBASE_ID_TOKEN_HEADER, FIREBASE_UID_HEADER } from './common/auth';
import { FirebaseService } from './firebase/firebase.service';

@Injectable()
export class FirebaseAuthInterceptor implements NestInterceptor {
  constructor(private readonly firebaseService: FirebaseService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const [_, md]: [any, Metadata] = context.getArgs();
    const idToken = md.get(FIREBASE_ID_TOKEN_HEADER);
    if (idToken.length) {
      const auth = await this.firebaseService.getAuth();
      const verify = await auth.verifyIdToken(idToken[0].toString());
      md.set(FIREBASE_UID_HEADER, verify.uid);
    }

    return next.handle();
  }
}
