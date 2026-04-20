module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: "npm run start",
      startServerReadyPattern: "Ready",
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/tr",
        "http://localhost:3000/en",
        "http://localhost:3000/tr/tools",
        "http://localhost:3000/en/tools"
      ],
      settings: {
        preset: "mobile",
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 0,
          downloadThroughputKbps: 1638.4,
          uploadThroughputKbps: 675
        },
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 812,
          deviceScaleFactor: 2,
          disabled: false
        },
        formFactor: "mobile"
      }
    },
    assert: {
      assertions: {
        "largest-contentful-paint": [
          "error",
          {
            "maxNumericValue": 2500
          }
        ],
        "first-contentful-paint": [
          "error",
          {
            "maxNumericValue": 1800
          }
        ],
        "cumulative-layout-shift": [
          "error",
          {
            "maxNumericValue": 0.1
          }
        ],
        "interaction-to-next-paint": [
          "error",
          {
            "maxNumericValue": 200
          }
        ],
        "time-to-first-byte": [
          "error",
          {
            "maxNumericValue": 800
          }
        ],
        "categories:performance": [
          "error",
          {
            "minScore": 0.8
          }
        ]
      }
    },
    upload: {
      target: "temporary-public-storage"
    }
  }
};