import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const targetUserId = request.params.id; // from route like /users/:id

    if (user.role === 'admin') return true;

    if (user.id === targetUserId) return true;

    throw new ForbiddenException('You can only modify your own account.');
  }
}
