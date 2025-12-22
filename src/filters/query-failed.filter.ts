import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class QueryFailedFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
