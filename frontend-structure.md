# PortfolioX — Frontend Folder Structure (React)

```
portfoliox-frontend/
├── public/
│   └── favicon.svg
│
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── router.jsx
│   │
│   ├── api/
│   │   ├── axiosInstance.js          // baseURL + JWT interceptor
│   │   ├── authApi.js
│   │   ├── ipoApi.js
│   │   ├── sipApi.js
│   │   ├── scoreApi.js
│   │   ├── dashboardApi.js
│   │   └── aiQueryApi.js             // V2
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── SignupPage.jsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.jsx     // dynamic — reshapes per risk profile
│   │   ├── ipo/
│   │   │   ├── IpoListPage.jsx
│   │   │   ├── IpoDetailPage.jsx     // shows score + reasoning
│   │   │   └── LogApplicationPage.jsx
│   │   ├── sip/
│   │   │   ├── SipListPage.jsx
│   │   │   └── AddSipPage.jsx
│   │   ├── backtest/
│   │   │   └── BacktestReportPage.jsx
│   │   ├── profile/
│   │   │   └── RiskProfilePage.jsx
│   │   └── ai/
│   │       └── AskPortfolioPage.jsx  // V2, natural-language query
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── dashboard/
│   │   │   ├── AllocationChart.jsx       // recharts pie/donut
│   │   │   ├── XirrTrendChart.jsx        // recharts line
│   │   │   ├── RiskBadge.jsx
│   │   │   └── DynamicWidgetGrid.jsx     // renders widgets per risk category
│   │   ├── ipo/
│   │   │   ├── IpoCard.jsx
│   │   │   ├── ScoreBadge.jsx            // APPLY / WATCH / SKIP
│   │   │   └── ScoreReasoningPanel.jsx   // shows "why" behind the score
│   │   ├── sip/
│   │   │   └── SipRow.jsx
│   │   └── common/
│   │       ├── Button.jsx
│   │       ├── Modal.jsx
│   │       ├── LoadingSpinner.jsx
│   │       └── EmptyState.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── RiskProfileContext.jsx    // drives dynamic dashboard behavior
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useDashboardData.js
│   │   └── useScoreCalculation.js
│   │
│   ├── utils/
│   │   ├── formatCurrency.js
│   │   ├── formatXirr.js
│   │   └── constants.js
│   │
│   └── styles/
│       ├── theme.js
│       └── globals.css
│
├── .env.example
├── vite.config.js
├── package.json
└── README.md
```

## Notes on structure decisions

- **`DynamicWidgetGrid.jsx` is the component that embodies your "changes per user" requirement** — it reads risk profile from context and conditionally renders/reorders widgets (e.g., an aggressive-profile user sees IPO opportunities front and center; a conservative-profile user sees SIP consistency and allocation drift first).
- **`ScoreReasoningPanel.jsx` is deliberately separate from `ScoreBadge.jsx`** — showing *why* a score landed where it did (not just a number) is what separates a decision-support tool from a gimmick, and it's an easy visual to show off in a demo.
- **`context/RiskProfileContext.jsx`** — centralizes risk profile so any component can read it without prop-drilling; this is what "dynamic per user" actually plugs into on the frontend.
- **`ai/AskPortfolioPage.jsx` isolated under pages/ai** — same principle as backend, kept as a clean bolt-on for V2 rather than woven through core pages.
