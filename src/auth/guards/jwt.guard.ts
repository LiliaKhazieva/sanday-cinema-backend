import { AuthGuard } from '@nestjs/passport';

export class JwtAuthgGuard extends AuthGuard('jwt') {}
