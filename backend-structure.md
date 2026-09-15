# PortfolioX — Backend Folder Structure (Spring Boot)

```
portfoliox-backend/
├── src/
│   ├── main/
│   │   ├── java/com/portfoliox/
│   │   │   ├── PortfolioXApplication.java
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── JwtConfig.java
│   │   │   │   ├── CorsConfig.java
│   │   │   │   ├── SchedulerConfig.java
│   │   │   │   └── SwaggerConfig.java
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── IpoController.java
│   │   │   │   ├── IpoApplicationController.java
│   │   │   │   ├── MutualFundController.java
│   │   │   │   ├── SipController.java
│   │   │   │   ├── ScoreController.java
│   │   │   │   ├── RiskProfileController.java
│   │   │   │   ├── DashboardController.java
│   │   │   │   └── AiQueryController.java        // V2 GenAI hook
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── IpoService.java
│   │   │   │   ├── IpoApplicationService.java
│   │   │   │   ├── MutualFundService.java
│   │   │   │   ├── SipService.java
│   │   │   │   ├── ScoringEngineService.java     // core USP
│   │   │   │   ├── BacktestService.java
│   │   │   │   ├── RiskProfileService.java
│   │   │   │   ├── XirrCalculatorService.java
│   │   │   │   ├── DashboardAggregationService.java
│   │   │   │   └── ai/
│   │   │   │       └── AiQueryService.java       // V2
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── IpoMasterRepository.java
│   │   │   │   ├── IpoApplicationRepository.java
│   │   │   │   ├── MutualFundRepository.java
│   │   │   │   ├── SipHoldingRepository.java
│   │   │   │   ├── ScoreLogRepository.java
│   │   │   │   └── RiskProfileRepository.java
│   │   │   │
│   │   │   ├── model/
│   │   │   │   ├── entity/
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── IpoMaster.java
│   │   │   │   │   ├── IpoApplication.java
│   │   │   │   │   ├── MutualFund.java
│   │   │   │   │   ├── SipHolding.java
│   │   │   │   │   ├── ScoreLog.java
│   │   │   │   │   └── RiskProfile.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── request/
│   │   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   │   ├── IpoApplicationRequest.java
│   │   │   │   │   │   └── SipRequest.java
│   │   │   │   │   └── response/
│   │   │   │   │       ├── AuthResponse.java
│   │   │   │   │       ├── ScoreResponse.java
│   │   │   │   │       ├── DashboardResponse.java
│   │   │   │   │       └── BacktestResponse.java
│   │   │   │   └── enums/
│   │   │   │       ├── RiskCategory.java
│   │   │   │       ├── ScoreVerdict.java         // APPLY / WATCH / SKIP
│   │   │   │       └── IpoSector.java
│   │   │   │
│   │   │   ├── scheduler/
│   │   │   │   └── DataRefreshJob.java           // placeholder → future live ingestion
│   │   │   │
│   │   │   ├── security/
│   │   │   │   ├── JwtAuthFilter.java
│   │   │   │   ├── JwtUtil.java
│   │   │   │   └── UserDetailsServiceImpl.java
│   │   │   │
│   │   │   ├── exception/
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   └── InvalidScoreInputException.java
│   │   │   │
│   │   │   └── util/
│   │   │       ├── ScoreWeightConfig.java        // tunable weights, not hardcoded
│   │   │       └── DateUtils.java
│   │   │
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       ├── data/
│   │       │   └── seed_ipo_dataset.csv          // 12-18mo historical IPO data
│   │       └── db/migration/                     // Flyway
│   │           ├── V1__init_schema.sql
│   │           ├── V2__seed_ipo_master.sql
│   │           └── V3__add_score_log.sql
│   │
│   └── test/
│       └── java/com/portfoliox/
│           ├── service/
│           │   ├── ScoringEngineServiceTest.java // priority: test the USP logic
│           │   ├── BacktestServiceTest.java
│           │   └── XirrCalculatorServiceTest.java
│           └── controller/
│               └── IpoControllerIntegrationTest.java
│
├── Dockerfile
├── docker-compose.yml                            // app + mysql + (redis later)
├── pom.xml
└── README.md
```

## Notes on structure decisions

- **`service/ScoringEngineService.java` is isolated on purpose** — it should have zero dependency on controllers/repositories beyond what it needs to compute a score. This makes it directly unit-testable in isolation, which is exactly what you want to demo in an interview: "here's the core logic, here's the test suite proving it's sound."
- **`BacktestService` is separate from `ScoringEngineService`** — backtesting *replays* the engine against historical data, it doesn't contain scoring logic itself. Keeps single-responsibility clean.
- **`ai/` subpackage under service** — kept isolated so the GenAI layer is additive later, not entangled with core scoring.
- **`scheduler/DataRefreshJob.java` exists from day one but does nothing exotic in MVP** — it can run against seed data on a cron, so the *architecture* for live ingestion is already there when you're ready to plug in a real source.
- **Flyway over Hibernate auto-ddl** — versioned migrations are a legitimate "I understand production DB practices" signal in interviews.
