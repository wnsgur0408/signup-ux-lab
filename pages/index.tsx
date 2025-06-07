import { useState, useEffect } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showGender, setShowGender] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [focusTimes, setFocusTimes] = useState<number[]>([]);
  const [lastFocusTime, setLastFocusTime] = useState<number | null>(null);

  const handleFocus = () => {
    const currentTime = Date.now();
    setFocusTimes(prev => [...prev, currentTime]);
    setLastFocusTime(currentTime);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value.trim().length > 0 && !showNext) {
      setShowNext(true);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value.trim().length > 0 && !showPhone) {
      setShowPhone(true);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    if (value.trim().length > 0 && !showGender) {
      setShowGender(true);
    }
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setGender(value);
    if (value !== "" && !isComplete) {
      setIsComplete(true);
    }
  };

  const handleComplete = async () => {
    // 마지막 포커스 시간 기록
    const finalTime = Date.now();
    setFocusTimes(prev => [...prev, finalTime]);

    // 시간 간격 계산
    const timeIntervals = focusTimes.slice(1).map((time, index) => {
      return time - focusTimes[index];
    });

    // 총 소요 시간 계산
    const totalTime = finalTime - focusTimes[0];

    // 시간을 보기 좋게 포맷팅하는 함수
    const formatTime = (ms: number) => {
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}분 ${remainingSeconds}초`;
    };

    // 알림 메시지 구성
    const message = `
실험이 종료되었습니다.

각 단계별 소요 시간:
이름 → 이메일: ${formatTime(timeIntervals[0])}
이메일 → 전화번호: ${formatTime(timeIntervals[1])}
전화번호 → 성별: ${formatTime(timeIntervals[2])}
성별 → 완료: ${formatTime(timeIntervals[3])}

총 소요 시간: ${formatTime(totalTime)}
    `.trim();

    alert(message);
  };

  return (
    <div className="w-full min-h-screen px-6 py-16 bg-white text-black">
      <div className="max-w-sm mx-auto flex flex-col">
        <div className="h-[200px] flex items-center">
          <h1 className="text-3xl font-bold">회원가입 실험</h1>
        </div>

        {/* 이름 입력 */}
        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="name" className="block text-3xl font-medium" style={{ marginBottom: '0.5rem' }}>
            이름을 입력하세요
          </label>
          <input
            id="name"
            type="text"
            placeholder="홍길동"
            value={name}
            onChange={handleNameChange}
            onFocus={handleFocus}
            style={{
              width: '25%',
              height: '2rem',
              padding: '0 1rem',
              fontSize: '1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.75rem',
            }}
            className="focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* 이메일 입력 */}
        {showNext && (
          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="email" className="block text-3xl font-medium" style={{ marginBottom: '0.5rem' }}>
              이메일을 입력하세요
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={handleEmailChange}
              onFocus={handleFocus}
              style={{
                width: '50%',
                height: '2rem',
                padding: '0 1rem',
                fontSize: '1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.75rem',
              }}
              className="focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        {/* 전화번호 입력 */}
        {showPhone && (
          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="phone" className="block text-3xl font-medium" style={{ marginBottom: '0.5rem' }}>
              전화번호를 입력하세요
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="010-0000-0000"
              value={phone}
              onChange={handlePhoneChange}
              onFocus={handleFocus}
              style={{
                width: '50%',
                height: '2rem',
                padding: '0 1rem',
                fontSize: '1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.75rem',
              }}
              className="focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        {/* 성별 선택 */}
        {showGender && (
          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="gender" className="block text-3xl font-medium" style={{ marginBottom: '0.5rem' }}>
              성별을 선택하세요
            </label>
            <select
              id="gender"
              value={gender}
              onChange={handleGenderChange}
              onFocus={handleFocus}
              style={{
                width: '37.5%',
                height: '2rem',
                padding: '0 1rem',
                fontSize: '1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.75rem',
              }}
              className="focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">선택하세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>
        )}

        {/* 완료 버튼 */}
        {isComplete && (
          <button
            onClick={handleComplete}
            style={{
              width: '37.5%',
              height: '2.5rem',
              fontSize: '1.2rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              cursor: 'pointer',
            }}
            className="hover:bg-blue-600 transition-colors"
          >
            회원가입 완료
          </button>
        )}
      </div>
    </div>
  );
}
