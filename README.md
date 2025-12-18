# Genealogy Filename Generator

**Version 2.0.0** | A specialized tool for genealogists to generate standardized, customizable filenames and metadata commands for genealogy documents.

## Overview

The Genealogy Filename Generator is a static web application that helps genealogists organize their digital archives with standardized, meaningful filenames. It parses GEDCOM family tree files to provide intelligent, context-aware suggestions for file naming and metadata tagging using EXIFtool standards.

### Key Features

- **🎨 Customizable Sub-templates (NEW in v2.0)** - Full control over date, place, and name formatting patterns
- **✨ Format Modifiers (NEW in v2.0)** - Apply `:upper`, `:lower`, `:title`, `:abbrev` transformations to any field
- **⚙️ Template Configuration UI (NEW in v2.0)** - Visual editor with validation, hints, and real-time preview
- **Standardized Filename Generation** - Creates consistent, meaningful filenames following genealogy best practices
- **GEDCOM File Support** - Parses GEDCOM (.ged) files with support for 10,000+ individuals
- **Intelligent Autocomplete** - Context-aware suggestions for surnames, given names, places, and relationships
- **EXIFtool Command Generation** - Creates FHMWG-compliant metadata commands for your genealogy documents
- **Multi-Person Documents** - Support for documents with multiple people (e.g., marriage certificates)
- **International Place Formats** - Support for USA, Canada, UK, Germany, Australia, and generic formats
- **Privacy-First** - All processing happens in your browser; your GEDCOM data never leaves your computer
- **Zero Setup** - Single HTML file, no installation or build process required

### Example Filenames

**Default Format (v2.0):**
```
Birth_USA.Ohio.Medina-County.Wadsworth_1922.01.04_DOE.Jane.Alma_Birth-Certificate.jpg
```

**Custom Format Examples (NEW - Fully Customizable):**
```
# European date format: DD-MM-YYYY
Birth_USA.Ohio.Medina-County.Wadsworth_04-01-1922_DOE.Jane.Alma_Birth-Certificate.jpg

# Abbreviated place: City, State
Birth_Wadsworth, Ohio_1922.01.04_DOE.Jane.Alma_Birth-Certificate.jpg

# Given name first: Given SURNAME
Birth_USA.Ohio.Medina-County.Wadsworth_1922.01.04_Jane DOE_Birth-Certificate.jpg
```

Following the customizable pattern:
```
[Type]_[PLACE]_[DATE]_[NAME]_[info].ext

Where:
  DATE = Your custom date sub-template (e.g., {YYYY}.{MM}.{DD} or {DD}-{MM}-{YYYY})
  PLACE = Your custom place sub-template (e.g., {CITY}, {STATE} or {COUNTRY}.{STATE}.{CITY})
  NAME = Your custom name sub-template (e.g., {SURNAME:upper}.{GIVEN} or {GIVEN} {SURNAME})
```

## Quick Start

### GitHub Pages (Easiest)

