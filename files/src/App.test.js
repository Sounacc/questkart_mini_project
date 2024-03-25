// src/tests/App.test.js

import { test, expect } from '@playwright/test';


test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Source 1' }).click();
  await page.getByRole('menuitem', { name: 'Database' }).click();
  await page.getByRole('button', { name: 'PostgreSQL' }).click();
  await page.getByLabel('User *').click();
  await page.getByLabel('User *').fill('postgres');
  await page.getByLabel('Host *').click();
  await page.getByLabel('Host *').fill('localhost');
  await page.getByLabel('Host *').press('Tab');
  await page.getByLabel('Database *').fill('Datawarehouse');
  await page.getByLabel('Database *').press('Tab');
  await page.getByLabel('Password *').fill('12345678');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByLabel('Schema').click();
  await page.getByRole('option', { name: 'staging' }).click();
  await page.getByLabel('Table').click();
  await page.getByRole('option', { name: 'customer' }).click();
  await page.locator('div').filter({ hasText: 'SchemastagingSchemaTablecustomerTable' }).nth(1).press('Escape');
  await page.getByRole('button', { name: 'Source 2' }).click();
  await page.getByRole('menuitem', { name: 'Database' }).click();
  await page.getByRole('button', { name: 'PostgreSQL' }).click();
  await page.getByLabel('User *').click();
  await page.getByLabel('User *').fill('postgres');
  await page.getByLabel('Host *').click();
  await page.getByLabel('Host *').fill('localhost');
  await page.getByLabel('Host *').press('Tab');
  await page.getByLabel('Database *').fill('Datawarehouse');
  await page.getByLabel('Database *').press('Tab');
  await page.getByLabel('Password *').fill('12345678');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByLabel('Schema').click();
  await page.getByRole('option', { name: 'staging' }).click();
  await page.getByLabel('Table').click();
  await page.getByRole('option', { name: 'customer' }).click();
  await page.getByLabel('customer').press('Escape');
  await page.getByRole('button', { name: 'Confirm Sources' }).click();
  await page.locator('[id="demo-multiple-chip-Source\\ 1"]').click();
  await page.getByRole('option', { name: 'first_name (character varying)' }).click();
  await page.getByRole('option', { name: 'first_name (character varying)' }).press('Escape');
  await page.locator('[id="demo-multiple-chip-Source\\ 2"]').click();
  await page.getByRole('option', { name: 'first_name (character varying)' }).click();
  await page.getByRole('option', { name: 'first_name (character varying)' }).press('Escape');
  await page.getByLabel('').click();
  await page.getByRole('option', { name: 'Equijoin' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Proceed' }).click();
});
