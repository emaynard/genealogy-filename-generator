/**
 * Test: Additional People Sub-template Fix
 * Verifies formatAdditionalPeople() now uses processNameSubtemplate()
 * and supports format modifiers (:upper, :lower, :title, :abbrev)
 */

// Mock dependencies from genealogy-filename-generator.html
function formatForFilename(str) {
    return str.replace(/\s+/g, '-');
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
            return value.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        case 'abbrev':
            return value.charAt(0).toUpperCase();
        default:
            console.warn(`Unknown modifier: ${modifier}`);
            return value;
    }
}

function processSubTemplate(template, data, options = {}) {
    const { missingValueHandler = 'x' } = options;
    if (!template || typeof template !== 'string') return '';

    let result = template;
    const placeholderRegex = /\{([A-Z]+)(?::([a-zA-Z:]+))?\}/g;

    result = result.replace(placeholderRegex, (match, placeholder, modifier) => {
        const keyMap = {
            'SURNAME': 'surname',
            'GIVEN': 'given',
            'MIDDLE': 'middle'
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

        if (modifier) {
            const modifiers = modifier.split(':');
            const lastModifier = modifiers[modifiers.length - 1];
            value = applyModifier(value, lastModifier);
        }

        return value;
    });

    return result;
}

function parseNameInput(nameString) {
    if (!nameString || nameString.trim() === '') {
        return { surname: 'x', given: 'x', middle: 'x' };
    }

    const trimmed = nameString.trim();
    const parts = trimmed.split(/\s+/).filter(part => part.length > 0);

    let given = 'x', middle = 'x', surname = 'x';

    if (parts.length === 3) {
        given = parts[0];
        middle = parts[1];
        surname = parts[2];
    } else if (parts.length === 2) {
        given = parts[0];
        surname = parts[1];
    } else if (parts.length === 1) {
        given = parts[0];
    } else if (parts.length > 3) {
        given = parts[0];
        middle = parts.slice(1, -1).join(' ');
        surname = parts[parts.length - 1];
    }

    return { surname, given, middle };
}

function processNameSubtemplate(nameString, template) {
    const nameTemplate = template || '{SURNAME:upper}.{GIVEN}';
    const nameComponents = parseNameInput(nameString);

    const data = {
        surname: nameComponents.surname === 'x' ? null : nameComponents.surname,
        given: nameComponents.given === 'x' ? null : nameComponents.given,
        middle: nameComponents.middle === 'x' ? null : nameComponents.middle
    };

    const result = processSubTemplate(nameTemplate, data, { missingValueHandler: 'x' });
    return result;
}

// FIXED VERSION: formatAdditionalPeople using processNameSubtemplate
function formatAdditionalPeople(additionalPeople, nameFormat = '{GIVEN}.{SURNAME}|+') {
    if (!additionalPeople || !Array.isArray(additionalPeople) || additionalPeople.length === 0) {
        return '';
    }

    let formatTemplate = nameFormat;
    let delimiter = '';

    const pipeIndex = nameFormat.lastIndexOf('|');
    if (pipeIndex !== -1) {
        formatTemplate = nameFormat.substring(0, pipeIndex);
        delimiter = nameFormat.substring(pipeIndex + 1);
    }

    const formattedPeople = additionalPeople.map(person => {
        const nameParts = [
            person.givenName || '',
            person.middleName || '',
            person.surname || ''
        ].filter(part => part.trim() !== '');

        const fullName = nameParts.join(' ') || '';
        const formatted = processNameSubtemplate(fullName, formatTemplate);
        return formatForFilename(formatted);
    });

    return formattedPeople.join(delimiter);
}

// Test Cases
console.log('=== Additional People Sub-template Fix Tests ===\n');

let passCount = 0;
let failCount = 0;

function test(description, actual, expected) {
    if (actual === expected) {
        console.log(`✅ PASS: ${description}`);
        console.log(`   Result: "${actual}"\n`);
        passCount++;
    } else {
        console.log(`❌ FAIL: ${description}`);
        console.log(`   Expected: "${expected}"`);
        console.log(`   Got:      "${actual}"\n`);
        failCount++;
    }
}

// Test data
const additionalPeople = [
    { givenName: 'Jane', surname: 'Doe', middleName: '', relationship: 'spouse' },
    { givenName: 'Robert', surname: 'Smith', middleName: 'James', relationship: 'witness' }
];

// Test 1: Default template (no modifiers)
test(
    'Default template {GIVEN}.{SURNAME}',
    formatAdditionalPeople(additionalPeople, '{GIVEN}.{SURNAME}|+'),
    'Jane.Doe+Robert.Smith'
);

// Test 2: SURNAME with :upper modifier
test(
    'Template with :upper modifier on SURNAME',
    formatAdditionalPeople(additionalPeople, '{SURNAME:upper}.{GIVEN}|+'),
    'DOE.Jane+SMITH.Robert'
);

// Test 3: GIVEN with :lower modifier
test(
    'Template with :lower modifier on GIVEN',
    formatAdditionalPeople(additionalPeople, '{GIVEN:lower}-{SURNAME}|+'),
    'jane-Doe+robert-Smith'
);

// Test 4: MIDDLE with :abbrev modifier
test(
    'Template with :abbrev modifier on MIDDLE',
    formatAdditionalPeople(additionalPeople, '{GIVEN}.{MIDDLE:abbrev}.{SURNAME}|+'),
    'Jane.x.Doe+Robert.J.Smith'
);

// Test 5: Multiple modifiers (title on GIVEN, upper on SURNAME)
test(
    'Template with multiple modifiers',
    formatAdditionalPeople(additionalPeople, '{GIVEN:title} {SURNAME:upper}|, '),
    'Jane-DOE, Robert-SMITH'
);

// Test 6: Custom delimiter
test(
    'Custom delimiter (underscore)',
    formatAdditionalPeople(additionalPeople, '{SURNAME:upper}.{GIVEN}|_'),
    'DOE.Jane_SMITH.Robert'
);

// Test 7: Empty array
test(
    'Empty additional people array',
    formatAdditionalPeople([], '{GIVEN}.{SURNAME}|+'),
    ''
);

// Test 8: Single person
const singlePerson = [{ givenName: 'Alice', surname: 'Johnson', middleName: 'Marie' }];
test(
    'Single person with full name',
    formatAdditionalPeople(singlePerson, '{SURNAME:upper}, {GIVEN} {MIDDLE:abbrev}|'),
    'JOHNSON,-Alice-M'
);

// Summary
console.log('=== Test Summary ===');
console.log(`Total: ${passCount + failCount}`);
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);

if (failCount === 0) {
    console.log('\n✅ All tests passed!');
} else {
    console.log(`\n❌ ${failCount} test(s) failed.`);
}
