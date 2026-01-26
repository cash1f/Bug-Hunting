import { Page } from "@playwright/test";
import { testData } from "../test-data/dataProducts";

export async function setupLoggedInUser(page: Page) {
    
        await page.goto('/auth/login');
        await page.getByPlaceholder('Email').fill(testData.user.email);
        await page.getByPlaceholder('Password').fill(testData.user.password);
        await page.getByRole('button', { name: 'Login' }).click();

        await page.waitForTimeout(3000);
        await page.locator('[data-test="nav-home"]').click();
  }