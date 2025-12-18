# Changelog

All notable changes to the Genealogy Filename Generator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.1] - 2025-12-17

### Changed

- **Documentation:** Updated Quick Start section in README to prioritize GitHub Pages hosted version as the easiest installation method
- **README:** Reorganized Quick Start to show hosted version first, followed by local installation as secondary option
- **Last Updated Date:** Updated project status to reflect current date

### Notes

- No code changes in this patch release
- Documentation improvements for better user experience
- GitHub Pages link: https://emaynard.github.io/genealogy-filename-generator/

## [2.0.0] - 2025-12-04

### 🎉 Major Release: Sub-template Formatting System (Epic 1)

This major release introduces a complete overhaul of the filename formatting system, replacing hardcoded patterns with a flexible, composable sub-template architecture. Users now have full control over how dates, places, and names appear in generated filenames.

### Added

#### Sub-template System
- **DATE Sub-template:** Customizable date formatting with placeholders `{YYYY}`, `{YY}`, `{MM}`, `{M}`, `{DD}`, `{D}` (Story 1.3)
  - Default: `{YYYY}.{MM}.{DD}` (e.g., "2024.03.15")
  - Supports any pattern: `{DD}-{MM}-{YYYY}`, `{M}/{D}/{YY}`, etc.
  - Smart padding: `{MM}` = zero-padded, `{M}` = no padding

- **PLACE Sub-template:** Customizable place hierarchy with placeholders `{COUNTRY}`/`{C}`, `{STATE}`/`{S}`, `{COUNTY}`/`{CO}`, `{CITY}`/`{CI}` (Story 1.4)
  - Default: `{COUNTRY}.{STATE}.{COUNTY}.{CITY}`
  - Flexible ordering: `{CITY}, {STATE}` or `{C}.{S}` for abbreviations
  - Missing data handled gracefully with 'x' placeholder

- **NAME Sub-template:** Customizable name formatting with placeholders `{SURNAME}`, `{GIVEN}`, `{MIDDLE}` (Story 1.5)
  - Default: `{SURNAME:upper}.{GIVEN}`
  - Supports format modifiers (see below)
  - Full control over name component order

#### Format Modifiers (Story 1.2)
- `:upper` - Convert to UPPERCASE (e.g., `{SURNAME:upper}` → "SMITH")
- `:lower` - Convert to lowercase (e.g., `{GIVEN:lower}` → "john")
- `:title` - Title Case (e.g., `{GIVEN:title}` → "John Doe")
- `:abbrev` - First letter only (e.g., `{MIDDLE:abbrev}` → "J")
- Case-insensitive modifier syntax (`:UPPER` and `:upper` both work)

#### Template Configuration UI (Story 1.6)
- Settings section with input fields for DATE, PLACE, NAME sub-templates
- Placeholder hint text showing example syntax
- Help tooltips explaining available placeholders
- Monospace font for template inputs (improved readability)
- Bootstrap 5.3 floating label pattern for consistency

#### Template Validation (Story 1.7)
- Real-time syntax validation (debounced 500ms)
- Helpful warning messages for invalid placeholders
- Success indicators for valid templates
- Clear error suggestions with correct placeholder syntax
- Non-blocking warnings (users can save despite warnings)

#### Persistence & Loading (Stories 1.8, 1.9)
- localStorage integration for all template configurations
- 300ms debounced auto-save (matches existing pattern)
- Atomic saves (all templates saved together)
- Load saved configurations on application startup (\u003c50ms performance target)
- Graceful handling of localStorage quota exceeded errors

#### Reset Functionality (Story 1.12)
- "Reset to Defaults" button for template configurations
- Confirmation dialog before resetting
- Restores default templates:
  - DATE: `{YYYY}.{MM}.{DD}`
  - PLACE: `{COUNTRY}.{STATE}.{COUNTY}.{CITY}`
  - NAME: `{SURNAME:upper}.{GIVEN}`

### Changed

#### Core Template Processing (Story 1.1, 1.11)
- **Sub-template Processor Engine:** Pure JavaScript function for parsing template strings and replacing placeholders (Story 1.1)
  - Deterministic processing (same input → same output)
  - \u003c5ms processing time for typical templates
  - Handles missing data gracefully
  - Preserves literal braces in output
  
