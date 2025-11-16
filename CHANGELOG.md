# Changelog

All notable changes to the Genealogy Filename Generator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.3] - 2025-11-15

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
