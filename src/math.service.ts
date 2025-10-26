import { Injectable } from '@nestjs/common';

@Injectable()
export class MathService {
  add(numberOne:number,numberTwo:number): number {
    return numberOne+numberTwo;
  }
  sub(numberOne:number,numberTwo:number): number {
    return numberOne-numberTwo;
  }
}
