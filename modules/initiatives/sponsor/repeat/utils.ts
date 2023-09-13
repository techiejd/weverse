export enum Step {
  chooseSponsorship = 0,
  confirm = 1,
  success = 2,
}

export namespace Step {
  export function next(step: Step) {
    return step + 1;
  }
  export function previous(step: Step) {
    return step - 1;
  }
  export function toString(step: Step) {
    return Step[step];
  }
  export function toStep(step: string): Step {
    return (Step as any)[step];
  }
}