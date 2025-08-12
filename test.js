// Simple test for the PR validation logic
const core = require('@actions/core');

// Mock the core functions for testing
const originalSetFailed = core.setFailed;
const originalInfo = core.info;
const originalGetInput = core.getInput;

let testOutput = [];
let testPRBody = '';

core.setFailed = (message) => {
  testOutput.push(`FAILED: ${message}`);
};

core.info = (message) => {
  testOutput.push(`INFO: ${message}`);
};

core.getInput = (name) => {
  if (name === 'pr-body') {
    return testPRBody;
  }
  return '';
};

// Mock GitHub context
const originalGithub = require('@actions/github');
require('@actions/github').context = {
  payload: {
    pull_request: {
      body: testPRBody
    }
  }
};

// Test cases
const testCases = [
  {
    name: 'Valid PR description',
    body: `**Description:** This is a valid description with more than 30 characters to test the validation logic.
**Task:** https://gradiweb.monday.com/tasks/123
**Demo:** N/A`,
    expected: 'success'
  },
  {
    name: 'Missing Description section',
    body: `**Task:** https://gradiweb.monday.com/tasks/123
**Demo:** N/A`,
    expected: 'fail'
  },
  {
    name: 'Empty Description section',
    body: `**Description:** 
**Task:** https://gradiweb.monday.com/tasks/123
**Demo:** N/A`,
    expected: 'fail'
  },
  {
    name: 'Description too short',
    body: `**Description:** Short
**Task:** https://gradiweb.monday.com/tasks/123
**Demo:** N/A`,
    expected: 'fail'
  }
];

// Run tests
testCases.forEach((testCase, index) => {
  console.log(`\n--- Test ${index + 1}: ${testCase.name} ---`);
  console.log(`Input: ${JSON.stringify(testCase.body)}`);
  testOutput = [];
  testPRBody = testCase.body;
  
  // Update the mocked context
  require('@actions/github').context.payload.pull_request.body = testCase.body;
  
  try {
    // Clear require cache to reload the module
    delete require.cache[require.resolve('./index.js')];
    require('./index.js');
    
    const hasError = testOutput.some(output => output.startsWith('FAILED:'));
    const result = hasError ? 'FAIL' : 'PASS';
    const expected = testCase.expected === 'fail' ? 'FAIL' : 'PASS';
    
    console.log(`Expected: ${expected}, Got: ${result}`);
    if (result !== expected) {
      console.log('❌ Test failed!');
      console.log('Output:', testOutput);
    } else {
      console.log('✅ Test passed!');
    }
  } catch (error) {
    console.log('❌ Test error:', error.message);
  }
});

// Restore original functions
core.setFailed = originalSetFailed;
core.info = originalInfo;
core.getInput = originalGetInput; 