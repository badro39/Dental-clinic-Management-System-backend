import request from 'supertest';
import app from '../../app.js';
describe('Treatment Endpoints', () => {
  it('Get Treatments', async () => {
    const payload = {
      patientId: '67f1c43af82b504afc0bdab1',
      dentistId: '67f1c48d6a203d62e0ad7786',
    };
    const res = await request(app)
      .get('/api/protected/Treatment')
      .send(payload);
    expect(res.statusCode).toEqual(200);
  });

  it('Add Treatment', async () => {
    const payload = {
      name: 'test treatment 2',
      description: 'test description 2',
      startDate: '2025-05-16',
      endDate: '2025-06-16',
      patientId: '67f1c43af82b504afc0bdab1',
    };
    const res = await request(app)
      .post('/api/protected/Treatment')
      .send(payload);
    expect(res.statusCode).toEqual(201);
  });
});
