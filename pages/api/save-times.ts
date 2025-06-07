import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import type { NextApiRequest, NextApiResponse } from 'next';

// Firebase 설정
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { intervals, totalTime, name, email, phone, gender } = req.body;

    // 현재 시간
    const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    // 데이터 구성
    const data = {
      timestamp: now,
      name,
      email,
      phone,
      gender,
      intervals,
      totalTime
    };

    // Firebase에 데이터 저장
    const timesRef = ref(database, 'times');
    await push(timesRef, data);

    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
} 