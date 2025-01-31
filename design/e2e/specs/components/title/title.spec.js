import {expect, test} from '@playwright/test';



test.describe.parallel('Title', () => {
    test('Check Title component example', async ({page}) => {
        await expect(true).toBeTruthy();
    });
});
