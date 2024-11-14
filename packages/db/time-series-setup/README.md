# Time-Series Database Setup with TimescaleDB

### Overview

For efficiently handling and querying time-series financial transaction data, we used TimescaleDB, a time-series database built on PostgreSQL. This setup enables high performance when aggregating data over daily, weekly, monthly, and yearly intervals. It also ensures the data is accessible for real-time analytics and historical summaries.

Using TimescaleDB with PostgreSQL provides us with:

-   **High performance on time-series data:** Allows optimized storage and retrieval.
-   **Continuous aggregation:** Saves on query computation by pre-aggregating data.
-   **Materialized views with refresh policies:** Automatically maintains up-to-date summaries.

---

### Key Components and Workflow

#### 1. Hypertable: Definition and Purpose

In TimescaleDB, a **hypertable** is an abstraction that partitions data for efficient storage and access. It's essentially a logical table spread across multiple smaller tables, organized based on time. This setup improves query performance for time-series data, allowing data to be efficiently written and retrieved.

-   **Why we used a Hypertable:** Our transaction data is timestamped, and hypertables let us store this data in smaller, more manageable chunks organized by time (days, weeks, months, etc.). This makes the queries faster, especially for recent data, which is a key requirement for financial applications.

-   **Creating the Hypertable:**

```sql
SELECT create_hypertable('transactions', 'timestamp');
```

This command converts our `transactions` table into a hypertable, partitioned based on the `timestamp` column.

#### 2. Continuous Aggregates: Definition and Purpose

Continuous aggregates allow pre-aggregation of data over specified time intervals. They're similar to materialized views, but designed specifically for time-series data in TimescaleDB, making them automatically refresh as new data is added.

-   **Why we used Continuous Aggregates:** Aggregating data on demand for large time periods (like years or months) can be computationally expensive. By creating continuous aggregates, we can maintain precomputed summaries in real time, reducing query time and improving performance, especially for dashboards that display historical transaction summaries.

-   **Continuous Aggregate Views Created:**
    -   `daily_transaction_summary`
    -   `weekly_transaction_summary`
    -   `monthly_transaction_summary`
    -   `yearly_transaction_summary`

Each view aggregates transaction data into daily, weekly, monthly, and yearly summaries, grouping by `userId` and `category`.

#### 3. Materialized Views: Definition and Purpose

A materialized view is a database object containing the results of a query. It stores these results physically, unlike a regular view, which only represents a query. Continuous aggregates in TimescaleDB are actually implemented as materialized views with automatic refresh policies.

-   **Why we used Materialized Views with Refresh Policies:** The continuous aggregate views are automatically refreshed as per a specified schedule. This ensures our precomputed data summaries stay up-to-date without manually recomputing them, which is ideal for applications needing reliable and immediate access to historical data summaries.

---

### Creating Continuous Aggregate Views

The following SQL commands create continuous aggregate views for each interval. The `time_bucket` function segments data by the specified period, which is then aggregated using `SUM(amount)` to calculate the total amount.

```sql
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_transaction_summary
WITH (timescaledb.continuous) AS
SELECT
    userId,
    category,
    time_bucket('1 day', timestamp) AS day,
    SUM(amount) AS total_amount
FROM transactions
GROUP BY userId, category, day;

CREATE MATERIALIZED VIEW IF NOT EXISTS weekly_transaction_summary
WITH (timescaledb.continuous) AS
SELECT
    userId,
    category,
    time_bucket('1 week', timestamp) AS week,
    SUM(amount) AS total_amount
FROM transactions
GROUP BY userId, category, week;

CREATE MATERIALIZED VIEW IF NOT EXISTS monthly_transaction_summary
WITH (timescaledb.continuous) AS
SELECT
    userId,
    category,
    time_bucket('1 month', timestamp) AS month,
    SUM(amount) AS total_amount
FROM transactions
GROUP BY userId, category, month;

CREATE MATERIALIZED VIEW IF NOT EXISTS yearly_transaction_summary
WITH (timescaledb.continuous) AS
SELECT
    userId,
    category,
    time_bucket('1 year', timestamp) AS year,
    SUM(amount) AS total_amount
FROM transactions
GROUP BY userId, category, year;
```

These continuous aggregates allow us to efficiently fetch transaction summaries for each period without recalculating on every query.

---

### Refresh Policies

A **refresh policy** in TimescaleDB automatically keeps the continuous aggregates up-to-date. We set refresh policies to update these views periodically to ensure our summaries reflect the latest transactions.

---

### Real-Time + Historical Data Workflow

1.  **Historical Data (Continuous Aggregates):** The continuous aggregates (`daily_transaction_summary`, `weekly_transaction_summary`, etc.) store all past data until the start of the current day, week, month, or year. When we fetch data for any period, we retrieve this historical summary, which remains consistent and up-to-date.

2.  **Real-Time Data (Current Period):** For the ongoing period (current day, week, etc.), real-time data is fetched directly from the `transactions` hypertable. This fetches the latest, unaggregated transactions up to the current moment.

3.  **Combining Historical and Real-Time Data:** The historical data (e.g., all days up to yesterday) and real-time data (e.g., today's transactions) are combined. This combined result provides a full summary for the specified period, with minimal computation required.

Here's the code structure for this workflow:

```typescript
async function getAggregatedData(interval: string, userId: number, category: string) {
    // Fetch historical data (precomputed)
    const historicalData = await fetchHistoricalData(interval, userId, category);

    // Fetch real-time data (current period)
    const realTimeData = await fetchRealTimeData(interval, userId, category);

    // Combine both datasets
    return [...historicalData, ...realTimeData];
}
```

-   **fetchHistoricalData** retrieves data from continuous aggregates up to the start of the current period.
-   **fetchRealTimeData** pulls the latest data for the current period from the raw `transactions` hypertable.

---

### Benefits of this Time-Series Setup

-   **Efficiency:** Continuous aggregates avoid recomputing historical data on each request, drastically improving query speed.
-   **Scalability:** Hypertables efficiently manage time-series data at scale, enabling fast inserts and queries.
-   **Real-Time Accuracy:** Real-time data fetching ensures current period data is always up-to-date.
-   **Automatic Refresh Policies:** Continuous aggregates keep historical data summaries updated without manual intervention.

---

This TimescaleDB setup allows our application to handle both historical and real-time transaction data with high efficiency, ensuring that summaries for users are accurate and available instantly.
