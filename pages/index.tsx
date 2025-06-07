import { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: ""
  });

  const [focusTimes, setFocusTimes] = useState<number[]>([]);

  const handleFocus = () => {
    const currentTime = Date.now();
    setFocusTimes(prev => [...prev, currentTime]);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleComplete = () => {
    const finalTime = Date.now();
    setFocusTimes(prev => [...prev, finalTime]);

    const timeIntervals = focusTimes.slice(1).map((time, index) => {
      return time - focusTimes[index];
    });

    const totalTime = finalTime - focusTimes[0];

    const formatTime = (ms: number) => {
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}분 ${remainingSeconds}초`;
    };

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

  const isNameFilled = formData.name.trim().length > 0;
  const isEmailFilled = formData.email.trim().length > 0;
  const isPhoneFilled = formData.phone.trim().length > 0;
  const isGenderFilled = formData.gender !== "";

  return (
    <div className="w-full min-h-screen px-6 py-16 bg-white text-black">
      <div className="max-w-sm mx-auto flex flex-col">
        <div className="h-[200px] flex items-center justify-between">
          <h1 className="text-3xl font-bold">회원가입 실험</h1>
          <div className="text-sm text-gray-500">
            마지막 수정: 2025-06-07 21:10
          </div>
        </div>

        {/* 이름 입력 */}
        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="name" className="block text-3xl font-medium mb-2">
            이름을 입력하세요
          </label>
          <input
            id="name"
            type="text"
            placeholder="홍길동"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            onFocus={handleFocus}
            autoComplete="name"
            className="w-1/2 h-8 px-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* 이메일 입력 */}
        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="email" className="block text-3xl font-medium mb-2">
            이메일을 입력하세요
          </label>
          <input
            id="email"
            type="email"
            placeholder="example@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onFocus={handleFocus}
            autoComplete="email"
            disabled={!isNameFilled}
            className={`w-3/4 h-8 px-4 text-base border rounded-xl focus:outline-none focus:ring-2 ${isNameFilled ? "border-gray-300 focus:ring-blue-400" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          />
        </div>

        {/* 전화번호 입력 */}
        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="phone" className="block text-3xl font-medium mb-2">
            전화번호를 입력하세요
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="010-0000-0000"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            onFocus={handleFocus}
            autoComplete="tel"
            disabled={!isEmailFilled}
            className={`w-3/4 h-8 px-4 text-base border rounded-xl focus:outline-none focus:ring-2 ${isEmailFilled ? "border-gray-300 focus:ring-blue-400" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          />
        </div>

        {/* 성별 선택 */}
        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="gender" className="block text-3xl font-medium mb-2">
            성별을 선택하세요
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            onFocus={handleFocus}
            disabled={!isPhoneFilled}
            className={`w-1/2 h-8 px-4 text-base border rounded-xl focus:outline-none focus:ring-2 ${isPhoneFilled ? "border-gray-300 focus:ring-blue-400" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            <option value="">선택하세요</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>

        {/* 완료 버튼 */}
        <button
          onClick={handleComplete}
          disabled={!isGenderFilled}
          className={`w-1/2 h-10 text-lg font-semibold rounded-xl transition-colors ${
            isGenderFilled
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          회원가입 완료
        </button>
      </div>
    </div>
  );
}