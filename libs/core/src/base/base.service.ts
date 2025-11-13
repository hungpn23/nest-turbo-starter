import { HttpException, HttpStatus } from '@nestjs/common';
import { catchError, lastValueFrom, Observable, timeout } from 'rxjs';

export class BaseService {
  protected async msResponse(res: Observable<any>, timeoutMs?: number): Promise<any> {
    const callTimeout = timeoutMs || +process.env.CALL_SERVICE_TIMEOUT;
    const pipe = res.pipe(
      timeout(callTimeout),
      catchError((err) => {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: err.message,
            errorService: err.errorService,
            stack: err?.stack,
            trace: err?.trace,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
    return await lastValueFrom(pipe);
  }
}
