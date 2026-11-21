import { expect, type Locator, type Page } from '@playwright/test';

/** Page object for the TodoMVC demo app. Keeps selectors out of the tests. */
export class TodoPage {
  readonly newTodo: Locator;
  readonly items: Locator;
  readonly count: Locator;

  constructor(private readonly page: Page) {
    this.newTodo = page.getByPlaceholder('What needs to be done?');
    this.items = page.getByTestId('todo-item');
    this.count = page.getByTestId('todo-count');
  }

  async goto() {
    // Relative to baseURL (".../todomvc/"). A leading "/" would drop the sub-path.
    await this.page.goto('./');
  }

  async add(...titles: string[]) {
    for (const title of titles) {
      await this.newTodo.fill(title);
      await this.newTodo.press('Enter');
    }
  }

  async toggle(title: string) {
    await this.items.filter({ hasText: title }).getByRole('checkbox').check();
  }

  async remove(title: string) {
    const item = this.items.filter({ hasText: title });
    await item.hover();
    await item.getByRole('button', { name: 'Delete' }).click();
  }

  async filter(name: 'All' | 'Active' | 'Completed') {
    await this.page.getByRole('link', { name }).click();
  }

  async clearCompleted() {
    await this.page.getByRole('button', { name: 'Clear completed' }).click();
  }

  async expectTitles(titles: string[]) {
    await expect(this.items).toHaveText(titles);
  }
}
