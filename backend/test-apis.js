import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';
let pollId = '';

// Test data
const testUser1 = {
  name: 'John Doe',
  email: 'john@test.com',
  password: 'password123'
};

const testUser2 = {
  name: 'Jane Smith', 
  email: 'jane@test.com',
  password: 'password456'
};

const testPoll = {
  question: 'What is your favorite programming language?',
  options: ['JavaScript', 'Python', 'Java', 'Go'],
  type: 'single',
  category: 'Technology',
  expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
};

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    method,
    headers
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);
    return { status: 500, data: { message: error.message } };
  }
}

// Test functions
async function testUserSignup() {
  console.log('\n🧪 Testing User Signup...');
  
  const result = await apiCall('/auth/signup', 'POST', testUser1);
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.status === 201) {
    authToken = result.data.token;
    console.log('✅ Signup successful');
  } else {
    console.log('❌ Signup failed');
  }
  
  return result.status === 201;
}

async function testUserLogin() {
  console.log('\n🧪 Testing User Login...');
  
  const result = await apiCall('/auth/login', 'POST', {
    email: testUser1.email,
    password: testUser1.password
  });
  
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.status === 200) {
    authToken = result.data.token;
    console.log('✅ Login successful');
  } else {
    console.log('❌ Login failed');
  }
  
  return result.status === 200;
}

async function testGetMe() {
  console.log('\n🧪 Testing Get Me...');
  
  const result = await apiCall('/auth/me', 'GET', null, authToken);
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.status === 200) {
    console.log('✅ Get Me successful');
  } else {
    console.log('❌ Get Me failed');
  }
  
  return result.status === 200;
}

async function testCreatePoll() {
  console.log('\n🧪 Testing Create Poll...');
  
  const result = await apiCall('/polls', 'POST', testPoll, authToken);
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.status === 201) {
    pollId = result.data.poll._id;
    console.log('✅ Create Poll successful');
  } else {
    console.log('❌ Create Poll failed');
  }
  
  return result.status === 201;
}

async function testGetPolls() {
  console.log('\n🧪 Testing Get All Polls...');
  
  const result = await apiCall('/polls');
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.status === 200) {
    console.log('✅ Get Polls successful');
  } else {
    console.log('❌ Get Polls failed');
  }
  
  return result.status === 200;
}

async function testGetSinglePoll() {
  console.log('\n🧪 Testing Get Single Poll...');
  
  const result = await apiCall(`/polls/${pollId}`);
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.status === 200) {
    console.log('✅ Get Single Poll successful');
  } else {
    console.log('❌ Get Single Poll failed');
  }
  
  return result.status === 200;
}

async function testVotePoll() {
  console.log('\n🧪 Testing Vote on Poll...');
  
  const result = await apiCall(`/polls/${pollId}/vote`, 'POST', { optionIndex: 0 }, authToken);
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.status === 200) {
    console.log('✅ Vote Poll successful');
  } else {
    console.log('❌ Vote Poll failed');
  }
  
  return result.status === 200;
}

async function testGetPollResults() {
  console.log('\n🧪 Testing Get Poll Results...');
  
  const result = await apiCall(`/polls/${pollId}/results`);
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.status === 200) {
    console.log('✅ Get Poll Results successful');
  } else {
    console.log('❌ Get Poll Results failed');
  }
  
  return result.status === 200;
}

async function testGetMyPolls() {
  console.log('\n🧪 Testing Get My Polls...');
  
  const result = await apiCall('/polls/my-polls', 'GET', null, authToken);
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.status === 200) {
    console.log('✅ Get My Polls successful');
  } else {
    console.log('❌ Get My Polls failed');
  }
  
  return result.status === 200;
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting API Tests...\n');
  
  const tests = [
    testUserSignup,
    testUserLogin,
    testGetMe,
    testCreatePoll,
    testGetPolls,
    testGetSinglePoll,
    testVotePoll,
    testGetPollResults,
    testGetMyPolls
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const success = await test();
      if (success) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`Test failed with error:`, error.message);
      failed++;
    }
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
}

// Check if we can connect to the server first
async function checkServerConnection() {
  try {
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      console.log('✅ Server is running and accessible');
      return true;
    } else {
      console.log('❌ Server responded with error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot connect to server:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServerConnection();
  if (serverRunning) {
    await runAllTests();
  } else {
    console.log('Please make sure the server is running on http://localhost:3000');
  }
}

main().catch(console.error);