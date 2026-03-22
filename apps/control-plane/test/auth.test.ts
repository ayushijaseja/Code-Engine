import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('Authentication & Lifecycle Flow', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
  };

  let authToken: string;

  it('1. Should register a new user successfully', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('2. Should not allow registering with an existing email', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(testUser);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('User already exists');
  });

  it('3. Should login the user and return a JWT', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send(testUser);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    
    authToken = res.body.token; 
  });

  it('4. Should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  it('5. Should delete the account and associated K8s resources', async () => {
    const res = await request(app)
      .delete('/auth/delete')
      .set('Authorization', `Bearer ${authToken}`); 

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted successfully');
  });

  it('6. Should reject login after account is deleted', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send(testUser);

    expect(res.status).toBe(401);
  });
});