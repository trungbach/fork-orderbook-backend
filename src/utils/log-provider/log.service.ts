import { ConsoleLogger } from '@nestjs/common';
import { logErrorConsole, logInfoConsole } from './';

export class LogService extends ConsoleLogger {
  error(message: any, ...optionalParams: [...any, string?, string?]) {
    logErrorConsole(message, ...optionalParams);
    super.error(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: [...any, string?]) {
    logInfoConsole(message, ...optionalParams);
    super.debug(message, ...optionalParams);
  }
}
