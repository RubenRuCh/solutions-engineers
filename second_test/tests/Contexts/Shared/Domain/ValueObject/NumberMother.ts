import { MotherCreator } from './MotherCreator';

export class NumberMother {
  static random({ min, max }: { min?: number; max?: number }): number {
    return MotherCreator.random().datatype.number({ min, max });
  }
}
