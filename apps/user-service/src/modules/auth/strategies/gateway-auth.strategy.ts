import { ERROR_RESPONSE, ServerException, UserMessagePattern } from '@app/common';
import { TokenPayload } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Strategy } from 'passport-custom';
import { lastValueFrom } from 'rxjs';
import { UserRepository } from 'src/data-access/user';

@Injectable()
export class GatewayAuthStrategy extends PassportStrategy(Strategy, 'gateway-auth') {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly userRepo: UserRepository,
  ) {
    super();
  }

  async validate(req: Request) {
    const { headers } = req;
    const authUserHeader = headers['x-auth-user'];
    if (!authUserHeader) throw new ServerException(ERROR_RESPONSE.UNAUTHORIZED);

    const authUser: TokenPayload = JSON.parse(authUserHeader);
    if (!authUser?.id) throw new ServerException(ERROR_RESPONSE.UNAUTHORIZED);

    const user = await this.userRepo.findOne({ id: authUser.id });
    if(!user) throw new ServerException(ERROR_RESPONSE.UNAUTHORIZED);
    if (!user.isActive) throw new ServerException(ERROR_RESPONSE.USER_DEACTIVATED);

    return authUser;
  }
}
