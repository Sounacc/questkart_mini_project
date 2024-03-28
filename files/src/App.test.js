 import { test, expect } from '@playwright/test';
import { DatabaseSetupSource1, DatabaseSetupSource2, DatabaseConfirmSourcesAndJoin,FileSetupSource1,FileSetupSource2,FileConfirmSourcesAndJoin, JSONConfirmSourcesAndJoin, XmlConfirmSourcesAndJoin } from '../tests/HelperFunctions';

// Test case for Source 1 setup
test('test case 1 - Database Source 1 Setup', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await DatabaseSetupSource1(page);
});

// Test case for Source 2 setup
test('test case 2 - Database Source 2 Setup', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await DatabaseSetupSource2(page);
});

test('test case 3 - Database Confirm Sources and join button component', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await DatabaseSetupSource1(page); // Ensure Source 1 setup completed
  await DatabaseSetupSource2(page); // Ensure Source 2 setup completed
  await DatabaseConfirmSourcesAndJoin(page);
});

// Test case for Proceed
test('test case 4 - database join', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await DatabaseSetupSource1(page); // Ensure Source 1 setup completed
  await DatabaseSetupSource2(page); // Ensure Source 2 setup completed
  await DatabaseConfirmSourcesAndJoin(page);
  
  // Proceed
  await page.getByRole('button', { name: 'Proceed' }).click();
});


test('test case 5 - File Source 1 Setup', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await FileSetupSource1(page);
});

test('test case 6 - File Source 2 Setup', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await FileSetupSource2(page);
});

test('test case 7 - File Confirm Sources and join button component', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await FileConfirmSourcesAndJoin(page);
});

test('test case 8 - File join', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await FileConfirmSourcesAndJoin(page);
  
  // Proceed
  await page.getByRole('button', { name: 'Proceed' }).click();
});

test('test case 9 - Json select columns and join button component', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await JSONConfirmSourcesAndJoin(page);
});

test('test case 10 - Json and file join', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await XmlConfirmSourcesAndJoin(page);
  
  // Proceed
  await page.getByRole('button', { name: 'Proceed' }).click();
});

test('test case 11 - xml select columns and join button component', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await XmlConfirmSourcesAndJoin(page);
});

test('test case 12 - Xml and File join', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await XmlConfirmSourcesAndJoin(page);
  
  // Proceed
  await page.getByRole('button', { name: 'Proceed' }).click();
});