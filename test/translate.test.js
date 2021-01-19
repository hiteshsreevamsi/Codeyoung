/* eslint-disable no-undef */
const expect = require('chai').expect;
const supertest = require('supertest');
const server = require('../server');

describe('POST Text with Source and Target Language', () => {
  it('Every data is correctly given', async () => {
    const resp = await supertest(server).post('/translate').send({
      source_language: 'en',
      target_language: 'te',
      source_text: 'Who is that',
    });

    expect(resp.status).equals(200);
    expect(resp.body).to.deep.equals({
      Source_Lang: 'en',
      Target_Lang: 'te',
      Source_Text: 'Who is that',
      Target_Text: 'ఆ ఎవరు',
    });
  });
  it('When source language is invalid and target language is valid', async () => {
    const resp = await supertest(server).post('/translate').send({
      source_language: 'abcds',
      target_language: 'te',
      source_text: 'Who is that',
    });

    expect(resp.status).equals(200);
    expect(resp.body).to.deep.equals({
      Source_Lang: 'abcds',
      Target_Lang: 'te',
      Source_Text: 'Who is that',
      Target_Text: 'అది ఎవరు',
    });
  });
  it('When source_language is empty', async () => {
    const resp = await supertest(server).post('/translate').send({
      source_language: '',
      target_language: 'te',
      source_text: 'Who is that',
    });
    expect(resp.status).equals(400);
    expect(resp.body).haveOwnProperty('errors');
    expect(resp.body.errors[0].msg).equals('Source Language is required');
  });
  it('When source_language is not sent in request body', async () => {
    const resp = await supertest(server).post('/translate').send({
      target_language: 'te',
      source_text: 'Who is that',
    });

    expect(resp.status).equals(400);
    expect(resp.body).haveOwnProperty('errors');
    expect(resp.body.errors[0].msg).equals('Source Language is required');
  });
  it('When target_language is given incorrectly', async () => {
    const resp = await supertest(server).post('/translate').send({
      source_language: 'en',
      target_language: 'telugu',
      source_text: 'Who is that',
    });
    expect(resp.status).equals(500);
    expect(resp.body).to.deep.equals({});
  });
});
