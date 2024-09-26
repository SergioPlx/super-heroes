import { IModelViewManager } from '../../interfaces/view-manager/view-manager';
import { ModelViewManager } from './view-manager';

describe('AppViewManager', () => {
  let row_ViewManager: ModelViewManager;

  beforeEach(() => {
    row_ViewManager = new ModelViewManager({loaded: false});
  })

  it('should create an instance', () => {
    expect(row_ViewManager).toBeTruthy();
  });

  it('it should set new value true to property, setLoaded(true)', () => {    
    row_ViewManager.setLoaded(true);
    expect(row_ViewManager.isLoaded).toBeTrue();
  });

  it('should set new value false to property, setLoaded(false)', () => {
    row_ViewManager.setLoaded(false);
    expect(row_ViewManager.isLoaded).toBeFalse();
  });
});
