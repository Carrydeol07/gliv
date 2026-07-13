# GLIV v2

# 003_ARCHITECTURE_PATCH_metadata_publication.md

> Status: Locked
> Context: Module 02 Database Schema Implementation

## Purpose

This patch formalizes the decisions regarding the placement of metadata and notes in the database schema, as well as the normalization of specific metadata fields.

## Decisions

1. **Metadata and Notes Attachment (Title vs. Format)**
   - **Decision:** Metadata (Synopsis, Genres, Tags, Characters, Alternative Titles) and Personal Notes are attached to `title_id`, not `format_id`.
   - **Rationale:** The documentation explicitly calls out Contributors as a Format-level exception. Furthermore, `12_SEARCH_SERIES.md`'s Series Page layout displays Synopsis and Personal Notes once at the Series level, rather than once per Format Card.

2. **Metadata Normalization (Junction Tables vs. JSON)**
   - **Decision:** Genres, Tags, and Characters are stored in normalized junction tables (`genres`, `title_genres`, etc.) rather than as JSON columns in the `metadata` table.
   - **Rationale:** `43_FILTER_SYSTEM_SPECIFICATION.md` requires Discover and Library filters to query by Genre. SQLite cannot efficiently index into JSON blobs for these types of filters, making normalized junction tables the optimal choice for performance and queryability.

## Implementation

These decisions are directly implemented in the Module 02 database schema migration and reflected in the updated `32_DATABASE_SPECIFICATION.md`.
