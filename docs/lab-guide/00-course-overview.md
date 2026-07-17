# Lab 00 — Course Overview and Architecture

## Overview

Build a dynamic Nexcent landing page on Liferay DXP 2026.Q1.1 LTS. The frontend uses Custom Element Client Extensions, while text, images, HTML, and lists are loaded from Liferay through Headless APIs.

## Estimated time

20–30 minutes.

## Learning objectives

- Explain the frontend and backend responsibilities.
- Identify the minimum three required components.
- Describe the end-to-end content flow.
- Understand the `main` and `final` branch strategy.

## Target architecture

```text
Liferay Page
├── nexcent-hero
├── nexcent-services
├── nexcent-features
└── shared global CSS/JS

Custom Elements
        ↓
Headless Delivery API
        ↓
Classic Web Content + Documents and Media

Excel workbook
        ↓
Importer
        ↓
Structured Content API
```

## Required components

1. Hero Section
2. Services List
3. Feature List

Statistics, Testimonials, Blog Cards, Header, and Footer are extension exercises.

## Data ownership

### Frontend

- Custom Element lifecycle
- API calls and DTO mapping
- Loading, empty, and error states
- Responsive layout
- Accessibility
- Figma design tokens

### Backend and content

- Web Content Structures
- FreeMarker preview Templates
- Sample content
- Image assets
- Excel import schema
- Repeatable migration

## Branch strategy

```text
main  → starting state used for exercises
final → completed reference solution
```

Create a branch for each lesson:

```bash
git switch -c lab/01-environment
```

## Definition of done

- At least three Custom Elements render successfully.
- No landing-page text or image is hard-coded in component source.
- Content is loaded from Liferay APIs.
- Imported data appears under **Site Content → Web Content**.
- The project works on desktop and mobile.

## Checkpoint

Confirm that you understand this flow:

```text
Content editor → Web Content → Headless API → Custom Element → Liferay Page
```

## Knowledge check

1. Why should the landing page not be one hard-coded React application?
2. Which system owns the text and images?
3. What is the purpose of the `final` branch?
