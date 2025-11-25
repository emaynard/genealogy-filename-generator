/**
 * Unit Tests for Story 1.5: NAME Sub-template Implementation
 *
 * Tests for:
 * - parseNameInput(): Parse name strings in various formats
 * - processNameSubtemplate(): Process name templates with placeholders
 * - Format modifier support (:upper, :lower, :title, :abbrev)
 * - Default template behavior
 * - Missing name components (use 'x' placeholder)
 * - Integration with processSubTemplate() from Story 1.1
 */

function runStory15Tests() {
    console.log('\n=== Running Story 1.5: NAME Sub-template Implementation Tests ===\n');

    let passed = 0;
    let failed = 0;

    /**
     * Test Helper: Assert equality
     */
    function assert(actual, expected, testName) {
        if (actual === expected) {
            console.log(`✓ PASS: ${testName}`);
            console.log(`  Result: "${actual}"`);
            passed++;
        } else {
            console.log(`✗ FAIL: ${testName}`);
            console.log(`  Expected: "${expected}"`);
            console.log(`  Got: "${actual}"`);
            failed++;
        }
    }

    // ========================================
    // AC-2: Test parseNameInput() function
    // ========================================
    console.log('\n### AC-2: parseNameInput() - Parse Name Strings ###\n');

    // Full name with three parts: "John Robert Smith"
    (() => {
        const result = parseNameInput('John Robert Smith');
        const expected = '{"surname":"Smith","given":"John","middle":"Robert"}';
        const actual = JSON.stringify(result);
        assert(actual, expected, 'AC-2: Parse full name (Given Middle Surname)');
    })();

    // Two-part name: "John Smith"
    (() => {
        const result = parseNameInput('John Smith');
        const expected = '{"surname":"Smith","given":"John","middle":"x"}';
        const actual = JSON.stringify(result);
        assert(actual, expected, 'AC-2: Parse two-part name (Given Surname)');
    })();

    // Single name: "John"
    (() => {
        const result = parseNameInput('John');
        const expected = '{"surname":"x","given":"John","middle":"x"}';
        const actual = JSON.stringify(result);
        assert(actual, expected, 'AC-2: Parse single name (Given only)');
    })();

    // Four-part name (e.g., "Mary Ann Louise Smith")
    (() => {
        const result = parseNameInput('Mary Ann Louise Smith');
        const expected = '{"surname":"Smith","given":"Mary","middle":"Ann Louise"}';
        const actual = JSON.stringify(result);
        assert(actual, expected, 'AC-2: Parse four-part name (combine middle names)');
    })();

    // Empty name string
    (() => {
        const result = parseNameInput('');
        const expected = '{"surname":"x","given":"x","middle":"x"}';
        const actual = JSON.stringify(result);
        assert(actual, expected, 'AC-2: Parse empty name string');
    })();

    // ========================================
    // AC-3,4: Test processNameSubtemplate()
    // ========================================
    console.log('\n### AC-3,4: processNameSubtemplate() - Process Name Templates ###\n');

    // AC-3: "John Smith" with template "{SURNAME:upper}.{GIVEN}" → "SMITH.John"
    (() => {
        const result = processNameSubtemplate('John Smith', '{SURNAME:upper}.{GIVEN}');
        assert(result, 'SMITH.John', 'AC-3: Template with modifier - "{SURNAME:upper}.{GIVEN}"');
    })();

    // AC-4: "John Smith" with template "{GIVEN} {SURNAME}" → "John Smith"
    (() => {
        const result = processNameSubtemplate('John Smith', '{GIVEN} {SURNAME}');
        assert(result, 'John Smith', 'AC-4: Template without modifiers - "{GIVEN} {SURNAME}"');
    })();

    // AC-5: "John Robert Smith" with template "{SURNAME:upper}.{GIVEN}.{MIDDLE:abbrev}" → "SMITH.John.R"
    (() => {
        const result = processNameSubtemplate('John Robert Smith', '{SURNAME:upper}.{GIVEN}.{MIDDLE:abbrev}');
        assert(result, 'SMITH.John.R', 'AC-5: Template with middle name abbreviation');
    })();

    // ========================================
    // AC-6: Missing name components
    // ========================================
    console.log('\n### AC-6: Missing Name Components - Use "x" Placeholder ###\n');

    // AC-6: Missing middle name
    (() => {
        const result = processNameSubtemplate('John Smith', '{SURNAME:upper}.{GIVEN}.{MIDDLE}');
        assert(result, 'SMITH.John.x', 'AC-6: Missing middle name component');
    })();

    // AC-6: Missing surname (single name)
    (() => {
        const result = processNameSubtemplate('John', '{SURNAME:upper}.{GIVEN}');
        assert(result, 'x.John', 'AC-6: Missing surname component');
    })();

    // AC-6: All missing (empty name)
    (() => {
        const result = processNameSubtemplate('', '{SURNAME}.{GIVEN}.{MIDDLE}');
        assert(result, 'x.x.x', 'AC-6: All components missing');
    })();

    // ========================================
    // AC-7: Default template behavior
    // ========================================
    console.log('\n### AC-7: Default Template Behavior ###\n');

    // AC-7: Empty template uses default
    (() => {
        const result = processNameSubtemplate('John Smith', '');
        assert(result, 'SMITH.John', 'AC-7: Empty template uses default "{SURNAME:upper}.{GIVEN}"');
    })();

    // AC-7: Null template uses default
    (() => {
        const result = processNameSubtemplate('John Smith', null);
        assert(result, 'SMITH.John', 'AC-7: Null template uses default');
    })();

    // ========================================
    // AC-8: Format modifiers on name components
    // ========================================
    console.log('\n### AC-8: Format Modifiers on Name Components ###\n');

    // AC-8: {SURNAME:upper}
    (() => {
        const result = processNameSubtemplate('John smith', '{SURNAME:upper}');
        assert(result, 'SMITH', 'AC-8: Format modifier :upper on surname');
    })();

    // AC-8: {GIVEN:lower}
    (() => {
        const result = processNameSubtemplate('JOHN Smith', '{GIVEN:lower}');
        assert(result, 'john', 'AC-8: Format modifier :lower on given name');
    })();

    // AC-8: {SURNAME:title}
    (() => {
        const result = processNameSubtemplate('john smith', '{SURNAME:title}');
        assert(result, 'Smith', 'AC-8: Format modifier :title on surname');
    })();

    // AC-8: {MIDDLE:abbrev}
    (() => {
        const result = processNameSubtemplate('John Robert Smith', '{MIDDLE:abbrev}');
        assert(result, 'R', 'AC-8: Format modifier :abbrev on middle name');
    })();

    // AC-8: Multiple components with mixed modifiers
    (() => {
        const result = processNameSubtemplate('john robert smith', '{SURNAME:upper}.{GIVEN:title}.{MIDDLE:lower}');
        assert(result, 'SMITH.John.robert', 'AC-8: Multiple components with different modifiers');
    })();

    // ========================================
    // AC-1: Integration with generateFilename()
    // ========================================
    console.log('\n### Integration: NAME Sub-template in Filename Generation ###\n');

    // Simulate form inputs
    (() => {
        if (typeof elements !== 'undefined' && elements.surname && elements.givenName) {
            // Set up test data
            elements.surname.value = 'Smith';
            elements.givenName.value = 'John';
            elements.middleName.value = 'Robert';
            userSettings.nameSubtemplate = '{SURNAME:upper}.{GIVEN}';

            // Call getFormattedName() which now uses processNameSubtemplate
            const result = getFormattedName();

            // Result should be "SMITH.John" (formatted for filename)
            assert(result, 'SMITH.John', 'Integration: NAME sub-template in filename generation');
        } else {
            console.log('⊘ SKIP: Integration test (DOM elements not available)');
        }
    })();

    // Test with {NAME} placeholder in custom template
    (() => {
        if (typeof elements !== 'undefined' && elements.surname && elements.filenameTemplate) {
            // Set up test data
            elements.surname.value = 'Doe';
            elements.givenName.value = 'Jane';
            elements.middleName.value = '';
            userSettings.nameSubtemplate = '{GIVEN} {SURNAME:upper}';
            userSettings.filenameTemplate = '{NAME}';
            userSettings.useCustomTemplate = true;

            // Call parseFilenameTemplate()
            const result = parseFilenameTemplate('{NAME}');

            // Result should be "Jane-DOE" (formatted for filename with spaces replaced)
            assert(result, 'Jane-DOE', 'Integration: {NAME} placeholder in custom template');
        } else {
            console.log('⊘ SKIP: Integration test with {NAME} placeholder (DOM elements not available)');
        }
    })();

    // ========================================
    // Edge Cases
    // ========================================
    console.log('\n### Edge Cases ###\n');

    // Names with extra spaces
    (() => {
        const result = processNameSubtemplate('  John   Robert   Smith  ', '{SURNAME:upper}.{GIVEN}');
        assert(result, 'SMITH.John', 'Edge case: Names with extra spaces');
    })();

    // Names with hyphens (should be preserved in surname)
    (() => {
        const result = processNameSubtemplate('Mary Jane Smith-Jones', '{SURNAME:upper}.{GIVEN}');
        assert(result, 'SMITH-JONES.Mary', 'Edge case: Hyphenated surname');
    })();

    // ========================================
    // Test Summary
    // ========================================
    console.log(`\n========================================`);
    console.log(`Test Summary: ${passed} passed, ${failed} failed`);
    console.log(`========================================\n`);

    return { passed, failed };
}

// Run tests if running in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runStory15Tests };
}
