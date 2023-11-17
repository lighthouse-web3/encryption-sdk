module.exports = {
    projects: [
        {
            displayName: 'dom',
            testEnvironment: 'jsdom',
            snapshotSerializers: ['enzyme-to-json/serializer'],
            testMatch: ['**/**/*.test.js?(x)']
        },
        {
            displayName: 'node',
            testEnvironment: 'node',
            testMatch: [
                '**/**/*.test.js?(x)',
            ]
        },
    ],
};