- **Filename Generation Integration:** Updated main filename generation to use processed sub-template outputs (Story 1.11)
  - Replaced hardcoded date formatting with DATE sub-template
  - Replaced reverse place logic with PLACE sub-template
  - Integrated NAME sub-template into main template rendering
  - Maintains \u003c10ms filename generation performance target

#### Legacy Migration (Story 1.10)
- **Name Format Migration:** Automatic conversion from legacy "Name Format" dropdown to NAME sub-template
  - Old "SURNAME.Given" → `{SURNAME:upper}.{GIVEN}`
  - Old "Given SURNAME" → `{GIVEN} {SURNAME:upper}`
  - Old "SURNAME, Given" → `{SURNAME:upper}, {GIVEN}`
  - One-time migration on first load, preserves user preferences

### Technical Details

#### Architecture
- Single-file architecture maintained (no build process required)
- Pure JavaScript ES6+ (no framework dependencies)
- Bootstrap 5.3 for UI components
- localStorage for persistence
- Vanilla JavaScript string processing (efficient, modern)

#### Performance
- Sub-template processing: \u003c5ms per template
- Combined processing (DATE + PLACE + NAME): 6-15ms worst case
- Filename generation: Still \u003c10ms total (within NFR-PERF-2 target)
- Settings load: \u003c50ms (within NFR-PERF-4 target)
- Validation debounced to 500ms (prevents excessive processing)

#### Code Organization
- New `processSubTemplate()` function in Core Modules section
- New `validateTemplate()` function for syntax checking
- Extended `templateConfig` object in localStorage schema
- Event handlers for template input validation and auto-save

### Breaking Changes

⚠️ **MAJOR VERSION BUMP (1.x → 2.x)**

- **Template System Overhaul:** Hardcoded filename patterns replaced with sub-template system
- **localStorage Schema Change:** New fields added to `templateConfig` object
  - Existing saved settings will be migrated automatically (Story 1.10)
  - Users with custom templates should verify output after upgrade
- **Filename Format:** Default output format unchanged, but customization now possible
  - Users relying on hardcoded patterns should review sub-template defaults

### Migration Guide

**For Users Upgrading from v1.x:**

1. **Automatic Migration:** Legacy "Name Format" dropdown settings will be automatically converted to NAME sub-template on first load
2. **Verify Output:** Check generated filenames match your expectations
3. **Customize:** Use Settings section to adjust DATE, PLACE, NAME sub-templates to your preferences
4. **Reset if Needed:** Use "Reset to Defaults" button if migration produces unexpected results

**For Developers:**

- Review `docs/sprint-artifacts/tech-spec-epic-1.md` for complete technical specification
- See story files in `docs/sprint-artifacts/1-*.md` for implementation details
- Architecture documented in `docs/architecture.md`

### Known Limitations

- Conditional block syntax `{{ }}` mentioned in FR19 not yet implemented (deferred to post-MVP)
- No visual template builder/picker UI (future enhancement)
- No template export/import functionality (future enhancement)
- Desktop-only optimization (mobile support deferred per PRD)

### Epic 1 Retrospective

- **Stories Completed:** 12/12 (100%)
- **Retrospective:** See `docs/sprint-artifacts/epic-1-retro-2025-12-04.md`
- **Next Steps:** User validation sprint before Epic 2 (Enhanced Autocomplete Selection)

### Credits

Epic 1 delivered by the BMAD Method team:
- Bob (Scrum Master) - Sprint facilitation
- Alice (Product Owner) - Requirements validation
- Charlie (Senior Dev) - Technical implementation
- Dana (QA Engineer) - Quality assurance
- Elena (Junior Dev) - Feature development
- Eric (Stakeholder) - Product direction



### Added
- **GitHub Pages Support:** Added `index.html` redirect to enable GitHub Pages deployment at repository root
- **Conditional Syntax:** Template conditional syntax using `{{ placeholder }}` for optional content handling in filenames. Allows templates to gracefully handle missing data without displaying empty separators
- **All-Tags Support:** Complete template placeholder system including reverse format variants (`{RevPLACE}`, `{RevDATE}`) for genealogy-standard formatting
- **Multi-Person Template Integration:** `{AdditionalPeople}` placeholder with reusable `nameFormat` configuration for generating filenames that include spouse, children, witnesses, and other additional people in genealogy documents
- **Advanced Template Features:** Support for complex naming scenarios including marriage records, family documents, and multi-witness certificates

