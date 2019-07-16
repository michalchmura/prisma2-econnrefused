import { nexusPrismaPlugin } from '@generated/nexus-prisma';
import Photon from '@generated/photon';
import { makeSchema } from '@prisma/nexus';
import { GraphQLServer } from 'graphql-yoga';
import express, { Request, Response, RequestHandler } from 'express';
import uuid from 'uuid/v4';
import { join } from 'path';
import { permissions } from './permissions';
import * as allTypes from './resolvers';
import { Context } from './types';

const photon = new Photon({
  debug: true,
  __internal: {
    engine: {
      cwd: join(__dirname, '../prisma/'),
      binaryPath: join(__dirname, '../prisma-glibc'),
    },
  },
});

const nexusPrisma = nexusPrismaPlugin({
  photon: (ctx: Context) => ctx.photon,
});

const schema = makeSchema({
  types: [allTypes, nexusPrisma],
  outputs: {
    typegen: join(__dirname, '../generated/nexus-typegen.ts'),
    schema: join(__dirname, '/schema.graphql'),
  },
  typegenAutoConfig: {
    sources: [
      {
        source: '@generated/photon',
        alias: 'photon',
      },
      {
        source: join(__dirname, 'types.ts'),
        alias: 'ctx',
      },
    ],
    contextType: 'ctx.Context',
  },
});

const healthCheckServer = () => {
  const server = express();

  server.get('/ping', (_: Request, res: Response) => res.send('pong'));

  server.listen(8081, () =>
    console.log('Health Checks are running on port 8081')
  );
};

const server = new GraphQLServer({
  schema,
  // middlewares: [permissions], // TODO: Fix after https://github.com/maticzav/graphql-shield/issues/361
  context: request => {
    return {
      ...request,
      photon,
    };
  },
});

server.express.set('trust proxy', true);

server.start({ port: 8080 }, () =>
  console.log(`🚀 Server ready at http://localhost:8080`)
);

healthCheckServer();
