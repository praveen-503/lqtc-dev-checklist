# LQTC Tracker - Project Documentation

## Project Overview
The **LQTC Tracker** is a modern, enterprise-grade engineering dashboard designed specifically for high-velocity software teams. Its primary goal is to professionalize and automate the gap between Development and SQA (Software Quality Assurance). 

By providing a structured, checklist-driven environment, it ensures that no User Story is handed over to testing without meeting the internal "Definition of Done."

---

## Key Features

### 1. Sprint-Scoped Data Management
*   **What it is**: Data is partitioned into specific time-bound sprints (e.g., `2026.03.23 - 2026.04.05`).
*   **Why**: Engineering teams work in cycles. Scoping data by sprint prevents the dashboard from becoming cluttered with stale tickets and allows for clean "Export/Import" workflows for reporting.

### 2. The Global 22-Step SQA Checklist
*   **What it is**: A hard-coded, mandatory checklist for every User Story covering everything from "Story Point Estimation" to "Peer Testing" and "RB Path Updates."
*   **Why**: Most bugs in SQA occur because simple dev-integration steps were skipped. This checklist enforces a "Success Path" that must be 100% complete before a story is marked as Done.

### 3. Automated SQA Handoff Emails
*   **What it is**: A one-click "Envelope" icon on each User Story that generates a professionally formatted email template.
*   **Why**: Manually typing out release notes, build numbers, and deployment orders is time-consuming and prone to typos. Automation ensures SQA receives the exact information they need in a consistent format.

### 4. Direct ADO Link Integration
*   **What it is**: Automatic detection of User Story and Bug numbers to generate clickable links to Azure DevOps (ADO).
*   **Why**: Developers shouldn't have to search in two places. This dashboard acts as a "Single Pane of Glass" on top of the ADO system.

### 5. Contextual Bug Tracking
*   **What it is**: Slide-out "Offcanvas" menus for Active and Fixed bugs.
*   **Why**: Keeping bugs in side panels prevents the main User Story board from becoming overwhelming, while still keeping the bugs "one click away" for quick status checks during standups.

---

## Technical Philosophy

### Local-First Persistence
The app uses browser `localStorage`. 
*   **Why**: This makes the app **instantaneous**. There is no "loading" spinner, no server latency, and no database costs. Your data lives where you work: in your browser.

### Privacy by Design
Since there is no backend, your project data is never transmitted to a third-party server. Exporting JSON is the primary way to backup or share data, giving the developer full control.

### Universal Responsiveness
The UI is built with Bootstrap 5 and custom CSS to ensure it looks just as good on a giant 4K monitor as it does on a mobile phone during a remote meeting.
