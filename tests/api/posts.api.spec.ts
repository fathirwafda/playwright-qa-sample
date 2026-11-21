import { test, expect } from '@playwright/test';

// JSONPlaceholder is a public fake REST API: writes are echoed back but not persisted.

const postShape = {
  userId: expect.any(Number),
  id: expect.any(Number),
  title: expect.any(String),
  body: expect.any(String),
};

test.describe('Posts API', () => {
  test('GET /posts/1 returns the post with the expected contract', async ({ request }) => {
    const res = await request.get('/posts/1');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');
    expect(await res.json()).toMatchObject({ ...postShape, id: 1 });
  });

  test('GET /posts returns a non-empty list where every item matches the contract', async ({ request }) => {
    const res = await request.get('/posts');
    expect(res.ok()).toBeTruthy();
    const posts = await res.json();
    expect(posts.length).toBeGreaterThan(0);
    for (const p of posts) expect(p).toMatchObject(postShape);
  });

  test('GET /posts?userId=1 filters by user', async ({ request }) => {
    const res = await request.get('/posts', { params: { userId: 1 } });
    const posts = await res.json();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((p: { userId: number }) => p.userId === 1)).toBe(true);
  });

  test('POST /posts creates a resource and echoes the payload', async ({ request }) => {
    const payload = { title: 'hello', body: 'world', userId: 1 };
    const res = await request.post('/posts', { data: payload });
    expect(res.status()).toBe(201);
    expect(await res.json()).toMatchObject({ ...payload, id: expect.any(Number) });
  });

  test('GET unknown id returns 404', async ({ request }) => {
    const res = await request.get('/posts/999999');
    expect(res.status()).toBe(404);
  });
});
