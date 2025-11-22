// Story 1.3 - DATE Sub-template Implementation - Test Suite
// Extracted from genealogy-filename-generator.html for Node.js testing

// ============================================================================
// SUB-TEMPLATE PROCESSOR (Story 1.1) - Required for Story 1.3 tests
// ============================================================================

function processSubTemplate(template, data, options = {}) {
    const { missingValueHandler = 'x', caseSensitive = false } = options;
    if (!template || typeof template !== 'string') return '';

    let result = template;
    const placeholderRegex = /\{([A-Z]+)(?::([a-zA-Z:]+))?\}/g;

    result = result.replace(placeholderRegex, (match, placeholder, modifier) => {
        const keyMap = {
            'YYYY': 'year', 'YY': 'year', 'MM': 'month', 'M': 'month',
            'DD': 'day', 'D': 'day', 'COUNTRY': 'country', 'C': 'country',
            'STATE': 'state', 'S': 'state', 'COUNTY': 'county', 'CO': 'county',
            'CITY': 'city', 'CI': 'city', 'SURNAME': 'surname', 'GIVEN': 'given', 'MIDDLE': 'middle'
        };

        const dataKey = keyMap[placeholder];
        if (!dataKey) {
            console.warn(`Unknown placeholder: ${placeholder}`);
            return match;
        }

        let value = data[dataKey];
        if (value === null || value === undefined || value === '') {
            return missingValueHandler;
        }

        value = String(value);

        if ((placeholder === 'MM' || placeholder === 'DD') && !isNaN(value)) {
            value = String(value).padStart(2, '0');
        } else if ((placeholder === 'YY') && !isNaN(value)) {
            const yearNum = parseInt(value);
            value = String(yearNum % 100).padStart(2, '0');
        }

        if (modifier) {
            const modifiers = modifier.split(':');
            const lastModifier = modifiers[modifiers.length - 1];
            value = applyModifier(value, lastModifier);
        }

        return value;
    });

    return result;
}

function applyModifier(value, modifier) {
    if (!modifier || !value) return value;
    const mod = modifier.toLowerCase();
    switch (mod) {
        case 'upper':
            return value.toUpperCase();
        case 'lower':
            return value.toLowerCase();
        case 'title':
            return toTitleCase(value);
        case 'abbrev':
            return value.charAt(0).toUpperCase();
        default:
            console.warn(`Unknown modifier: ${modifier}`);
            return value;
    }
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}

// ============================================================================
// DATE SUB-TEMPLATE PROCESSOR (Story 1.3)
// ============================================================================

