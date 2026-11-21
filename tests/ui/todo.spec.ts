import { test, expect } from '@playwright/test';
import { TodoPage } from '../../pages/TodoPage';

test.describe('Todo list (UI)', () => {
  let todo: TodoPage;

  test.beforeEach(async ({ page }) => {
    todo = new TodoPage(page);
    await todo.goto();
  });

  test('adds items and shows the remaining count', async () => {
    await todo.add('buy milk', 'write tests');
    await todo.expectTitles(['buy milk', 'write tests']);
    await expect(todo.count).toContainText('2');
  });

  test('completing an item updates the count and filters', async () => {
    await todo.add('buy milk', 'write tests');
    await todo.toggle('buy milk');
    await expect(todo.count).toContainText('1');

    await todo.filter('Active');
    await todo.expectTitles(['write tests']);

    await todo.filter('Completed');
    await todo.expectTitles(['buy milk']);
  });

  test('clear completed removes only completed items', async () => {
    await todo.add('a', 'b', 'c');
    await todo.toggle('a');
    await todo.toggle('c');
    await todo.clearCompleted();
    await todo.expectTitles(['b']);
  });

  test('removes an item', async () => {
    await todo.add('one', 'two');
    await todo.remove('one');
    await todo.expectTitles(['two']);
  });

  test('empty input does not create an item', async () => {
    await todo.newTodo.press('Enter');
    await expect(todo.items).toHaveCount(0);
  });
});
