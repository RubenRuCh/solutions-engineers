import httpStatus from 'http-status';
import request from 'supertest';
import app from '../app';

describe('HealthCheck', () => {
  afterAll(async () => {
    app?.close();
  });

  it('should return 200 if couriers api is running', async () => {
    await request(app)
      .get(`/`)
      .send()
      .expect(res => {
        expect(res.status).toEqual(httpStatus.OK);
        expect(res.body).toEqual({
          message: 'Welcome to Stuart Couriers API!'
        });
      });
  });
});
