// Story 1.2 - Format Modifier Engine - Test Suite
// Extracted from genealogy-filename-generator.html for Node.js testing

// ============================================================================
// SUB-TEMPLATE PROCESSOR - CORE ENGINE (Story 1.1) + ENHANCEMENTS (Story 1.2)
// ============================================================================
// Processes template strings with placeholders and returns formatted output.
// Supports:
// - Placeholder replacement: {YYYY}, {MM}, {GIVEN}, etc.
// - Format modifiers: {PLACEHOLDER:modifier} where modifier is :upper, :lower, :title, :abbrev
// - Multiple modifiers (AC #8): {PLACEHOLDER:mod1:mod2:mod3} applies only LAST modifier
// - Case-insensitive modifiers (AC #6): :UPPER, :upper, :Upper all work the same
// - Invalid modifier handling (AC #7): Logs warning, returns original value

function processSubTemplate(template, data, options = {}) {
    // Default options
    const { missingValueHandler = 'x', caseSensitive = false } = options;

    if (!template || typeof template !== 'string') return '';

    let result = template;

    // Regex pattern for matching placeholders: {PLACEHOLDER} or {PLACEHOLDER:modifier} or {PLACEHOLDER:mod1:mod2:...}
    // Captures: [1] = placeholder name, [2] = optional modifier chain (without leading colon)
    // Note: Modifiers are case-insensitive, so we accept [a-zA-Z]+ and convert to lowercase
    const placeholderRegex = /\{([A-Z]+)(?::([a-zA-Z:]+))?\}/g;

    // Replace all placeholders in the template
    result = result.replace(placeholderRegex, (match, placeholder, modifier) => {
        // Map placeholder names to data keys (YYYY → year, MM → month, etc.)
        const keyMap = {
            // Date placeholders
            'YYYY': 'year',
            'YY': 'year',
            'MM': 'month',
            'M': 'month',
            'DD': 'day',
            'D': 'day',
            // Place placeholders
            'COUNTRY': 'country',
            'C': 'country',
            'STATE': 'state',
            'S': 'state',
            'COUNTY': 'county',
            'CO': 'county',
            'CITY': 'city',
            'CI': 'city',
            // Name placeholders
            'SURNAME': 'surname',
            'GIVEN': 'given',
            'MIDDLE': 'middle',
            // Additional placeholders for testing
            'NAME': 'name'
        };

        const dataKey = keyMap[placeholder];

        // If placeholder not recognized, log warning and preserve
        if (!dataKey) {
            console.warn(`Unknown placeholder: ${placeholder}`);
            return match;
        }

        // Get value from data object
        let value = data[dataKey];

        // Handle missing/null/undefined/empty values
        if (value === null || value === undefined || value === '') {
            return missingValueHandler;
        }

        // Convert to string
        value = String(value);

        // Apply padding rules for date placeholders
        if ((placeholder === 'MM' || placeholder === 'DD') && !isNaN(value)) {
            value = String(value).padStart(2, '0');
        } else if ((placeholder === 'YY') && !isNaN(value)) {
            // Extract last 2 digits of year
            const yearNum = parseInt(value);
            value = String(yearNum % 100).padStart(2, '0');
        }

        // Apply format modifiers if present
        if (modifier) {
            // Handle multiple modifiers separated by colons (e.g., "upper:lower:title")
            // AC #8: Apply only the LAST modifier in the chain
            const modifiers = modifier.split(':');
            const lastModifier = modifiers[modifiers.length - 1];
            value = applyModifier(value, lastModifier);
        }

        return value;
    });

    return result;
}

// Helper function to apply format modifiers (Story 1.2)
// Applies text transformation modifiers to placeholder values
// Supports: :upper, :lower, :title, :abbrev
// AC #6: Case-insensitive modifier matching (all case variants work the same)
// AC #7: Invalid modifiers logged with console.warn(), original value returned unchanged
function applyModifier(value, modifier) {
    if (!modifier || !value) return value;

    // AC #6: Convert modifier to lowercase for case-insensitive matching
    const mod = modifier.toLowerCase();

    switch (mod) {
        case 'upper':
            // AC #2: Convert text to uppercase
            return value.toUpperCase();
        case 'lower':
            // AC #3: Convert text to lowercase
            return value.toLowerCase();
        case 'title':
            // AC #4: Convert text to title case (capitalize first letter of each word)
            return toTitleCase(value);
        case 'abbrev':
            // AC #5: Take first letter only and uppercase it
            return value.charAt(0).toUpperCase();
        default:
            // AC #7: Invalid modifiers logged but don't crash, return original value
            console.warn(`Unknown modifier: ${modifier}`);
            return value;
    }
}