### Changed
- **Template System:** Enhanced template parser to support conditional syntax and multi-person data rendering
- **Settings Layout:** Added `nameFormat` template field in Settings > Layout for configurable multi-person name formatting

### Technical Details
- Conditional syntax parser implementation for template processing
- Enhanced `generateFilename()` function to support {AdditionalPeople} placeholder
- `formatAdditionalPeople()` helper function for multi-person name concatenation
- Full backward compatibility with existing templates and saved preferences

## [1.0.2] - 2025-10-12

### Fixed
- **Relationship Suggestion Buttons:** Fixed critical bug where clicking relationship suggestion buttons (e.g., "Add Spouse", "Add Parent") would fail to add the suggested person to the Additional People section. The `applySuggestion()` function was calling a non-existent `addAdditionalPerson()` function. Now properly adds people with correct relationship pre-selected and all name fields populated.

### Changed
- **Example Data:** Changed surname placeholder from "KEENER" to "DOE" to use generic example data

### Technical Details
- **Location:** `genealogy-filename-generator.html:3908-3910`
- **Root Cause:** Function call to undefined `addAdditionalPerson()`
- **Solution:** Direct array manipulation with `additionalPeople.push()`, `renderPersonRow()`, and `generateFilename()`

## [1.0.1] - 2025-10-12

### Changed
- **Filename:** Renamed main application file from `genealogy-filename-generator-bf.html` to `genealogy-filename-generator.html` for cleaner, more professional naming
- **Documentation:** Updated CONTRIBUTING.md to reference new filename (4 occurrences)

### Notes
- This is a non-breaking change - application functionality is identical to v1.0.0
- Users should download the new filename from the v1.0.1 release
- Git history preserves the rename for tracking purposes

## [1.0.0] - 2025-10-12

### Added
- Single-file static web application for genealogy filename generation
- GEDCOM (.ged) file parsing with support for 10,000+ individuals
- Intelligent autocomplete for surnames and given names from GEDCOM data
- Context-aware relationship-based suggestions (parents, siblings, spouse, children)
- Standardized filename generation: `[Type]_[Reverse.Place]_[Reverse.Date]_[SURNAME.Given.Middle]_[info].ext`
- International place format support (USA, Canada, UK, Germany, Australia, Generic)
- Flexible date input (genealogy formats: "Abt 1920", "Bet 1920 and 1922", precise YYYY-MM-DD)
- EXIFtool command generation with FHMWG-compliant metadata
- Multi-person document support with dynamic entry fields
- Family tree insights panel (statistics, date ranges, common surnames)
- One-click copy to clipboard for filenames and EXIF commands
- Reference guide for filename format and country codes
- Chunked GEDCOM processing for UI responsiveness (5000 lines per chunk)
- Bootstrap 5.3.0 responsive UI
- Zero-dependency architecture (vanilla JavaScript)
- Client-side only processing for privacy

### Documentation
- Comprehensive brownfield documentation suite generated via BMAD framework
- Product Requirements Document (PRD) for Level 2 project
- Architecture documentation
- Component inventory
- State management analysis
- Development guide
- Source tree analysis
- Project overview

### Technical
- No build process required (runs directly in browser)
- Browser compatibility: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- File size: ~240KB total (HTML + Bootstrap CDN)
- Performance: <10 seconds for 10,000+ individual GEDCOM files

## Versioning Scheme

This project uses [Semantic Versioning](https://semver.org/):

**MAJOR.MINOR.PATCH**

- **MAJOR**: Incompatible changes (breaking changes to filename format, GEDCOM parsing, or core functionality)
- **MINOR**: New features added in backward-compatible manner (new metadata fields, additional place formats, UI enhancements)
- **PATCH**: Backward-compatible bug fixes (parsing errors, UI glitches, performance improvements)

### Examples:
- `1.0.0` → `1.0.1`: Fix autocomplete bug (PATCH)
- `1.0.1` → `1.1.0`: Add new country format (MINOR)
- `1.1.0` → `2.0.0`: Change filename delimiter from `_` to `-` (MAJOR - breaks existing filenames)

### Development Guidelines

For detailed information on the development process:
- **Git Workflow:** See [GIT-FLOW.md](GIT-FLOW.md) for branching strategy and release process
- **Contributing:** See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines and code standards
- **Technical Decisions:** See [docs/technical-decisions.md](docs/technical-decisions.md) for architectural choices and rationale
