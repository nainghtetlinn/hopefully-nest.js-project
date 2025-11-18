import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { z, ZodType } from 'zod';

@Injectable()
export class ZodValidationWsPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);
    if (result.success) return result.data;
    if (metadata.type === 'body') {
      throw new WsException({
        message: 'Validation failed',
        errors: z.flattenError(result.error).fieldErrors,
      });
    }
    return value;
  }
}