// Helper function for title case conversion (Story 1.2 - AC #4)
// Converts a string to title case by capitalizing first letter of each word
// Example: "john william" → "John William"
function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}

// ============================================================================
// TEST SUITE - Story 1.2 Format Modifier Engine
// ============================================================================

function runProcessSubTemplateTests() {
    console.log('\n=== Running processSubTemplate() Test Suite (Story 1.2) ===\n');

    const tests = [];
    let passCount = 0;
    let failCount = 0;

    // Test 21: Case-insensitive modifier matching - :UPPER (AC #6)
    try {
        const result = processSubTemplate('{GIVEN:UPPER}', { given: 'john' });
        const expected = 'JOHN';
        if (result === expected) {
            console.log('✓ Test 21 PASS: Case-insensitive modifier :UPPER');
            console.log(`  Input: {GIVEN:UPPER} → Output: "${result}"`);
            passCount++;
        } else {
            console.error(`✗ Test 21 FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ Test 21 ERROR:', e.message);
        failCount++;
    }

    // Test 22: Case-insensitive modifier matching - :Upper (AC #6)
    try {
        const result = processSubTemplate('{GIVEN:Upper}', { given: 'john' });
        const expected = 'JOHN';
        if (result === expected) {
            console.log('✓ Test 22 PASS: Case-insensitive modifier :Upper');
            console.log(`  Input: {GIVEN:Upper} → Output: "${result}"`);
            passCount++;
        } else {
            console.error(`✗ Test 22 FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ Test 22 ERROR:', e.message);
        failCount++;
    }

    // Test 23: Case-insensitive modifier matching - :LOWER (AC #6)
    try {
        const result = processSubTemplate('{SURNAME:LOWER}', { surname: 'SMITH' });
        const expected = 'smith';
        if (result === expected) {
            console.log('✓ Test 23 PASS: Case-insensitive modifier :LOWER');
            console.log(`  Input: {SURNAME:LOWER} → Output: "${result}"`);
            passCount++;
        } else {
            console.error(`✗ Test 23 FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ Test 23 ERROR:', e.message);
        failCount++;
    }

    // Test 24: Case-insensitive modifier matching - :TITLE (AC #6)
    try {
        const result = processSubTemplate('{GIVEN:TITLE}', { given: 'john william' });
        const expected = 'John William';
        if (result === expected) {
            console.log('✓ Test 24 PASS: Case-insensitive modifier :TITLE');
            console.log(`  Input: {GIVEN:TITLE} → Output: "${result}"`);
            passCount++;
        } else {
            console.error(`✗ Test 24 FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ Test 24 ERROR:', e.message);
        failCount++;
    }

    // Test 25: Case-insensitive modifier matching - :ABBREV (AC #6)
    try {
        const result = processSubTemplate('{GIVEN:ABBREV}', { given: 'john' });
        const expected = 'J';
        if (result === expected) {
            console.log('✓ Test 25 PASS: Case-insensitive modifier :ABBREV');
            console.log(`  Input: {GIVEN:ABBREV} → Output: "${result}"`);
            passCount++;
        } else {
            console.error(`✗ Test 25 FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ Test 25 ERROR:', e.message);
        failCount++;
    }

    // Test 26: Invalid modifier handling (AC #7) - console.warn() should be called
    try {
        const originalWarn = console.warn;
        let warnCalled = false;
        let warnMessage = '';
        console.warn = function(msg) {
            warnCalled = true;
            warnMessage = msg;
            originalWarn.apply(console, arguments);
        };

        // Fixed: Use valid placeholder {SURNAME} with invalid modifier :invalid
        // Previous test used {NAME:invalid} which is an unknown placeholder, not a modifier test
        const result = processSubTemplate('{SURNAME:invalid}', { surname: 'Smith' });

        console.warn = originalWarn;

        // Should return original value and log warning
        if (result === 'Smith' && warnCalled && warnMessage.includes('Unknown modifier')) {
            console.log('✓ Test 26 PASS: Invalid modifier handling');
            console.log(`  Invalid modifier :invalid → Original value returned: "${result}"`);
            console.log(`  Warning logged: "${warnMessage}"`);
            passCount++;
        } else {
            console.error(`✗ Test 26 FAIL: Invalid modifier not handled correctly (result: "${result}", warnCalled: ${warnCalled})`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ Test 26 ERROR:', e.message);
        failCount++;
    }

    // Test 27: Multiple modifier chain - only last modifier applied (AC #8)
    try {
        const result = processSubTemplate('{GIVEN:upper:lower}', { given: 'john' });
        const expected = 'john';
        if (result === expected) {
            console.log('✓ Test 27 PASS: Multiple modifier chain - last modifier applied');
            console.log(`  Input: {GIVEN:upper:lower} → Only :lower applied → Output: "${result}"`);
            passCount++;
        } else {
            console.error(`✗ Test 27 FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ Test 27 ERROR:', e.message);
        failCount++;
    }

    // Test 28: Multiple modifier chain - 3 modifiers, last applied (AC #8)
    try {
        const result = processSubTemplate('{GIVEN:upper:lower:title}', { given: 'john smith' });
        const expected = 'John Smith';
        if (result === expected) {
            console.log('✓ Test 28 PASS: Multiple modifier chain (3 modifiers) - last applied');
            console.log(`  Input: {GIVEN:upper:lower:title} → Only :title applied → Output: "${result}"`);
            passCount++;
        } else {
            console.error(`✗ Test 28 FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ Test 28 ERROR:', e.message);
        failCount++;
    }

    // Test 29: Edge case - modifier with empty string value (AC #7)
    try {
        const result = processSubTemplate('{GIVEN:upper}', { given: '' });
        const expected = 'x';
        if (result === expected) {
            console.log('✓ Test 29 PASS: Modifier with empty string (uses missing value handler)');
            console.log(`  Empty given="" → falls back to missing value "x"`);
            passCount++;
        } else {
            console.error(`✗ Test 29 FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ Test 29 ERROR:', e.message);
        failCount++;
    }

    // Test 30: Edge case - modifier with special characters (AC #7)
    try {
        const result = processSubTemplate('{GIVEN:title}', { given: "o'brien" });
        const expected = "O'brien";
        if (result === expected) {
            console.log('✓ Test 30 PASS: Modifier with special characters (apostrophe)');
            console.log(`  Input: "o'brien" with :title → Output: "${result}"`);
            passCount++;
        } else {
            console.error(`✗ Test 30 FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ Test 30 ERROR:', e.message);
        failCount++;
    }

    // Test 31: Edge case - modifier with numbers in value (AC #7)
    try {
        const result = processSubTemplate('{GIVEN:title}', { given: 'john 123' });
        const expected = 'John 123';
        if (result === expected) {
            console.log('✓ Test 31 PASS: Modifier with numbers in value');
            console.log(`  Input: "john 123" with :title → Output: "${result}"`);
            passCount++;
        } else {
            console.error(`✗ Test 31 FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ Test 31 ERROR:', e.message);
        failCount++;
    }

    // Test 32: Modifier with single letter word (AC #5)
    try {
        const result = processSubTemplate('{GIVEN:abbrev}', { given: 'a' });
        const expected = 'A';
        if (result === expected) {
            console.log('✓ Test 32 PASS: Abbrev modifier with single character');
            console.log(`  Input: "a" with :abbrev → Output: "${result}"`);
            passCount++;
        } else {
            console.error(`✗ Test 32 FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ Test 32 ERROR:', e.message);
        failCount++;
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`TEST RESULTS: ${passCount} passed, ${failCount} failed`);
    console.log(`Pass rate: ${(passCount / (passCount + failCount) * 100).toFixed(1)}%`);
    console.log('='.repeat(50) + '\n');

    return { passCount, failCount, total: passCount + failCount };
}

// Run tests
const testResults = runProcessSubTemplateTests();

// Export for Jest if needed
module.exports = { processSubTemplate, applyModifier, toTitleCase, runProcessSubTemplateTests, testResults };
