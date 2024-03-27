import { test, expect } from '@playwright/test';
import { DatabaseSetupSource1, DatabaseSetupSource2, DatabaseConfirmSourcesAndJoin,FileSetupSource1,FileSetupSource2,FileConfirmSourcesAndJoin } from '../tests/HelperFunctions';

// Test case for Source 1 setup
test('test case - Database Source 1 Setup', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await DatabaseSetupSource1(page);
});

// Test case for Source 2 setup
test('test case - Database Source 2 Setup', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await DatabaseSetupSource2(page);
});

test('test case - Database Confirm Sources and join button component', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await DatabaseSetupSource1(page); // Ensure Source 1 setup completed
  await DatabaseSetupSource2(page); // Ensure Source 2 setup completed
  await DatabaseConfirmSourcesAndJoin(page);
});

// Test case for Proceed
test('test case - database join', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await DatabaseSetupSource1(page); // Ensure Source 1 setup completed
  await DatabaseSetupSource2(page); // Ensure Source 2 setup completed
  await DatabaseConfirmSourcesAndJoin(page);
  
  // Proceed
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Proceed' }).click();
});


test('test case - File Source 1 Setup', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await FileSetupSource1(page);
});

test('test case - File Source 2 Setup', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await FileSetupSource2(page);
});

test('test case - File Confirm Sources and join button component', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await FileConfirmSourcesAndJoin(page);
});

// test('test case - File join', async ({ page }) => {
//   await page.goto('http://localhost:3000/');
//   await FileConfirmSourcesAndJoin(page);
  
//   // Proceed
//   page.once('dialog', dialog => {
//     console.log(`Dialog message: ${dialog.message()}`);
//     dialog.dismiss().catch(() => {});
//   });
//   await page.getByRole('button', { name: 'Proceed' }).click();
// });