function parseDateInput(dateString) {
    if (!dateString || dateString.trim() === '') {
        return { year: 'x', month: 'x', day: 'x' };
    }

    const trimmed = dateString.trim();
    let year = 'x', month = 'x', day = 'x';

    // Handle ISO format: YYYY-MM-DD
    if (trimmed.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const parts = trimmed.split('-');
        year = parts[0];
        month = parts[1];
        day = parts[2];
        return { year, month, day };
    }

    // Handle partial dates: YYYY-MM or YYYY
    if (trimmed.match(/^\d{4}(-\d{2})?$/)) {
        const parts = trimmed.split('-');
        year = parts[0];
        month = (parts[1]) ? parts[1] : 'x';
        day = 'x';
        return { year, month, day };
    }

    // Handle genealogical formats: "Abt 1850", "Bef 1900-06", "Aft 1920"
    const genealogicalMatch = trimmed.match(/(Abt|Bef|Aft)?\s*(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
    if (genealogicalMatch) {
        year = genealogicalMatch[2];
        month = genealogicalMatch[3] || 'x';
        day = genealogicalMatch[4] || 'x';
        return { year, month, day };
    }

    // If we can only extract a year, use it
    const yearMatch = trimmed.match(/\b(\d{4})\b/);
    if (yearMatch) {
        year = yearMatch[1];
        return { year, month: 'x', day: 'x' };
    }

    // Default: return all missing values
    return { year: 'x', month: 'x', day: 'x' };
}

function processDateSubtemplate(dateString, template) {
    const dateTemplate = template || '{YYYY}.{MM}.{DD}';
    const dateComponents = parseDateInput(dateString);

    const data = {
        year: dateComponents.year === 'x' ? null : dateComponents.year,
        month: dateComponents.month === 'x' ? null : dateComponents.month,
        day: dateComponents.day === 'x' ? null : dateComponents.day
    };

    const result = processSubTemplate(dateTemplate, data, { missingValueHandler: 'x' });
    return result;
}

// ============================================================================
// TEST SUITE - Story 1.3 DATE Sub-template Implementation
// ============================================================================

function runDateSubtemplateTests() {
    console.log('\n=== Running DATE Sub-template Test Suite (Story 1.3) ===\n');

    let passCount = 0;
    let failCount = 0;

    // AC Test 1: ISO date with DD-MM-YYYY format
    try {
        const result = processDateSubtemplate('2024-03-05', '{DD}-{MM}-{YYYY}');
        const expected = '05-03-2024';
        if (result === expected) {
            console.log('✓ AC-1 PASS: ISO date with DD-MM-YYYY format');
            console.log(`  Input: 2024-03-05, Template: {DD}-{MM}-{YYYY} → "${result}"`);
            passCount++;
        } else {
            console.error(`✗ AC-1 FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ AC-1 ERROR:', e.message);
        failCount++;
    }

    // AC Test 2: ISO date with YYYY.MM.DD format
    try {
        const result = processDateSubtemplate('2024-03-05', '{YYYY}.{MM}.{DD}');
        const expected = '2024.03.05';
        if (result === expected) {
            console.log('✓ AC-2 PASS: ISO date with YYYY.MM.DD format');
            console.log(`  Input: 2024-03-05, Template: {YYYY}.{MM}.{DD} → "${result}"`);
            passCount++;
        } else {
            console.error(`✗ AC-2 FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ AC-2 ERROR:', e.message);
        failCount++;
    }

    // AC Test 3: ISO date with MM/DD/YY format
    try {
        const result = processDateSubtemplate('2024-03-05', '{MM}/{DD}/{YY}');
        const expected = '03/05/24';
        if (result === expected) {
            console.log('✓ AC-3 PASS: ISO date with MM/DD/YY format (with padding)');
            console.log(`  Input: 2024-03-05, Template: {MM}/{DD}/{YY} → "${result}"`);
            passCount++;
        } else {
            console.error(`✗ AC-3 FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ AC-3 ERROR:', e.message);
        failCount++;
    }

    // AC Test 4: Partial date with unknown day (2024-03-null)
    try {
        const result = processDateSubtemplate('2024-03', '{YYYY}.{MM}.{DD}');
        const expected = '2024.03.x';
        if (result === expected) {
            console.log('✓ AC-4 PASS: Partial date with unknown day');
            console.log(`  Input: 2024-03 (no day), Template: {YYYY}.{MM}.{DD} → "${result}"`);
            passCount++;
        } else {
            console.error(`✗ AC-4 FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ AC-4 ERROR:', e.message);
        failCount++;
    }

    // AC Test 5: Partial date with year only
    try {
        const result = processDateSubtemplate('2024', '{YYYY}.{MM}.{DD}');
        const expected = '2024.x.x';
        if (result === expected) {
            console.log('✓ AC-5 PASS: Partial date with year only');
            console.log(`  Input: 2024 (year only), Template: {YYYY}.{MM}.{DD} → "${result}"`);
            passCount++;
        } else {
            console.error(`✗ AC-5 FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ AC-5 ERROR:', e.message);
        failCount++;
    }

    // AC Test 6: Default template when empty
    try {
        const result = processDateSubtemplate('2024-03-05', '');
        const expected = '2024.03.05';  // Default template
        if (result === expected) {
            console.log('✓ AC-6 PASS: Default template when empty');
            console.log(`  Input: 2024-03-05, Template: "" → "${result}" (default used)`);
            passCount++;
        } else {
            console.error(`✗ AC-6 FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ AC-6 ERROR:', e.message);
        failCount++;
    }

    // Additional Test: Genealogical date format "Abt 1850"
    try {
        const result = processDateSubtemplate('Abt 1850', '{YYYY}');
        const expected = '1850';
        if (result === expected) {
            console.log('✓ Genealogical Test PASS: "Abt 1850" format');
            console.log(`  Input: Abt 1850, Template: {YYYY} → "${result}"`);
            passCount++;
        } else {
            console.error(`✗ Genealogical Test FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ Genealogical Test ERROR:', e.message);
        failCount++;
    }

    // Additional Test: Genealogical date with month "Bef 1900-06"
    try {
        const result = processDateSubtemplate('Bef 1900-06', '{YYYY}.{MM}');
        const expected = '1900.06';
        if (result === expected) {
            console.log('✓ Genealogical with Month PASS: "Bef 1900-06" format');
            console.log(`  Input: Bef 1900-06, Template: {YYYY}.{MM} → "${result}"`);
            passCount++;
        } else {
            console.error(`✗ Genealogical with Month FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ Genealogical with Month ERROR:', e.message);
        failCount++;
    }

    // Additional Test: Empty date
    try {
        const result = processDateSubtemplate('', '{YYYY}.{MM}.{DD}');
        const expected = 'x.x.x';
        if (result === expected) {
            console.log('✓ Empty Date PASS: Handles missing dates');
            console.log(`  Input: "", Template: {YYYY}.{MM}.{DD} → "${result}"`);
            passCount++;
        } else {
            console.error(`✗ Empty Date FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ Empty Date ERROR:', e.message);
        failCount++;
    }

    // Additional Test: YY format (2-digit year)
    try {
        const result = processDateSubtemplate('2024-03-05', '{YY}-{MM}-{DD}');
        const expected = '24-03-05';
        if (result === expected) {
            console.log('✓ YY Format PASS: 2-digit year extraction');
            console.log(`  Input: 2024-03-05, Template: {YY}-{MM}-{DD} → "${result}"`);
            passCount++;
        } else {
            console.error(`✗ YY Format FAIL: Expected "${expected}", got "${result}"`);
            failCount++;
        }
    } catch (e) {
        console.error('✗ YY Format ERROR:', e.message);
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
const testResults = runDateSubtemplateTests();

// Export for Jest if needed
module.exports = {
    parseDateInput,
    processDateSubtemplate,
    processSubTemplate,
    runDateSubtemplateTests,
    testResults
};
