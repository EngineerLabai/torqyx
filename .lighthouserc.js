const numberOfRuns = Math.max(
  1,
  Number.parseInt(process.env.LHCI_RUNS ?? "1", 10) || 1
);
const lcpBudgetMs = Math.max(
  2500,
  Number.parseInt(process.env.LHCI_LCP_BUDGET_MS ?? "5000", 10) || 5000
);
const performanceMinScore = Math.min(
  1,
  Math.max(0, Number.parseFloat(process.env.LHCI_PERFORMANCE_MIN_SCORE ?? "0.65") || 0.65)
);

module.exports = {
  ci: {
    collect: {
      numberOfRuns,
      startServerCommand: "npm run start",
      startServerReadyPattern: "Ready",
      url: [
        "http://localhost:3000/tr",
        "http://localhost:3000/en",
        "http://localhost:3000/tr/tools",
        "http://localhost:3000/en/tools",
        "http://localhost:3000/tr/tools/bolt-calculator",
        "http://localhost:3000/en/tools/bolt-calculator",
        "http://localhost:3000/tr/tools/gear-design/calculators/module-calculator",
        "http://localhost:3000/en/tools/gear-design/calculators/module-calculator"
      ],
      settings: {
        chromeFlags: "--disable-dev-shm-usage --disable-gpu --no-sandbox",
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
            "maxNumericValue": lcpBudgetMs
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
            "minScore": performanceMinScore
          }
        ]
      }
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci/reports"
    }
  }
};
