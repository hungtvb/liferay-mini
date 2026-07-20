# Practitioner Lab 01.3B — Vocabularies, Categories, and Tags

> **Source status:** SOURCE READY / RUNTIME PENDING
>
> This lab uses the Classic site-scoped categorization applications that support the current Web Content and Documents and Media baseline.

## Goal

Classify Nexcent Web Content and Documents and Media assets with one managed vocabulary, hierarchical categories, and flexible tags.

At the end of the lab, learners can explain and demonstrate:

```text
Vocabulary
→ managed group of categories

Category
→ governed, optionally hierarchical classification

Tag
→ flexible, non-hierarchical keyword
```

## Sample source

Use:

```text
training/master-track-code-labs/sample-data/nexcent-taxonomy.json
```

The sample defines:

```text
Vocabulary: Nexcent Topics
├── Membership
├── Community
├── Events
│   ├── Webinars
│   └── Meetups
└── Marketing

Tags:
featured
homepage
beginner
```

## Part 1 — Create the Vocabulary

1. Switch to `Nexcent Training Site`.
2. Open:

```text
Site Menu
→ Categorization
→ Categories
```

3. Click **New Vocabulary**.
4. Enter:

```text
Name: Nexcent Topics
Description: Public topics used to classify Nexcent community content and assets.
Allow Multiple Categories: enabled
Visibility: Public
```

5. Save.

### Why Public?

Use Public visibility because this vocabulary is intended for page navigation, search, collection filtering, and other visitor-facing experiences. Internal vocabularies are better suited to editorial governance that should not be exposed publicly.

## Part 2 — Create Categories

Inside `Nexcent Topics`, create:

```text
Membership
Community
Events
Marketing
```

Under `Events`, create two child categories:

```text
Webinars
Meetups
```

This proves that Categories can be hierarchical while Tags remain flat.

## Part 3 — Create Tags

Open:

```text
Site Menu
→ Categorization
→ Tags
```

Create:

```text
featured
homepage
beginner
```

Use lowercase, short, reusable names. Do not create a Tag when a governed Category already represents the same business concept.

## Part 4 — Classify Community Web Content

1. Open:

```text
Site Menu
→ Content & Data
→ Web Content
```

2. Edit the article with ERC:

```text
NXC-COMMUNITY-001
```

3. Open the article Properties/Categorization panel.
4. Assign Categories:

```text
Community
Membership
```

5. Assign Tags:

```text
featured
homepage
```

6. Publish the article.

## Part 5 — Classify a Document

1. Open Documents and Media.
2. Edit:

```text
community-01.jpg
```

3. Open Categorization.
4. Assign Category:

```text
Community
```

5. Assign Tag:

```text
featured
```

6. Save.

## Part 6 — Verify Classification

Verify all of the following:

- `NXC-COMMUNITY-001` shows `Community` and `Membership`.
- The article shows Tags `featured` and `homepage`.
- `community-01.jpg` shows Category `Community` and Tag `featured`.
- Searching or filtering by `Community` returns the expected classified assets.
- The `Events` hierarchy displays `Webinars` and `Meetups` as child categories.

## Asset Library scope exercise

Open `Nexcent Shared Assets` and review its Categorization applications.

Record the scope rule:

```text
Asset Library Vocabulary and Categories
→ available to connected Sites

Asset Library Tags
→ scoped to that Asset Library context
```

Do not create duplicate vocabularies with the same meaning in both the Site and Asset Library unless the project explicitly requires separate governance.

## Optional API Explorer exercise

Open:

```text
http://localhost:8080/o/api
```

Find the Headless Admin Taxonomy API and inspect the available Vocabulary, Category, and Keyword operations. The required lab remains UI-based; this step only demonstrates that taxonomy metadata is also exposed through supported Liferay APIs.

## Evidence

Capture:

1. `Nexcent Topics` vocabulary settings.
2. Category hierarchy including `Events → Webinars/Meetups`.
3. Tags list.
4. Categorization panel of `NXC-COMMUNITY-001`.
5. Categorization panel of `community-01.jpg`.
6. A filtered/search result showing classified assets.

## Checkpoint

The lab passes when the learner can answer:

- Why is `Nexcent Topics` a Vocabulary instead of a Tag?
- Why are `Webinars` and `Meetups` Categories under `Events`?
- Why is `featured` a Tag rather than a Category?
- What is the scope difference between Site and Asset Library categorization?
- Which metadata should frontend use for governed navigation versus temporary editorial labeling?

## Official references

- Tags and Categories: https://learn.liferay.com/w/dxp/content-management-system/tags-and-categories/
- Organizing Content with Categories and Tags: https://learn.liferay.com/w/dxp/content-management-system/tags-and-categories/organizing-content-with-categories-and-tags
- Defining Categories and Vocabularies: https://learn.liferay.com/w/dxp/content-management-system/tags-and-categories/defining-categories-and-vocabularies-for-content
- Tagging Content and Managing Tags: https://learn.liferay.com/w/dxp/content-management-system/tags-and-categories/tagging-content-and-managing-tags
