// Helper function to setup Source 1
export async function setupSource1(page) {
    await page.getByRole('button', { name: 'Source 1' }).click();
    await page.getByRole('menuitem', { name: 'Database' }).click();
    await page.getByRole('button', { name: 'PostgreSQL' }).click();
    await page.getByLabel('User *').click();
    await page.getByLabel('User *').fill('postgres');
    await page.getByLabel('User *').press('Tab');
    await page.getByLabel('Host *').fill('localhost');
    await page.getByLabel('Host *').press('Tab');
    await page.getByLabel('Database *').fill('Datawarehouse');
    await page.getByLabel('Database *').press('Tab');
    await page.getByLabel('Password *').fill('12345678');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByLabel('Schema').click();
    await page.getByRole('option', { name: 'public' }).click();
    await page.getByLabel('Table').click();
    await page.getByRole('option', { name: 'employee' }).click();
    await page.getByLabel('employee').press('Escape');
  }
  
  // Helper function to setup Source 2
 export async function setupSource2(page) {
    await page.getByRole('button', { name: 'Source 2' }).click();
    await page.getByRole('menuitem', { name: 'Database' }).click();
    await page.getByRole('button', { name: 'PostgreSQL' }).click();
    await page.getByLabel('User *').click();
    await page.getByLabel('User *').fill('postgres');
    await page.getByLabel('User *').press('Tab');
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
  }
  
  
  // helper function for Confirm Sources and Join
 export async function confirmSourcesAndJoin(page) {
    await page.getByRole('button', { name: 'Confirm Sources' }).click();
    await page.locator('[id="demo-multiple-chip-Source\\ 1"]').click();
    await page.getByRole('option', { name: 'employee_id (integer)' }).click();
    await page.getByRole('option', { name: 'employee_id (integer)' }).press('Escape');
    await page.locator('[id="demo-multiple-chip-Source\\ 2"]').click();
    await page.getByRole('option', { name: 'customer_id (integer)' }).click();
    await page.getByRole('option', { name: 'customer_id (integer)' }).press('Escape');
    await page.getByLabel('').click();
    await page.getByRole('option', { name: 'Inner Join' }).click();
  }
  