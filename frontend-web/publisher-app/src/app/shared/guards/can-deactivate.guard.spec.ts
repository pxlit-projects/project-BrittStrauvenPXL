import { CanDeactivateGuard } from './can-deactivate.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

describe('CanDeactivateGuard', () => {
  let mockRoute: ActivatedRouteSnapshot;
  let mockCurrentState: RouterStateSnapshot;
  let mockNextState: RouterStateSnapshot;

  beforeEach(() => {
    mockRoute = {} as ActivatedRouteSnapshot;
    mockCurrentState = {} as RouterStateSnapshot;
    mockNextState = {} as RouterStateSnapshot;
  });

  it('should return true if component has no canDeactivate method', () => {
    const mockComponent = {};
    const result = CanDeactivateGuard(mockComponent, mockRoute, mockCurrentState, mockNextState);
    expect(result).toBe(true);
  });

  it('should call canDeactivate() if component has it and return its value', () => {
    const mockComponent = { canDeactivate: jasmine.createSpy().and.returnValue(false) };
    const result = CanDeactivateGuard(mockComponent, mockRoute, mockCurrentState, mockNextState);
    expect(mockComponent.canDeactivate).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should handle canDeactivate() returning true', () => {
    const mockComponent = { canDeactivate: jasmine.createSpy().and.returnValue(true) };
    const result = CanDeactivateGuard(mockComponent, mockRoute, mockCurrentState, mockNextState);
    expect(result).toBe(true);
  });

  it('should handle canDeactivate() returning an observable<boolean>', (done) => {
    const mockComponent = { canDeactivate: jasmine.createSpy().and.returnValue(of(false)) };
    const result = CanDeactivateGuard(mockComponent, mockRoute, mockCurrentState, mockNextState);

    expect(mockComponent.canDeactivate).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Observable);

    (result as Observable<boolean>).subscribe((value) => {
      expect(value).toBe(false);
      done();
    });
  });

  it('should handle canDeactivate() returning an observable<boolean> resolving to true', (done) => {
    const mockComponent = { canDeactivate: jasmine.createSpy().and.returnValue(of(true)) };
    const result = CanDeactivateGuard(mockComponent, mockRoute, mockCurrentState, mockNextState);

    expect(mockComponent.canDeactivate).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Observable);

    (result as Observable<boolean>).subscribe((value) => {
      expect(value).toBe(true);
      done();
    });
  });
});
