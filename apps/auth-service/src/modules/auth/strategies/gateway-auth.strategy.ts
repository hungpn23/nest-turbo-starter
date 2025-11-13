import { ERROR_RESPONSE, ServerException } from '@app/common';
import { TokenPayload } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Strategy } from 'passport-custom';

@Injectable()
export class GatewayAuthStrategy extends PassportStrategy(Strategy, 'gateway-auth') {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
    super();
  }

  async validate(req: Request) {
    const { headers } = req;
    const authUserHeader = headers['x-auth-user'];
    if (!authUserHeader) throw new ServerException(ERROR_RESPONSE.UNAUTHORIZED);

    const authUser: TokenPayload = JSON.parse(authUserHeader);

    return authUser;
  }
}
