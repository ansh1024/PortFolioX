# PortfolioX 📊

### Explainable Investment Decision Support for IPOs & SIPs

PortfolioX is a full-stack fintech platform designed to help retail investors make **data-driven and personalized investment decisions** across IPOs and SIP-based mutual fund investments.

Rather than functioning as a traditional portfolio tracker that only displays numbers, PortfolioX focuses on **decision support** — showing users what action may be appropriate and, more importantly, **why**.

The platform combines an explainable IPO scoring engine, historical backtesting, SIP analytics, XIRR calculations, and behavior-based risk profiling to create a personalized investment dashboard.

---

## 🎯 Problem

Retail investors often have to evaluate multiple signals before making an IPO or portfolio decision:

* GMP
* Subscription levels
* Sector performance
* Historical IPO outcomes
* Personal investment behavior
* SIP allocation
* Portfolio returns

Most platforms either provide raw financial data or generic recommendations without explaining how a conclusion was reached.

**PortfolioX aims to bridge that gap by turning financial data into transparent, personalized decision support.**

---

## 💡 Core Idea

PortfolioX follows three principles:

### 1. Decision-support over data-dump

The platform prioritizes:

> **"What should I consider doing?"**

before simply presenting:

> **"Here is the data."**

Every important metric is accompanied by context or reasoning.

### 2. Personalized by behavior

The dashboard adapts to the user's inferred risk behavior rather than relying on a manually selected dashboard mode.

An aggressive user may see IPO opportunities prioritized, while a conservative user may see SIP consistency and portfolio allocation first.

### 3. Transparency over black-box recommendations

Every IPO score can be broken down into its contributing factors.

Instead of:

```text
Score: 82
Verdict: APPLY
```

PortfolioX aims to provide:

```text
Verdict: APPLY

GMP              → +25
Subscription     → +20
Sector History   → +15
Personal History → +12

Total Score      → 72
```

This makes the system explainable and easier to evaluate.

---

# 🚀 Key Features

## 📈 Explainable IPO Scoring

PortfolioX evaluates IPO opportunities using multiple weighted factors such as:

* GMP
* Subscription
* Sector history
* User's historical investment behavior

The scoring engine produces one of three actionable verdicts:

```text
APPLY
WATCH
SKIP
```

## The scoring logic is isolated from the controller and persistence layers so it can be independently tested and validated.

## 🔍 Score Explainability

Every score is accompanied by a reasoning breakdown.

The IPO detail page exposes the contribution of individual weighted factors instead of presenting the score as a black box.

This is implemented through a dedicated `ScoreReasoningPanel`.

```text
IPO
 │
 ├── GMP contribution
 ├── Subscription contribution
 ├── Sector contribution
 └── Personal history contribution
             │
             ▼
        Final Score
             │
             ▼
      APPLY / WATCH / SKIP
```

---

## 🧪 Historical Backtesting

Before trusting the scoring engine, PortfolioX can replay the scoring logic against historical IPO data.

The backtesting service is deliberately separated from the scoring engine:

```text
Historical IPO Data
        ↓
   BacktestService
        ↓
 ScoringEngineService
        ↓
Historical Results
```

This allows the system to evaluate questions such as:

> "Of the IPOs the engine would have classified as APPLY, how many actually listed positively?"

The backend includes a seeded historical IPO dataset covering approximately 12–18 months.

---

## 👤 Behavior-Based Risk Profiling

PortfolioX derives a user's risk profile from their investment behavior.

The system is designed around behavioral evidence rather than a conventional static risk questionnaire.

For example:

```text
IPO applications
        +
Subscription preferences
        +
Historical decisions
        ↓
Risk Profile
```

The resulting risk profile influences the information priority on the dashboard.

---

## 📊 Dynamic Dashboard

The dashboard changes according to the user's inferred risk behavior.

### Aggressive profile

```text
IPO Opportunities
        ↓
SIP Allocation
        ↓
Other Portfolio Metrics
```

### Conservative profile

```text
SIP Consistency
        ↓
Allocation Drift
        ↓
IPO Opportunities
```

### Moderate profile

```text
Balanced IPO + SIP View
```

This is a genuine information-priority change rather than a cosmetic theme change.

---

## 💰 SIP & Mutual Fund Tracking

PortfolioX provides visibility into active SIP investments, including:

* Fund
* Category
* Monthly investment
* Current XIRR
* Portfolio allocation

The platform also compares current allocation against target allocation and can surface allocation drift.

---

## 📐 XIRR Analytics

PortfolioX uses XIRR-based calculations to evaluate investment performance across cash flows occurring on different dates.

This provides a more meaningful return metric for recurring investments such as SIPs.

---

## 📉 Allocation Analysis

The dashboard includes allocation visualization for understanding the distribution of investments across categories.

Users can compare:

```text
Current Allocation
        vs
Target Allocation
```

and identify significant allocation drift.

---

## 🔐 Authentication & Security

The backend uses JWT-based authentication with dedicated security components.

```text
Login
  ↓
JWT
  ↓
Authentication Filter
  ↓
Protected API
```

The backend separates:

* Security configuration
* JWT configuration
* Authentication filter
* JWT utility
* User details service

This keeps authentication concerns isolated from business logic.

---

# 🏗️ Architecture

PortfolioX follows a layered Spring Boot backend architecture.

```text
┌─────────────────────────────┐
│        React Frontend       │
│                             │
│ Dashboard / IPO / SIP / UI  │
└──────────────┬──────────────┘
               │ REST API
               ▼
┌─────────────────────────────┐
│        Spring Boot          │
│         Controllers         │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│          Services           │
│                             │
│ Scoring │ Backtest │ XIRR   │
│ Risk    │ SIP      │ IPO    │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│        Repositories         │
│          JPA/DB             │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│          MySQL              │
└─────────────────────────────┘
```

