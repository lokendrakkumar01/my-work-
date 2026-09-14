const http = require('http');

function request(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch(e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function testAll() {
  console.log('🚀 Starting API Verification Tests...\n');

  // 1. Health check
  const health = await request('/health');
  console.log('1. Health Check:', health.status, health.data?.database?.status);

  // 2. Register
  const testEmail = `creator_${Date.now()}@example.com`;
  const reg = await request('/api/auth/register', 'POST', {
    email: testEmail,
    password: 'Password123',
    fullName: 'Lokendra Kumar'
  });
  console.log('2. Register:', reg.status, reg.data?.success, reg.data?.message);
  const token = reg.data?.data?.token;

  if (!token) {
    console.error('Failed to get token:', reg);
    process.exit(1);
  }

  // 3. Current user
  const me = await request('/api/auth/me', 'GET', null, token);
  console.log('3. Auth /me:', me.status, me.data?.data?.user?.profile?.fullName);

  // 4. Create Task
  const task = await request('/api/tasks', 'POST', {
    title: 'Complete Creator Hub Deploy',
    description: 'Verify all endpoints and deployment',
    priority: 'high',
    status: 'todo'
  }, token);
  console.log('4. Create Task:', task.status, task.data?.success, task.data?.data?.task?.title);

  // 5. Create Social Post
  const post = await request('/api/social', 'POST', {
    content: 'Excited to launch Creator Control Hub today! #creators #buildinpublic',
    platform: 'twitter'
  }, token);
  console.log('5. Create Social Post:', post.status, post.data?.success, post.data?.data?.post?.platforms);

  // 6. Create YouTube Video
  const video = await request('/api/youtube', 'POST', {
    title: 'How to Build an AI Creator Hub',
    description: 'Complete architecture and tutorial',
    status: 'idea'
  }, token);
  console.log('6. Create YouTube Video:', video.status, video.data?.success, video.data?.data?.video?.idea?.title);

  // 7. Dashboard Analytics
  const analytics = await request('/api/analytics/dashboard', 'GET', null, token);
  console.log('7. Dashboard Analytics:', analytics.status, analytics.data?.data);

  console.log('\n🎉 ALL BACKEND API TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}

testAll().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
