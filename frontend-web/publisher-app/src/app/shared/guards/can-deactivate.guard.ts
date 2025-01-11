import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export const CanDeactivateGuard: CanDeactivateFn<any> = (component): boolean | Observable<boolean> => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
