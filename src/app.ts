import fastify from 'fastify';
import { ZodError } from 'zod';
import { appRoutes } from './application/controllers/routes';

export const app = fastify({
  logger: true,
});

app.register(appRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    });
  }

  return reply.status(500).send({ message: 'Internal server error.' });
});
