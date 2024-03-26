import { test, expect } from '@playwright/test';
import { setupSource1, setupSource2, confirmSourcesAndJoin } from '../tests/HelperFunctions';

// Test case for Source 1 setup
test('test case 1 - Source 1 Setup', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await setupSource1(page);
});

// Test case for Source 2 setup
test('test case 1 - Source 2 Setup', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await setupSource1(page); // Ensure Source 1 setup completed
  await setupSource2(page);
});

test('test case 1 - Confirm Sources and Join', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await setupSource1(page); // Ensure Source 1 setup completed
  await setupSource2(page); // Ensure Source 2 setup completed
  await confirmSourcesAndJoin(page);
});

// Test case for Proceed
test('test case 1 - Proceed', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await setupSource1(page); // Ensure Source 1 setup completed
  await setupSource2(page); // Ensure Source 2 setup completed
  await confirmSourcesAndJoin(page);
  
  // Proceed
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Proceed' }).click();
});


// test('test case 2', async ({ page }) => {
//   await page.goto('http://localhost:3000/');
//   await page.getByRole('button', { name: 'Source 1' }).click();
//   await page.getByRole('menuitem', { name: 'File' }).click();
//   await page.getByRole('button', { name: 'Source 1' }).setInputFiles('questkart_mini_project/Transformations_Backend-main/data/employees.csv');
//   await page.getByRole('button', { name: 'Source 2' }).click();
//   await page.getByRole('menuitem', { name: 'File' }).click();
//   await page.getByRole('button', { name: 'Source 2' }).setInputFiles('questkart_mini_project/Transformations_Backend-main/data/projects.csv');
//   await page.getByRole('button', { name: 'Confirm Sources' }).click();
//   await page.locator('[id="demo-multiple-chip-Source\\ 2"]').click();
//   await page.getByRole('option', { name: 'department_id (Number)' }).click();
//   await page.getByRole('option', { name: 'department_id (Number)' }).press('Escape');
//   await page.locator('[id="demo-multiple-chip-Source\\ 1"]').click();
//   await page.getByRole('option', { name: 'department_id (Number)' }).click();
//   await page.getByRole('option', { name: 'department_id (Number)' }).press('Escape');
//   await page.getByLabel('').click();
//   await page.getByRole('option', { name: 'Inner Join' }).click();
//   page.once('dialog', dialog => {
//     console.log(`Dialog message: ${dialog.message()}`);
//     dialog.dismiss().catch(() => {});
//   });
//   await page.getByRole('button', { name: 'Proceed' }).click();
// });
