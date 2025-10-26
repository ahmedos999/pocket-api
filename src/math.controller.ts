import { Controller, Get, Param } from '@nestjs/common';
import { MathService } from './math.service';

@Controller('math')
export class MathController {
  constructor(private readonly mathService: MathService) {}

  @Get('sum/:a/:b')
  sum(@Param('a') a:string,@Param('b') b:string): number {
    return this.mathService.add(+a,+b);
  }
  @Get('sub/:a/:b')
  sub(@Param('a') a:string,@Param('b') b:string): number {
    return this.mathService.sub(+a,+b);
  }
}
