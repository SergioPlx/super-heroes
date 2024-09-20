import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { MessageService } from 'primeng/api';

describe('NotificationService', () => {
  let service: NotificationService;
  let message: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessageService
      ]
    });
    service = TestBed.inject(NotificationService);
    message = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add success message, success()', () => {
    spyOn(message, 'add');
    service.success('Test success');
    expect(message.add).toHaveBeenCalled();
  });

  it('should add info message, info()', () => {
    spyOn(message, 'add');
    service.info('Test info');
    expect(message.add).toHaveBeenCalled();
  });

  it('should add info message, warning()', () => {
    spyOn(message, 'add');
    service.warning('Test warning');
    expect(message.add).toHaveBeenCalled();
  });

  it('should add error message, error()', () => {
    spyOn(message, 'add');
    service.error('Test error');
    expect(message.add).toHaveBeenCalled();
  });
});
