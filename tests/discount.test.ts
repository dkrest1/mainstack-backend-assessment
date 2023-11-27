import request from "supertest";
import * as app from "@/app";

describe('GET /api/endpoint', () => {
  it('responds with status 200', (done) => {
    request(app)
      .get('/api/endpoint')
      .expect(200, done);
  });

  it('responds with JSON', (done) => {
    request(app)
      .get('/api/endpoint')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});