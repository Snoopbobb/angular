import {Promise, PromiseWrapper} from 'angular2/src/facade/async';
import {List, ListWrapper} from 'angular2/src/facade/collection';
import {Instruction} from './instruction';

/**
 * Responsible for performing each step of navigation.
 * "Steps" are conceptually similar to "middleware"
 */
export class Pipeline {
  steps: List<Function>;

  constructor() { this.steps = [instruction => instruction.router.activateOutlets(instruction)]; }

  process(instruction: Instruction): Promise<any> {
    var steps = this.steps, currentStep = 0;

    function processOne(result: any = true): Promise<any> {
      if (currentStep >= steps.length) {
        return PromiseWrapper.resolve(result);
      }
      var step = steps[currentStep];
      currentStep += 1;
      return PromiseWrapper.resolve(step(instruction)).then(processOne);
    }

    return processOne();
  }
}
