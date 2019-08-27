
/**
 * Asserts "expected" versus "actual", 
 * 'failing' the assertion (via Error) if a difference is found.
 *
 * @param {String} message The comparison message passed by the user
 * @param {*} expected The expected item
 * @param {*} actual The actual item
 */
function assertEquals(message, expected, actual) {
  if (expected === null) {
    if (expected !== actual) {
      throw new Error(`${message}Expected type ${expected} but found type ${typeof (actual)}`);
    } else {
      return;
    }
  }

  if (expected.constructor !== actual.constructor) {
    throw new TypeError(`${message}Expected type ${expected.constructor.name} but found ${actual.constructor.name}`);
  }

  if (typeof (expected) === 'number' || typeof (expected) === 'boolean') {
    if (expected !== actual) {
      throw new Error(`${message}Expected ${expected} found ${actual}`);
    }
  } 

  if (typeof (expected) === 'string') {
    if (expected !== actual) {
      throw new Error(`${message}Expected "${expected}" found "${actual}"`);
    }
  } 

  if (Array.isArray(expected)) {
    compareArrays(message, expected, actual);
  }

  compareObjectKeys(message, expected, actual);
  compareObjectValues(`${message}Expected `, expected, actual);
}

function compareArrays(message, expected, actual) {
  if (expected.length !== actual.length) {
    throw new Error(`${message}Expected array length ${expected.length} found ${actual.length}`);
  }

  var flatExpected =  expected.flat();
  var flatActual = actual.flat();

  flatExpected.forEach(function(item, index) {
    if (item !== flatActual[index]) {
      throw new Error(`${message}Expected array element "${item}" but found "${actual[index]}"`);
    }
  });
}

function compareObjectKeys(message, expected, actual) {
  for(var prop in expected) {
    if (!actual.hasOwnProperty(prop)) throw new Error(`${message}Expected ${prop} but was not found`);
    
    for(var nestedProp in expected[prop]) {
      if (!actual[prop].hasOwnProperty(nestedProp)) throw new Error(`${message}Expected ${prop + '.' + nestedProp} but was not found`);
    }
  }
 
	for (var p in actual) {
    if (!expected.hasOwnProperty(p)) throw new Error(`${message}Expected no property but found ${p}`);
	}
}

function compareObjectValues(message, expected, actual) {
  for(var prop in expected) {
    if (typeof (expected[prop]) === 'object') {
      if (prop >= 0) {
        message = message.slice(0, -1) + `[${prop}].`;
      } else {
        message += `${prop}.`;
      }
      
      compareObjectValues(message, expected[prop], actual[prop]);
    } else if (expected[prop] !== actual[prop]) {
      throw new Error(`${message + prop} "${expected[prop]}" but found "${actual[prop]}"`);
    }
  }
}

/* -- Test running code:  --- */

/**
 * Runs a "assertEquals" test.
 * 
 * @param {String} message The initial message to pass
 * @param {Array} assertionFailures List of messages that will be displayed on the UI for evaluation
 * @param {*} expected Expected item
 * @param {*} actual The actual item
 */
function runTest(message, assertionFailures, expected, actual) {
  try {
    assertEquals(message, expected, actual);
  } catch (failure) {
    console.log(failure);
    assertionFailures.push(failure.message);
  }
}

function runAll() {

  var complexObject1 = {
    propA: 1,
    propB: {
      propA: [1, { propA: 'a', propB: 'b' }, 3],
      propB: 1,
      propC: 2
    }
  };
  var complexObject1Copy = {
    propA: 1,
    propB: {
      propA: [1, { propA: 'a', propB: 'b' }, 3],
      propB: 1,
      propC: 2
    }
  };
  var complexObject2 = {
    propA: 1,
    propB: {
      propB: 1,
      propA: [1, { propA: 'a', propB: 'c' }, 3],
      propC: 2
    }
  };
  var complexObject3 = {
    propA: 1,
    propB: {
      propA: [1, { propA: 'a', propB: 'b' }, 3],
      propB: 1
    }
  };
  var complexObject4 = {
    propA: undefined,
    propB: {
      propA: [1, { propA: 'a', propB: 'b' }, 3],
      propB: 1
    }
  };
  var complexObject4Copy = {
    propA: undefined,
    propB: {
      propA: [1, { propA: 'a', propB: 'b' }, 3],
      propB: 1
    }
  };
  var complexObject5 = {
    propA: 1,
    propB: {
      propA: [1, { propA: 'a', propB: 'b' }, 3],
      propB: 1
    },
    propC: 1
  };
  var complexObject6 = {
    propA: 1,
    propB: 2,
    propC: 1
  };
  var complexObject7 = {
    propA: 1,
    propB: 3,
    propC: 1
  };
  var complexObject8 = {
    propA: 1,
    propB: [1, 2, 3],
    propC: 1
  };
  var complexObject9 = {
    propA: 1,
    propB: [1, 2, 3],
    propC: 1
  };

  // Run the tests
  var assertionFailures = [];
  runTest('Test 01: ', assertionFailures, 'abc', 'abc');
  runTest('Test 02: ', assertionFailures, 'abcdef', 'abc');
  runTest('Test 03: ', assertionFailures, ['a'], {0: 'a'});
  runTest('Test 04: ', assertionFailures, ['a', 'b'], ['a', 'b', 'c']);
  runTest('Test 05: ', assertionFailures, ['a', 'b', 'c'], ['a', 'b', 'c']);
  runTest('Test 06: ', assertionFailures, complexObject1, complexObject1Copy);
  runTest('Test 07: ', assertionFailures, complexObject1, complexObject2);
  runTest('Test 08: ', assertionFailures, complexObject1, complexObject3);
  runTest('Test 09: ', assertionFailures, null, {});
  runTest('Test 10: ', assertionFailures, ['a', 'b', 'c'], ['x', 'y', 'z']);
  runTest('Test 11: ', assertionFailures, ['a', ['b', 'c']], ['a', ['b', 'c']]);
  runTest('Test 13: ', assertionFailures, complexObject6, complexObject7);
  runTest('Test 14: ', assertionFailures, complexObject8, complexObject9);
  runTest('Test 15: ', assertionFailures, complexObject4, complexObject4Copy);
  runTest('Test 16: ', assertionFailures, complexObject3, complexObject5);
  runTest('Test 17: ', assertionFailures, NaN, NaN);
  runTest('Test 18: ', assertionFailures, null, null);
  runTest('Test 19: ', assertionFailures, 1, 1);
  runTest('Test 20: ', assertionFailures, 2, 1);
  runTest('Test 21: ', assertionFailures, true, 1);
  runTest('Test 22: ', assertionFailures, true, true);
  runTest('Test 23: ', assertionFailures, true, false);
  
  // Output the results
  var messagesEl = document.getElementById('messages');
  var newListEl;
  var i, ii;
  
  for (i = 0, ii = assertionFailures.length; i < ii; i++) {    
    newListEl = document.createElement('li');
    newListEl.innerHTML = assertionFailures[i];
    messagesEl.appendChild(newListEl);    
  }
}

runAll();
