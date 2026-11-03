const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const createApp = require('../server');

let server;
let baseUrl;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test('CampusEats Catalogue', async (t) => {
  await t.test('GET / serves the catalogue page', async () => {
    const response = await fetch(`${baseUrl}/`);
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.match(html, /CampusEats Catalogue/);
  });

  await t.test('GET /style.css serves the stylesheet', async () => {
    const response = await fetch(`${baseUrl}/style.css`);
    const css = await response.text();

    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/css/);
    assert.match(css, /\.dish/);
  });

  await t.test('GET /items returns the starting menu', async () => {
    const response = await fetch(`${baseUrl}/items`);
    const items = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(items, [
      { id: 1, name: 'Veg Thali', price: 90 },
      { id: 2, name: 'Paneer Roll', price: 70 },
    ]);
  });

  await t.test('GET /items/1 returns one dish', async () => {
    const response = await fetch(`${baseUrl}/items/1`);
    const item = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(item, { id: 1, name: 'Veg Thali', price: 90 });
  });

  await t.test('GET /items/99 returns 404 for a missing dish', async () => {
    const response = await fetch(`${baseUrl}/items/99`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.deepEqual(body, { error: 'not found' });
  });

  await t.test('POST /items rejects a missing dish name', async () => {
    const response = await fetch(`${baseUrl}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: 60 }),
    });
    const body = await response.json();

    assert.equal(response.status, 422);
    assert.deepEqual(body, { error: 'name required' });
  });

  await t.test('POST /items rejects malformed JSON', async () => {
    const response = await fetch(`${baseUrl}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"name":',
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.deepEqual(body, { error: 'invalid JSON body' });
  });

  await t.test('POST /items creates a dish with status 201', async () => {
    const response = await fetch(`${baseUrl}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Masala Dosa', price: 60 }),
    });
    const item = await response.json();

    assert.equal(response.status, 201);
    assert.deepEqual(item, { id: 3, name: 'Masala Dosa', price: 60 });
  });

  await t.test('the new dish is visible in GET /items', async () => {
    const response = await fetch(`${baseUrl}/items`);
    const items = await response.json();

    assert.equal(response.status, 200);
    assert.equal(items.length, 3);
    assert.deepEqual(items[2], { id: 3, name: 'Masala Dosa', price: 60 });
  });
});
