import { useState } from "react";

type ExperimentConfig = {
  motion: 'all-at-once' | 'grouped';  // 모든 필드 한번에 표시 vs 그룹화된 표시
  validationLevel: 0 | 1;  // 유효성 검사 표시 수준
  exampleLevel: 0 | 1;     // 예시문 표시 수준
};

// Define the 8 experiment configurations based on the factors
const allExperimentConfigs: ExperimentConfig[] = [
  // 모든 가능한 조합 (2^3 = 8가지)
  { motion: 'all-at-once', validationLevel: 0, exampleLevel: 0 },  // 000
  { motion: 'all-at-once', validationLevel: 0, exampleLevel: 1 },  // 001
  { motion: 'all-at-once', validationLevel: 1, exampleLevel: 0 },  // 010
  { motion: 'all-at-once', validationLevel: 1, exampleLevel: 1 },  // 011
  { motion: 'grouped', validationLevel: 0, exampleLevel: 0 },      // 100
  { motion: 'grouped', validationLevel: 0, exampleLevel: 1 },      // 101
  { motion: 'grouped', validationLevel: 1, exampleLevel: 0 },      // 110
  { motion: 'grouped', validationLevel: 1, exampleLevel: 1 },      // 111
];


export default function Signup() {
  const [currentExperimentIndex, setCurrentExperimentIndex] = useState(0); // 0-7 for each participant's 8 experiments
  const [isExperimentSessionStarted, setIsExperimentSessionStarted] = useState(false); // Overall session
  const [showResults, setShowResults] = useState(false);
  const [experimentResults, setExperimentResults] = useState<{
    config: ExperimentConfig;
    timeIntervals: number[];
    totalTime: number;
    runNumber: number; // 1 to 8
  } | null>(null);
  const [shuffledExperimentOrder, setShuffledExperimentOrder] = useState<number[]>([]); // New state for shuffled order

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "", // 추가된 필드
    name: "",
    phone: "",
    birthdate: "",
    gender: "",
    region: ""
  });

  const [focusTimes, setFocusTimes] = useState<number[]>([]);

  const [validationState, setValidationState] = useState({
    email: {
      isValid: false,
      isChecked: false
    },
    password: {
      isValid: false,
      isChecked: false
    }
  });

  const [allExperimentSummary, setAllExperimentSummary] = useState<Array<{
    runNumber: number;
    sequenceNumber: string;
    totalTime: number;
  }>>([]); // 모든 실험 결과를 요약하기 위한 새로운 상태

  // Utility function to shuffle an array
  const shuffleArray = (array: number[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Get current config based on participantId and currentExperimentIndex
  const config = isExperimentSessionStarted && shuffledExperimentOrder.length > 0
    ? allExperimentConfigs[shuffledExperimentOrder[currentExperimentIndex]]
    : allExperimentConfigs[0]; // Fallback to first config

  const handleFocus = () => {
    const currentTime = Date.now();
    setFocusTimes(prev => [...prev, currentTime]);
  };

  const validateEmail = (email: string) => {
    return email.includes('@');
  };

  const validatePassword = (password: string, passwordConfirm: string) => {
    return password === passwordConfirm && password.length > 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };

      // 이메일과 비밀번호 유효성 검사
      if (field === 'email') {
        const isValid = validateEmail(value);
        setValidationState(prev => ({
          ...prev,
          email: {
            isValid,
            isChecked: config.validationLevel === 1 ? true : prev.email.isChecked
          }
        }));
      } else if (field === 'password' || field === 'passwordConfirm') {
        const currentPassword = field === 'password' ? value : prev.password;
        const currentPasswordConfirm = field === 'passwordConfirm' ? value : prev.passwordConfirm;
        const isValid = validatePassword(currentPassword, currentPasswordConfirm);
        setValidationState(prev => ({
          ...prev,
          password: {
            isValid,
            isChecked: config.validationLevel === 1 ? true : prev.password.isChecked
          }
        }));
      }

      return newData;
    });
  };

  const handleBlur = (field: string) => {
    if (field === 'email') {
      setValidationState(prev => ({
        ...prev,
        email: {
          ...prev.email,
          isChecked: true
        }
      }));
    } else if (field === 'passwordConfirm') {
      setValidationState(prev => ({
        ...prev,
        password: {
          ...prev.password,
          isChecked: true
        }
      }));
    }
  };

  const getValidationIcon = (field: 'email' | 'password') => {
    const state = validationState[field];
    if (!state.isChecked) return null;
    return state.isValid ? (
      <span className="text-green-500 ml-2">✓</span>
    ) : (
      <span className="text-red-500 ml-2">✗</span>
    );
  };

  const getExampleText = (field: string) => {
    if (config.exampleLevel === 0) return null;
    
    const examples = {
      email: '예: honggildong@gmail.com',
      passwordConfirm: '비밀번호 재확인'
    };

    return examples[field as keyof typeof examples] || null;
  };

  const handleStartSession = () => {
    setIsExperimentSessionStarted(true);
    setCurrentExperimentIndex(0);
    setFormData({
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
      phone: "",
      birthdate: "",
      gender: "",
      region: ""
    });
    setFocusTimes([]);
    setValidationState({
      email: {
        isValid: false,
        isChecked: false
      },
      password: {
        isValid: false,
        isChecked: false
      }
    });

    // Generate and shuffle the experiment order
    const experimentIndices = Array.from({ length: 8 }, (_, i) => i);
    setShuffledExperimentOrder(shuffleArray(experimentIndices));

    handleFocus();
  };

  const handleCompleteCurrentExperiment = () => {
    const finalTime = Date.now();
    const updatedFocusTimes = [...focusTimes, finalTime]; // Add final timestamp

    // Calculate time intervals between consecutive focus/completion events
    const timeIntervals = updatedFocusTimes.slice(1).map((time, index) => {
      return time - updatedFocusTimes[index];
    });

    const totalTime = finalTime - updatedFocusTimes[0]; // Total time from start to completion

    setExperimentResults({
      config,
      timeIntervals,
      totalTime,
      runNumber: currentExperimentIndex + 1 // 1-indexed run number for display
    });
    setShowResults(true);

    // 현재 실험 결과를 요약하여 allExperimentSummary에 추가
    setAllExperimentSummary(prev => [
      ...prev,
      {
        runNumber: currentExperimentIndex + 1,
        sequenceNumber: getSequenceNumber(config),
        totalTime: totalTime,
      }
    ]);
  };

  const handleNextExperiment = () => {
    if (currentExperimentIndex < 7) { // Changed from 3 to 7 for 8 experiments
      setCurrentExperimentIndex(prev => prev + 1);
      setShowResults(false);
      setFormData({
        email: "",
        password: "",
        passwordConfirm: "",
        name: "",
        phone: "",
        birthdate: "",
        gender: "",
        region: ""
      });
      setFocusTimes([]);
      setValidationState({
        email: {
          isValid: false,
          isChecked: false
        },
        password: {
          isValid: false,
          isChecked: false
        }
      });
      handleFocus();
    } else {
      // 모든 실험이 완료되었을 때 요약 화면 표시
      setShowResults(false); // 개별 결과 화면 숨기기
      setIsExperimentSessionStarted(false); // 세션 종료 (요약 화면 표시를 위함)
    }
  };

  const handleResetSession = () => {
    setIsExperimentSessionStarted(false);
    setShowResults(false);
    setExperimentResults(null);
    setFormData({
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
      phone: "",
      birthdate: "",
      gender: "",
      region: ""
    });
    setFocusTimes([]);
    setShuffledExperimentOrder([]); // Ensure shuffled order is reset for a new session
    setValidationState({
      email: {
        isValid: false,
        isChecked: false
      },
      password: {
        isValid: false,
        isChecked: false
      }
    });
    setAllExperimentSummary([]); // 모든 실험 요약 결과 초기화
  };

  const getInputStyle = () => {
    return {
      padding: '0 1rem',
      fontSize: '1rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.75rem',
      width: '50%',
      height: '2rem',
      backgroundColor: 'white',
    };
  };

  const getConfigDescription = (expConfig: ExperimentConfig) => {
    const motionText = expConfig.motion === 'grouped' ? '그룹화' : '한번에';
    const validationText = expConfig.validationLevel === 1 ? '유효성 검사 있음' : '유효성 검사 없음';
    const exampleText = expConfig.exampleLevel === 1 ? '예시문 있음' : '예시문 없음';
    return `모션: ${motionText}, 유효성: ${validationText}, 예시: ${exampleText}`;
  };

  const getSequenceNumber = (expConfig: ExperimentConfig) => {
    const motionVal = expConfig.motion === 'grouped' ? '1' : '0';
    const validationVal = expConfig.validationLevel.toString();
    const exampleVal = expConfig.exampleLevel.toString();
    return `${motionVal}${validationVal}${exampleVal}`;
  };

  const formatTime = (ms: number) => {
    const seconds = ms / 1000;
    return `${seconds.toFixed(2)}초`;
  };

  // --- Render Logic ---

  // Result display after each experiment
  if (showResults && experimentResults) {
    const { config, totalTime, runNumber } = experimentResults; // timeIntervals 제거

    const resultsContent = `
${runNumber}번째 회원가입 절차 완료!
일련번호: ${getSequenceNumber(config)}

${getConfigDescription(config)}

총 소요 시간: ${formatTime(totalTime)}
    `.trim();

    return (
      <div className="w-full min-h-screen px-6 py-16 bg-white text-black">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">실험 결과</h1>
            <div className="whitespace-pre-line font-mono text-lg">
              {resultsContent}
            </div>
          </div>
          <button
            onClick={handleNextExperiment}
            style={{
              width: '200px',
              height: '3rem',
              fontSize: '1.2rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              cursor: 'pointer',
            }}
            className="hover:bg-blue-600 transition-colors"
          >
            {runNumber < 8 ? '다음 실험으로' : '실험 종료 및 요약 보기'}
          </button>
        </div>
      </div>
    );
  }

  // Initial session start screen
  if (!isExperimentSessionStarted) {
    // 모든 실험이 완료되었을 때 요약 화면 표시
    if (allExperimentSummary.length === 8) {
      return (
        <div className="w-full min-h-screen px-6 py-16 bg-white text-black">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">모든 실험 요약</h1>
            <ul className="list-disc list-inside mb-8 text-lg">
              {allExperimentSummary.map((summary, index) => (
                <li key={index} className="mb-2">
                  {summary.runNumber}번째 회원가입 - 일련번호 {summary.sequenceNumber} - 총 소요 시간: {formatTime(summary.totalTime)}
                </li>
              ))}
            </ul>
            <button
              onClick={handleResetSession}
              className="w-full bg-gray-400 text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-500 transition-colors"
            >
              세션 재시작
            </button>
          </div>
        </div>
      );
    }

    // 기존 실험 시작 화면
    return (
      <div className="w-full min-h-screen px-6 py-16 bg-white text-black">
        <div className="max-w-sm mx-auto flex flex-col">
          <div className="h-[200px] flex items-center justify-between">
            <h1 className="text-3xl font-bold">회원가입 실험 시작</h1>
            <div className="text-sm text-gray-500">
              마지막 수정: 2025-06-09 19:40
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-4">실험 시작하기</h2>
              <button
                onClick={handleStartSession}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors"
              >
                실험 시작하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Always render the single depth form as depth is fixed to 'single'
  return (
    <div className="w-full min-h-screen px-6 py-16 bg-white text-black">
      <div className="max-w-sm mx-auto flex flex-col">
        <div className="h-[200px] flex items-center justify-between">
          <h1 className="text-3xl font-bold">회원가입 실험 - {currentExperimentIndex + 1}번째</h1>
          <div className="text-sm text-gray-500">
            마지막 수정: 2025-06-09 19:40
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="email" className="block text-3xl font-medium" style={{ marginBottom: '0.5rem' }}>
            이메일을 입력하세요
          </label>
          <div className="flex items-center">
            <input
              id="email"
              type="email"
              placeholder={config.exampleLevel === 0 ? "example@example.com" : ""}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onFocus={handleFocus}
              onBlur={(e) => {
                handleInputChange('email', e.target.value);
                handleBlur('email');
              }}
              autoComplete="email"
              style={getInputStyle()}
              className="focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {getValidationIcon('email')}
          </div>
          {config.exampleLevel === 1 && (
            <div className="text-gray-500 mt-1">{getExampleText('email')}</div>
          )}
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="password" className="block text-3xl font-medium" style={{ marginBottom: '0.5rem' }}>
            비밀번호를 입력하세요
          </label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            onFocus={handleFocus}
            autoComplete="new-password"
            style={getInputStyle()}
            className="focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="passwordConfirm" className="block text-3xl font-medium" style={{ marginBottom: '0.5rem' }}>
            비밀번호를 다시 입력하세요
          </label>
          <div className="flex items-center">
            <input
              id="passwordConfirm"
              type="password"
              placeholder={config.exampleLevel === 0 ? "패스워드 재입력" : ""}
              value={formData.passwordConfirm}
              onChange={(e) => handleInputChange('passwordConfirm', e.target.value)}
              onFocus={handleFocus}
              onBlur={(e) => {
                handleInputChange('passwordConfirm', e.target.value);
                handleBlur('passwordConfirm');
              }}
              autoComplete="new-password"
              style={getInputStyle()}
              className="focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {getValidationIcon('password')}
          </div>
          {config.exampleLevel === 1 && (
            <div className="text-gray-500 mt-1">{getExampleText('passwordConfirm')}</div>
          )}
        </div>

        {(config.motion === 'all-at-once' || 
          (config.motion === 'grouped' && 
           validationState.email.isValid && 
           validationState.password.isValid)) && (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <label htmlFor="name" className="block text-3xl font-medium" style={{ marginBottom: '0.5rem' }}>
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
                style={getInputStyle()}
                className="focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label htmlFor="phone" className="block text-3xl font-medium" style={{ marginBottom: '0.5rem' }}>
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
                style={getInputStyle()}
                className="focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label htmlFor="birthdate" className="block text-3xl font-medium" style={{ marginBottom: '0.5rem' }}>
                생년월일을 입력하세요
              </label>
              <input
                id="birthdate"
                type="text"
                placeholder="YYMMDD"
                maxLength={6}
                value={formData.birthdate}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  handleInputChange('birthdate', value);
                }}
                onFocus={handleFocus}
                style={getInputStyle()}
                className="focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </>
        )}

        {(config.motion === 'all-at-once' || 
          (config.motion === 'grouped' && 
           validationState.email.isValid && 
           validationState.password.isValid &&
           formData.name.trim() !== "" &&
           formData.phone.trim() !== "" &&
           formData.birthdate.length === 6)) && (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <label htmlFor="gender" className="block text-3xl font-medium" style={{ marginBottom: '0.5rem' }}>
                성별을 선택하세요
              </label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                onFocus={handleFocus}
                style={getInputStyle()}
                className="focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">선택하세요</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label htmlFor="region" className="block text-3xl font-medium" style={{ marginBottom: '0.5rem' }}>
                지역을 선택하세요
              </label>
              <select
                id="region"
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                onFocus={handleFocus}
                style={getInputStyle()}
                className="focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">선택하세요</option>
                <option value="seoul">서울</option>
                <option value="gyeonggi">경기</option>
                <option value="incheon">인천</option>
                <option value="busan">부산</option>
                <option value="daegu">대구</option>
                <option value="daejeon">대전</option>
                <option value="gwangju">광주</option>
                <option value="ulsan">울산</option>
                <option value="sejong">세종</option>
                <option value="gangwon">강원</option>
                <option value="chungbuk">충북</option>
                <option value="chungnam">충남</option>
                <option value="jeonbuk">전북</option>
                <option value="jeonnam">전남</option>
                <option value="gyeongbuk">경북</option>
                <option value="gyeongnam">경남</option>
                <option value="jeju">제주</option>
              </select>
            </div>
          </>
        )}

        {(config.motion === 'all-at-once' || 
          (config.motion === 'grouped' && 
           validationState.email.isValid && 
           validationState.password.isValid &&
           formData.name.trim() !== "" &&
           formData.phone.trim() !== "" &&
           formData.birthdate.length === 6 &&
           formData.gender !== "" &&
           formData.region !== "")) && (
          <button
            onClick={handleCompleteCurrentExperiment}
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