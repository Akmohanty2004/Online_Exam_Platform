const jwt = require('../server/node_modules/jsonwebtoken');

async function testCreate() {
  try {
    // Generate token
    const token = jwt.sign(
      { id: '6a411238140ede743919da81', role: 'teacher' },
      'your_jwt_secret_key_change_this_in_production',
      { expiresIn: '7d' }
    );
    
    // 2. Create exam
    const examPayload = {
      title: 'Test Exam',
      subject: 'Test Subject',
      description: '',
      instructions: '',
      password: '123',
      date: '2026-07-01',
      startTime: '10:00',
      endTime: '11:00',
      entryTime: 15,
      duration: 60,
      maxMarks: 100,
      passingMarks: 40,
      negativeMarking: false,
      negativeMarkValue: 0.25,
      randomQuestions: false,
      allowCalculator: false,
      fullscreenMode: true,
      enableCamera: true,
      enableMicrophone: true,
      maxAttempts: 1,
      questions: [
        {
          type: 'mcq',
          question: 'What is 2+2?',
          options: [{text: '3'}, {text: '4'}, {text: '5'}, {text: '6'}],
          correctAnswer: '4',
          marks: 1,
          image: null,
          explanation: ''
        }
      ]
    };

    const res = await fetch('http://localhost:5000/api/exams/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(examPayload)
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testCreate();
