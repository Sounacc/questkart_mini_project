// Helper function to setup Source 1
export async function DatabaseSetupSource1(page) {
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
 export async function DatabaseSetupSource2(page) {
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
 export async function DatabaseConfirmSourcesAndJoin(page) {
    await page.locator('[id="demo-multiple-chip-Source\\ 1"]').click();
    await page.getByRole('option', { name: 'employee_id (integer)' }).click();
    await page.getByRole('option', { name: 'employee_id (integer)' }).press('Escape');
    await page.locator('[id="demo-multiple-chip-Source\\ 2"]').click();
    await page.getByRole('option', { name: 'customer_id (integer)' }).click();
    await page.getByRole('option', { name: 'customer_id (integer)' }).press('Escape');
    await page.getByLabel('').click();
    await page.getByRole('option', { name: 'Inner Join' }).click();
    await page.getByRole('button', { name: 'Set Destination' }).click();
    await page.getByLabel('Destination Type').click();
    await page.getByRole('option', { name: 'File Storage' }).click();
    await page.getByRole('button', { name: 'CSV Storage' }).click();
  }
  
  export async function FileSetupSource1(page){
    await page.getByRole('button', { name: 'Source 1' }).click();
    await page.getByRole('menuitem', { name: 'File' }).click();
    await page.locator('div').filter({ hasText: /^Source 1No selection$/ }).getByRole('textbox').setInputFiles('employees.csv');
  }
  
  export async function FileSetupSource2(page){
  await page.getByRole('button', { name: 'Source 2' }).click();
  await page.getByRole('menuitem', { name: 'File' }).click();
  await page.locator('div').filter({ hasText: /^Source 2No selection$/ }).getByRole('textbox').setInputFiles('D:/project/questkart_task/questkart_mini_project/Transformations_Backend-main/data/projects.csv');
  }


  export async function FileConfirmSourcesAndJoin(page){
    await page.locator('div').filter({ hasText: /^Source 1No selection$/ }).getByRole('textbox').setInputFiles('D:/project/questkart_task/questkart_mini_project/Transformations_Backend-main/data/employees.csv');
    await page.locator('div').filter({ hasText: /^Source 2No selection$/ }).getByRole('textbox').setInputFiles('D:/project/questkart_task/questkart_mini_project/Transformations_Backend-main/data/projects.csv');
    await page.locator('[id="demo-multiple-chip-Source\\ 1"]').click();
    await page.getByRole('option', { name: 'department_id (Number)' }).click();
    await page.getByRole('option', { name: 'department_id (Number)' }).press('Escape');
    await page.locator('[id="demo-multiple-chip-Source\\ 2"]').click();
    await page.getByRole('option', { name: 'department_id (Number)' }).click();
    await page.getByRole('option', { name: 'department_id (Number)' }).press('Escape');
    await page.getByLabel('').click();
    await page.getByRole('option', { name: 'Inner Join' }).click();
    await page.getByRole('button', { name: 'Set Destination' }).click();
    await page.getByLabel('Destination Type').click();
    await page.getByRole('option', { name: 'File Storage' }).click();
    await page.getByRole('button', { name: 'CSV Storage' }).click();
    

  }

  export async function JSONConfirmSourcesAndJoin(page){
    await page.locator('div').filter({ hasText: /^Source 1No selection$/ }).getByRole('textbox').setInputFiles('D:/project/questkart_task/questkart_mini_project/Transformations_Backend-main/data/employees.json');
    await page.locator('div').filter({ hasText: /^Source 2No selection$/ }).getByRole('textbox').setInputFiles('D:/project/questkart_task/questkart_mini_project/Transformations_Backend-main/data/projects.csv');
    await page.locator('[id="demo-multiple-chip-Source\\ 1"]').click();
    await page.getByRole('option', { name: 'department_id (Number)' }).click();
    await page.getByRole('option', { name: 'department_id (Number)' }).press('Escape');
    await page.locator('[id="demo-multiple-chip-Source\\ 2"]').click();
    await page.getByRole('option', { name: 'department_id (Number)' }).click();
    await page.getByRole('option', { name: 'department_id (Number)' }).press('Escape');
    await page.getByLabel('').click();
    await page.getByRole('option', { name: 'Inner Join' }).click();
    await page.getByRole('button', { name: 'Set Destination' }).click();
    await page.getByLabel('Destination Type').click();
    await page.getByRole('option', { name: 'File Storage' }).click();
    await page.getByRole('button', { name: 'CSV Storage' }).click();
    

  }

  export async function XmlConfirmSourcesAndJoin(page){
    await page.locator('div').filter({ hasText: /^Source 1No selection$/ }).getByRole('textbox').setInputFiles('D:/project/questkart_task/questkart_mini_project/Transformations_Backend-main/data/employees.xml');
    await page.locator('div').filter({ hasText: /^Source 2No selection$/ }).getByRole('textbox').setInputFiles('D:/project/questkart_task/questkart_mini_project/Transformations_Backend-main/data/projects.csv');
    await page.locator('[id="demo-multiple-chip-Source\\ 1"]').click();
    await page.getByRole('option', { name: 'department_id (Number)' }).click();
    await page.getByRole('option', { name: 'department_id (Number)' }).press('Escape');
    await page.locator('[id="demo-multiple-chip-Source\\ 2"]').click();
    await page.getByRole('option', { name: 'department_id (Number)' }).click();
    await page.getByRole('option', { name: 'department_id (Number)' }).press('Escape');
    await page.getByLabel('').click();
    await page.getByRole('option', { name: 'Inner Join' }).click();
    await page.getByRole('button', { name: 'Set Destination' }).click();
    await page.getByLabel('Destination Type').click();
    await page.getByRole('option', { name: 'File Storage' }).click();
    await page.getByRole('button', { name: 'CSV Storage' }).click();
    

  }