The backend is structured into configuration, controllers, services, repositories, models, security, scheduling, exception handling, and utilities.

---

# 🖥️ Frontend Architecture

The frontend is built with React and organized around pages, reusable components, API modules, contexts, hooks, and utilities.

```text
src/
│
├── api/
├── pages/
├── components/
├── context/
├── hooks/
├── utils/
└── styles/
```

## The `RiskProfileContext` drives the personalized dashboard behavior, while components such as `ScoreBadge` and `ScoreReasoningPanel` separate the verdict from its explanation.

# 🧩 Major Modules

| Module           | Purpose                                                        |
| ---------------- | -------------------------------------------------------------- |
| Authentication   | User registration, login and JWT authentication                |
| IPO Management   | IPO discovery and details                                      |
| Scoring Engine   | Calculates IPO scores and verdicts                             |
| Score Reasoning  | Explains why an IPO received its score                         |
| IPO Applications | Records user's investment decisions                            |
| Backtesting      | Validates scoring logic against historical data                |
| SIP Management   | Tracks active SIP investments                                  |
| Mutual Funds     | Stores and manages fund information                            |
| XIRR Calculator  | Calculates investment performance                              |
| Risk Profiling   | Derives user risk behavior                                     |
| Dashboard        | Aggregates personalized portfolio insights                     |
| Data Refresh     | Provides the architecture for future data ingestion            |
| Ask Portfolio    | Planned GenAI interface for natural-language portfolio queries |

---

# 🛠️ Tech Stack

## Frontend

* React
* JavaScript
* Axios
* Recharts
* Vite

## Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* JWT
* Maven

## Database

* MySQL
* Flyway database migrations

## Testing

* JUnit
* Spring Boot integration testing

## Planned AI Layer

* Generative AI
* Natural-language portfolio queries
* AI-assisted financial analysis

---

# 📁 Project Structure

## Backend

```text
portfoliox-backend/
│
├── src/
│   ├── main/
│   │   ├── java/com/portfoliox/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── model/
│   │   │   ├── scheduler/
│   │   │   ├── security/
│   │   │   ├── exception/
│   │   │   └── util/
│   │   │
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── data/
│   │       └── db/migration/
│   │
│   └── test/
│
├── Dockerfile
├── docker-compose.yml
├── pom.xml
└── README.md
```

## Frontend

```text
portfoliox-frontend/
│
├── public/
│
├── src/
│   ├── api/
│   ├── pages/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── utils/
│   └── styles/
│
├── .env.example
├── vite.config.js
├── package.json
└── README.md
```

---

# 🧠 Engineering Decisions

### Isolated Scoring Engine

The scoring engine is intentionally independent from controllers and persistence concerns.

This makes it:

* Easier to test
* Easier to modify
* Easier to backtest
* Easier to explain during technical interviews

### Separate Backtesting Service

Backtesting replays the scoring engine against historical data rather than duplicating scoring logic.

This maintains separation of responsibilities.

### Versioned Database Migrations

PortfolioX uses Flyway migrations instead of relying on automatic Hibernate schema generation.

```text
V1__init_schema.sql
V2__seed_ipo_master.sql
V3__add_score_log.sql
```

This provides controlled and versioned database evolution.

### Modular AI Layer

The AI functionality is isolated under a dedicated service package so GenAI capabilities can be added without coupling them to the core investment logic.

---

# 🎨 UI/UX Philosophy

PortfolioX intentionally avoids the typical flashy fintech dashboard aesthetic.

The design emphasizes:

* Trust
* Transparency
* Information hierarchy
* Explainability
* Medium information density
* Minimal visual noise

The design uses a restrained fintech visual language with deep navy, slate gray, and a single accent color, while charts use minimal gridlines and avoid decorative gradients.

The application also avoids generic dashboard-template styling and "AI-powered" gimmicks; intelligence should be demonstrated through the reasoning and data rather than labels.

---

# 🤖 GenAI — V2

A planned **Ask Portfolio** module will allow users to query their own investment history using natural language.

Example:

```text
"How did I perform on IPOs where GMP was above 40%?"
```

The intended experience is:

```text
Natural Language Query
          ↓
Query Processing
          ↓
Actual Portfolio Data
          ↓
Analysis
          ↓
Answer + Inline Visualization
```

The goal is not to create a generic chatbot, but a natural-language interface over the user's actual portfolio data.

---

# 🧪 Testing Strategy

The most important business logic is tested independently.

Priority test areas include:

```text
ScoringEngineService
        ↓
BacktestService
        ↓
XirrCalculatorService
```

Integration testing is also planned for the IPO controller/API layer.

---

# 🔮 Future Scope

Potential future extensions include:

* Live IPO data ingestion
* Automated data refresh
* Redis-based caching
* Advanced portfolio analytics
* Natural-language portfolio querying
* AI-generated portfolio insights
* More sophisticated scoring models
* Additional investment instruments
* Mobile optimization
* Expanded historical datasets

The backend already contains a scheduler abstraction intended to support future live data ingestion.

---

# 📌 Project Status

🚧 **Under Active Development**

PortfolioX is being developed as a production-oriented full-stack fintech project with emphasis on:

* Clean architecture
* Explainable decision logic
* Testability
* Personalized UX
* Financial analytics
* Extensible AI integration

---

# 👨‍💻 Author

**Ansh**

PortfolioX — turning investment data into **transparent, personalized decisions**.
