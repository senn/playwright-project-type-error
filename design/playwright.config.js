/* global process */

// Set current reporting timestamp
const timestamp = new Date().toISOString();

// Prepare Playwright launch arguments
const launchArgs = ['--disable-dev-shm-usage', '--disable-gpu'];
if ('LOCAL' === process.env.ENVIRONMENT) {
    // Ignore certificate errors on local
    launchArgs.push('--ignore-certificate-errors');
}

// Prepare Playwright reporters - dedicated Zephyr reporter when env variable is set
let reporters;
if ('true' === process.env.PLAYWRIGHT_ZEPHYR_REPORTING_ENABLED) {
    reporters = [
        ['list'],
        [
            '@y9f-zephyr/reporter',
            {
                auth: {
                    username: process.env.PLAYWRIGHT_ZEPHYR_USERNAME,
                    password: process.env.PLAYWRIGHT_ZEPHYR_PASSWORD,
                    PatId: process.env.PLAYWRIGHT_ZEPHYR_PAT_ID,
                },
                zephyr: {
                    projectKey: process.env.PLAYWRIGHT_ZEPHYR_PROJECT,
                    testPlanKey: process.env.PLAYWRIGHT_ZEPHYR_TESTPLAN,
                    environment: process.env.ENVIRONMENT,
                },
            },
        ],
    ];
} else {
    reporters = [
        ['junit',
            {
                // Place the junit results somewhere our Jenkins pipeline will look for them
                outputFile: 'e2e/results/junit-results.xml',
                stripANSIControlSequences: true,
            },
        ],
        ['list'],
    ];
}

export default {
    use: {
        channel: 'chrome',
        headless: true,
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
        ignoreHTTPSErrors: true,
        contextOptions: {
            reducedMotion: 'reduce',
        },
        launchOptions: {
            executablePath: process.env.CHROMIUM_BIN,
            args: launchArgs
        },
        trace: 'retain-on-failure'
    },
    projects: [
        {
            name: `Automated Playwright tests ${timestamp}`,
            title: `Automated Playwright tests ${timestamp}`,
        },
    ],
    workers: 1,
    updateSnapshots: 'missing',
    reporter: reporters,
    retries: 1,
    testDir: 'e2e/specs',
    snapshotDir: 'e2e/snapshots',
    testMatch: '**/*.spec.js',
    outputDir: 'e2e/results',
};
