import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export interface IApiPagination {
  defaultLimit?: number;
  maxSize?: number;
  offset?: number;
}

export const Pagination = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return data ? req.pagination && req.pagination[data] : req.pagination;
  },
);

export const ApiPagination =
  (options: IApiPagination = {}): any =>
  (target: any, propertyKey: any, descriptor: any) => {
    const { defaultLimit = 50, maxSize = 50, offset = 0 } = options;

    ApiQuery({
      name: 'limit',
      type: 'number',
      description: `(Default: ${defaultLimit} - Max: ${maxSize})`,
    })(target, propertyKey, descriptor);

    ApiQuery({
      name: 'offset',
      type: 'number',
      description: `(Default: ${offset})`,
    })(target, propertyKey, descriptor);
  };

// export const ApiPaginatedResponse = <TModel extends Type<any>>(
//   model: TModel,
// ) => {
//   return applyDecorators(
//     ApiOkResponse({
//       schema: {
//         allOf: [
//           { $ref: getSchemaPath() },
//           {
//             properties: {
//               items: {
//                 type: 'array',
//                 items: { type: 'object' },
//                 // items: { $ref: getSchemaPath(model) },
//               },
//             },
//           },
//         ],
//       },
//     }),
//   );
// };
