# Genealogy Filename Generator

**Version 1.0.3** | A specialized tool for genealogists to generate standardized filenames and metadata commands for genealogy documents.

## Overview

The Genealogy Filename Generator is a static web application that helps genealogists organize their digital archives with standardized, meaningful filenames. It parses GEDCOM family tree files to provide intelligent, context-aware suggestions for file naming and metadata tagging using EXIFtool standards.

### Key Features

- **Standardized Filename Generation** - Creates consistent, meaningful filenames following genealogy best practices
- **GEDCOM File Support** - Parses GEDCOM (.ged) files with support for 10,000+ individuals
- **Intelligent Autocomplete** - Context-aware suggestions for surnames, given names, places, and relationships
- **EXIFtool Command Generation** - Creates FHMWG-compliant metadata commands for your genealogy documents
- **Multi-Person Documents** - Support for documents with multiple people (e.g., marriage certificates)
- **International Place Formats** - Support for USA, Canada, UK, Germany, Australia, and generic formats
- **Privacy-First** - All processing happens in your browser; your GEDCOM data never leaves your computer
- **Zero Setup** - Single HTML file, no installation or build process required

### Example Filename

```
Birth_USA.Ohio.Medina-County.Wadsworth_1922.01.04_KEENER.Jane.Alma_Birth-Certificate.jpg
```

Following the pattern:
```
[Type]_[Reverse.Place]_[Reverse.Date]_[SURNAME.Given.Middle]_[info].ext
```

## Quick Start

### For Users

1. Download `genealogy-filename-generator.html` from the [latest release](../../releases)
2. Open the file in any modern web browser (Chrome, Firefox, Safari, Edge)
3. (Optional) Upload your GEDCOM file for intelligent autocomplete suggestions
4. Fill in the form fields with your document details
5. Copy the generated filename or EXIFtool command

That's it! No installation, no dependencies, no server required.

### Browser Requirements

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Internet Explorer is not supported (requires ES6+).

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
- **Current Version**: 1.0.3
- **Last Updated**: 2025-11-15

## Support

For issues, questions, or contributions, please refer to:

- [Issues](../../issues) - Report bugs or request features
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [Documentation](docs/) - Comprehensive project documentation

## Development Framework

This project uses the **BMAD (Business Model & Development)** methodology for structured workflows, documentation generation, and quality assurance. See the `bmad/` directory for development tooling.

---

**Made with care for the genealogy community**
