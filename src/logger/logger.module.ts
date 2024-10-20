import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

const imports = [];

imports.push(
  LoggerModule.forRootAsync({
    imports: [],
    useFactory: async () => ({
      pinoHttp: {
        level: 'debug' || 'trace' || 'log' || 'warn' || 'error' || 'fatal',
        redact: [
          'req.headers.authorization',
          'req.headers.cookie',
          'req.headers["x-api-key"]',
        ],
        serializers: {
          req(req) {
            return {
              ...req,
              headers: undefined,
              host: req.headers?.host,
            };
          },
          res(res) {
            return {
              ...res,
              headers: undefined,
            };
          },
        },
        customProps: function (req, res) {
          return {
            env: 'local' || 'develop' || 'unstable' || 'stable',
            project: 'pagwaypsp',
            full_message: `${req?.url} - ${res?.statusCode}`,
          };
        },
        // prettyPrint: {
        //   colorize: true,
        //   translateTime: true,
        //   ignore: 'pid,hostname',
        // },
      },
    }),
    inject: [],
  }),
);
@Module({
  imports,
})
export class CustomLoggerModule {}