1. Visit the [Genealogy Filename Generator](https://emaynard.github.io/genealogy-filename-generator/) hosted version
2. (Optional) Upload your GEDCOM file for intelligent autocomplete suggestions
3. Fill in the form fields with your document details
4. Copy the generated filename or EXIFtool command

No installation, no dependencies, no server setup required. Works entirely in your browser.

### Local Install

Prefer to download and run locally?

1. Download `genealogy-filename-generator.html` from the [latest release](../../releases)
2. Open the file in any modern web browser (Chrome, Firefox, Safari, Edge)
3. (Optional) Upload your GEDCOM file for intelligent autocomplete suggestions
4. Fill in the form fields with your document details
5. Copy the generated filename or EXIFtool command

### Browser Requirements

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Internet Explorer is not supported (requires ES6+).

## What's New in v2.0

### 🎨 Sub-template Formatting System

Version 2.0 introduces a revolutionary **composable sub-template architecture** that gives you complete control over filename formatting:

#### DATE Sub-template
Customize how dates appear using placeholders:
- `{YYYY}` - 4-digit year (2024)
- `{YY}` - 2-digit year (24)
- `{MM}` - Zero-padded month (03)
- `{M}` - Month without padding (3)
- `{DD}` - Zero-padded day (05)
- `{D}` - Day without padding (5)

**Examples:**
- `{YYYY}.{MM}.{DD}` → `2024.03.05` (default)
- `{DD}-{MM}-{YYYY}` → `05-03-2024` (European)
- `{M}/{D}/{YY}` → `3/5/24` (US short)

#### PLACE Sub-template
Control place hierarchy and formatting:
- `{COUNTRY}` or `{C}` - Country name/abbreviation
- `{STATE}` or `{S}` - State/Province
- `{COUNTY}` or `{CO}` - County
- `{CITY}` or `{CI}` - City/Town

**Examples:**
- `{COUNTRY}.{STATE}.{COUNTY}.{CITY}` → `USA.Ohio.Medina-County.Wadsworth` (default)
- `{CITY}, {STATE}` → `Wadsworth, Ohio`
- `{C}.{S}` → `USA.OH` (abbreviated)

#### NAME Sub-template
Format names exactly how you want:
- `{SURNAME}` - Surname/family name
- `{GIVEN}` - Given/first name
- `{MIDDLE}` - Middle name

**Examples:**
- `{SURNAME:upper}.{GIVEN}` → `DOE.Jane` (default)
- `{GIVEN} {SURNAME}` → `Jane DOE`
- `{SURNAME:upper}, {GIVEN} {MIDDLE:abbrev}` → `DOE, Jane A`

#### Format Modifiers
Apply text transformations to any placeholder:
- `:upper` - UPPERCASE
- `:lower` - lowercase
- `:title` - Title Case
- `:abbrev` - First letter only

**Examples:**
- `{SURNAME:upper}` → `SMITH`
- `{GIVEN:title}` → `John Doe`
- `{MIDDLE:abbrev}` → `J`

### Template Configuration UI

- Visual editor in Settings section
- Real-time validation with helpful error messages
- Placeholder hints and tooltips
- "Reset to Defaults" button
- Auto-saves to Browser localStorage

### Migration from v1.x

Existing users will have their settings automatically migrated:
- Legacy "Name Format" dropdown → NAME sub-template
- All saved preferences preserved
- Default behavior unchanged (unless you customize)

## Features in Detail

### GEDCOM Processing

- Parses GEDCOM 5.5 format files
- Extracts individuals, families, and relationships
- Builds relationship graph with confidence scores
- Provides family tree statistics and insights
- Chunked processing for UI responsiveness (5000 lines per chunk)

### Intelligent Suggestions

- **Surname autocomplete** from your GEDCOM data
- **Given name suggestions** based on selected surname
- **Context-aware relationships** - suggests parents, siblings, spouse, children
- **Place suggestions** from your family tree
- **Event type suggestions** - Birth, Marriage, Death, Census, etc.

### EXIF Metadata

Generates EXIFtool commands for embedding metadata into your files:

- FHMWG (Family History Metadata Working Group) compliant
- Essential genealogy metadata fields
- Customizable additional metadata (title, description, creator, copyright)
- File-type optimized (.jpg, .pdf, .tiff, etc.)

### International Support

Choose from multiple place format options:

- **USA**: City, County, State, Country
- **Canada**: City, Province, Country
- **UK**: Town, County, Country
- **Germany**: City, State, Country
- **Australia**: Town, State, Country
- **Generic**: Flexible custom format

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Project Overview](docs/project-overview.md)** - Project purpose, features, and architecture
- **[Architecture Documentation](docs/architecture.md)** - Technical architecture and design decisions
- **[Development Guide](docs/development-guide.md)** - Setup and development instructions
- **[Component Inventory](docs/component-inventory.md)** - UI components catalog
- **[State Management](docs/state-management.md)** - State management patterns
- **[Git Workflow](docs/git-workflow.md)** - Branching strategy and release process
- **[Technical Decisions](docs/technical-decisions.md)** - Architectural choices and rationale

## Technology Stack

- **HTML5** - Document structure
- **CSS3** - Custom styles
- **JavaScript ES6+** - Application logic (vanilla, no frameworks)
- **Bootstrap 5.3.0** - Responsive UI framework
- **Bootstrap Icons 1.11.3** - Icon system

### Architecture

- **Type**: Single-Page Application (SPA)
- **Deployment**: Static file hosting
- **Build Process**: None (runs directly in browser)
- **Dependencies**: 2 external CDN resources (Bootstrap CSS & Icons)
- **File Size**: ~240KB total (including CDN resources)

## Performance

- **GEDCOM Processing**: <10 seconds for 10,000+ individual files
- **Filename Generation**: <10ms
- **Autocomplete Filtering**: <50ms (debounced 300ms)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Code of conduct
- Development setup
- Coding standards
- Pull request process
- Issue reporting guidelines

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a complete history of changes, including:

- New features
- Bug fixes
- Breaking changes
- Technical improvements

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes to filename format, GEDCOM parsing, or core functionality
- **MINOR**: New features added in backward-compatible manner
- **PATCH**: Backward-compatible bug fixes

## Standards Compliance

- **GEDCOM 5.5** - Family tree file format
- **FHMWG** - Family History Metadata Working Group standards
- **EXIFtool** - Metadata embedding tool compatibility

## License

[License information to be added]

## Project Status

- **Status**: Functional, production-ready
- **Current Version**: 2.0.0
- **Last Updated**: 2025-12-04
- **Latest Release**: Epic 1 - Sub-template Formatting System complete

## Support

For issues, questions, or contributions, please refer to:

- [Issues](../../issues) - Report bugs or request features
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [Documentation](docs/) - Comprehensive project documentation

## Development Framework

This project uses the **BMAD (Business Model & Development)** methodology for structured workflows, documentation generation, and quality assurance. See the `bmad/` directory for development tooling.

---

**Made with care for the genealogy community**
