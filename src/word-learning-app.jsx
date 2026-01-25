import React, { useState, useEffect } from 'react';
import { Volume2, Plus, Trash2, Play, Award, Book } from 'lucide-react';

const WordLearningApp = () => {
  // 사용자 관리
  const [users] = useState([
    { id: 'dad', name: '진호경', emoji: '👨‍💼', color: 'blue' },
    { id: 'sungwoon', name: '진성운', emoji: '👦', color: 'green' },
    { id: 'sungryul', name: '진성율', emoji: '🧒', color: 'orange' }
  ]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserSelect, setShowUserSelect] = useState(true);
  
  // CSV 라인을 제대로 파싱하는 함수 (큰따옴표 처리)
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };
  
  const [currentWords, setCurrentWords] = useState([]); // 이번 주 단어
  const [reviewWords, setReviewWords] = useState([]); // 복습 단어
  const [newWord, setNewWord] = useState({ english: '', korean: '' });
  const [gameMode, setGameMode] = useState('menu'); // menu, matching, spelling
  const [sessionType, setSessionType] = useState('current'); // current, review
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [matchingOptions, setMatchingOptions] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  // 현재 사용자 로드
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && users.find(u => u.id === savedUser)) {
      setCurrentUser(savedUser);
      setShowUserSelect(false);
      loadUserData(savedUser);
    }
  }, []);

  // 사용자 데이터 로드
  const loadUserData = (userId) => {
    const savedCurrent = localStorage.getItem(`${userId}_currentWords`);
    const savedReview = localStorage.getItem(`${userId}_reviewWords`);
    if (savedCurrent) {
      setCurrentWords(JSON.parse(savedCurrent));
    }
    if (savedReview) {
      setReviewWords(JSON.parse(savedReview));
    }
  };

  // 사용자 선택
  const selectUser = (userId) => {
    setCurrentUser(userId);
    localStorage.setItem('currentUser', userId);
    setShowUserSelect(false);
    loadUserData(userId);
  };

  // 사용자 전환
  const switchUser = () => {
    setShowUserSelect(true);
    setGameMode('menu');
  };

  // 현재 단어 저장
  const saveCurrentWords = (updatedWords) => {
    if (!currentUser) return;
    localStorage.setItem(`${currentUser}_currentWords`, JSON.stringify(updatedWords));
    setCurrentWords(updatedWords);
  };

  // 복습 단어 저장
  const saveReviewWords = (updatedWords) => {
    if (!currentUser) return;
    localStorage.setItem(`${currentUser}_reviewWords`, JSON.stringify(updatedWords));
    setReviewWords(updatedWords);
  };

  // 단어 추가 (이번 주 단어)
  const addWord = () => {
    if (newWord.english.trim() && newWord.korean.trim()) {
      const updatedWords = [...currentWords, { ...newWord, id: Date.now() }];
      saveCurrentWords(updatedWords);
      setNewWord({ english: '', korean: '' });
    }
  };

  // 단어 삭제 (이번 주 단어)
  const deleteWord = (id) => {
    const updatedWords = currentWords.filter(w => w.id !== id);
    saveCurrentWords(updatedWords);
  };

  // 이번 주 단어를 복습으로 이동
  const moveToReview = () => {
    if (currentWords.length === 0) {
      alert('이동할 단어가 없습니다!');
      return;
    }
    
    // 현재 단어들을 복습 단어에 추가
    const updatedReview = [...reviewWords, ...currentWords];
    saveReviewWords(updatedReview);
    
    // 현재 단어 초기화
    saveCurrentWords([]);
    
    alert(`${currentWords.length}개의 단어가 복습 단어로 이동되었습니다!`);
  };

  // 복습 단어 삭제
  const deleteReviewWord = (id) => {
    const updatedWords = reviewWords.filter(w => w.id !== id);
    saveReviewWords(updatedWords);
  };

  // CSV 내보내기
  const exportToCSV = () => {
    const allWords = [
      ...currentWords.map(w => ({ ...w, type: 'current' })),
      ...reviewWords.map(w => ({ ...w, type: 'review' }))
    ];
    
    if (allWords.length === 0) {
      alert('내보낼 단어가 없습니다!');
      return;
    }
    
    const csvContent = [
      'english,korean,type',
      ...allWords.map(w => `${w.english},${w.korean},${w.type}`)
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const userName = users.find(u => u.id === currentUser)?.name || 'user';
    const date = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `단어장_${userName}_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV 불러오기
  const importFromCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          alert('CSV 파일이 비어있습니다!');
          return;
        }
        
        const headers = parseCSVLine(lines[0].toLowerCase());
        const englishIdx = headers.indexOf('english');
        const koreanIdx = headers.indexOf('korean');
        const typeIdx = headers.indexOf('type');
        
        if (englishIdx === -1 || koreanIdx === -1) {
          alert('CSV 형식이 올바르지 않습니다!\n필수 열: english, korean');
          return;
        }
        
        const newCurrentWords = [...currentWords];
        const newReviewWords = [...reviewWords];
        let importCount = 0;
        
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          if (values.length < 2) continue;
          
          const english = values[englishIdx];
          const korean = values[koreanIdx];
          const type = typeIdx >= 0 ? values[typeIdx] : 'current';
          
          if (!english || !korean) continue;
          
          const word = {
            id: Date.now() + i,
            english,
            korean
          };
          
          if (type === 'review') {
            newReviewWords.push(word);
          } else {
            newCurrentWords.push(word);
          }
          importCount++;
        }
        
        saveCurrentWords(newCurrentWords);
        saveReviewWords(newReviewWords);
        
        alert(`${importCount}개의 단어를 불러왔습니다!`);
      } catch (error) {
        alert('파일을 읽는 중 오류가 발생했습니다!');
        console.error(error);
      }
    };
    
    reader.readAsText(file, 'UTF-8');
    event.target.value = ''; // 같은 파일 다시 선택 가능하도록
  };

  // GitHub에서 CSV 불러오기
  const loadFromGitHub = async (mode = 'add') => {
    const githubUsername = 'Ted-coGit'; // GitHub 사용자명으로 교체 필요
    const repoName = 'word-learning-app';
    
    const fileNames = {
      'dad': '진호경.csv',
      'sungwoon': '진성운.csv',
      'sungryul': '진성율.csv'
    };
    
    const fileName = fileNames[currentUser];
    const url = `https://raw.githubusercontent.com/${githubUsername}/${repoName}/main/data/${fileName}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        alert('GitHub에서 파일을 찾을 수 없습니다.\n파일이 업로드되어 있는지 확인해주세요.');
        return;
      }
      
      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        alert('CSV 파일이 비어있습니다!');
        return;
      }
      
      const headers = parseCSVLine(lines[0].toLowerCase());
      const englishIdx = headers.indexOf('english');
      const koreanIdx = headers.indexOf('korean');
      const typeIdx = headers.indexOf('type');
      
      if (englishIdx === -1 || koreanIdx === -1) {
        alert('CSV 형식이 올바르지 않습니다!');
        return;
      }
      
      let newCurrentWords = mode === 'replace' ? [] : [...currentWords];
      let newReviewWords = mode === 'replace' ? [] : [...reviewWords];
      let importCount = 0;
      
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length < 2) continue;
        
        const english = values[englishIdx];
        const korean = values[koreanIdx];
        const type = typeIdx >= 0 ? values[typeIdx] : 'current';
        
        if (!english || !korean) continue;
        
        // 중복 체크 - 이번 주 단어와 복습 단어 전체에서 확인
        const isDuplicateInCurrent = newCurrentWords
          .some(w => w.english.toLowerCase() === english.toLowerCase());
        const isDuplicateInReview = newReviewWords
          .some(w => w.english.toLowerCase() === english.toLowerCase());
        const isDuplicate = isDuplicateInCurrent || isDuplicateInReview;
        
        if (isDuplicate && mode === 'add') continue;
        
        const word = {
          id: Date.now() + i + Math.random(),
          english,
          korean
        };
        
        if (type === 'review') {
          newReviewWords.push(word);
        } else {
          newCurrentWords.push(word);
        }
        importCount++;
      }
      
      saveCurrentWords(newCurrentWords);
      saveReviewWords(newReviewWords);
      
      const modeText = mode === 'replace' ? '교체' : '추가';
      alert(`✅ GitHub에서 ${importCount}개의 단어를 ${modeText}했습니다!`);
      
    } catch (error) {
      alert('GitHub에서 파일을 불러오는 중 오류가 발생했습니다.\n인터넷 연결을 확인해주세요.');
      console.error(error);
    }
  };

  // GitHub 불러오기 모드 선택
  const showGitHubLoadOptions = () => {
    const mode = window.confirm(
      '어떻게 불러올까요?\n\n' +
      '확인 = 기존 단어에 추가\n' +
      '취소 = 완전히 새로 시작 (기존 단어 삭제)'
    );
    
    loadFromGitHub(mode ? 'add' : 'replace');
  };

  // 발음 재생 (Web Speech API)
  const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  // 효과음 재생
  const playSound = (isCorrect) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (isCorrect) {
      // 정답: 상승하는 화음
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } else {
      // 오답: 재미있는 하강음
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
      oscillator.type = 'triangle';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  // 게임 시작
  const startGame = (mode, session) => {
    const wordsToUse = session === 'current' ? currentWords : reviewWords;
    
    if (wordsToUse.length === 0) {
      alert(session === 'current' ? '먼저 이번 주 단어를 추가해주세요!' : '복습할 단어가 없습니다!');
      return;
    }
    
    if (mode === 'matching' && wordsToUse.length < 4) {
      alert('짝맞추기는 최소 4개의 단어가 필요합니다!');
      return;
    }
    
    setSessionType(session);
    setGameMode(mode);
    setCurrentWordIndex(0);
    setScore(0);
    setTotalAttempts(0);
    setUserAnswer('');
    setShowFeedback(false);
    
    if (mode === 'matching') {
      generateMatchingOptions(0, wordsToUse);
    }
  };

  // 짝맞추기 옵션 생성
  const generateMatchingOptions = (wordIndex, wordsArray) => {
    const words = wordsArray || (sessionType === 'current' ? currentWords : reviewWords);
    const currentWord = words[wordIndex];
    const otherWords = words.filter((_, i) => i !== wordIndex);
    const shuffled = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...shuffled, currentWord].sort(() => Math.random() - 0.5);
    setMatchingOptions(options);
  };

  // 짝맞추기 정답 확인
  const checkMatching = (selectedWord) => {
    const words = sessionType === 'current' ? currentWords : reviewWords;
    const currentWord = words[currentWordIndex];
    const isCorrect = selectedWord.id === currentWord.id;
    
    setTotalAttempts(prev => prev + 1);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('🎉 잘했어요!');
      speakWord(currentWord.english);
      playSound(true);
      
      // 정답이면 다음 문제로
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        if (currentWordIndex < words.length - 1) {
          const nextIndex = currentWordIndex + 1;
          setCurrentWordIndex(nextIndex);
          generateMatchingOptions(nextIndex, words);
        } else {
          setGameMode('result');
        }
      }, 1500);
    } else {
      // 틀리면 피드백만 보여주고 다시 선택 가능
      setFeedback(`😊 아니에요! 다시 선택해보세요`);
      playSound(false);
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
      }, 1000);
    }
  };

  // 스펠링 정답 확인
  const checkSpelling = () => {
    const words = sessionType === 'current' ? currentWords : reviewWords;
    const currentWord = words[currentWordIndex];
    const isCorrect = userAnswer.toLowerCase().trim() === currentWord.english.toLowerCase().trim();
    
    setTotalAttempts(prev => prev + 1);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('🌟 완벽해요!');
      speakWord(currentWord.english);
      playSound(true);
      
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        setUserAnswer('');
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
        } else {
          setGameMode('result');
        }
      }, 1500);
    } else {
      // 틀리면 피드백 보여주고 입력창 초기화
      setFeedback(`😊 아쉬워요! 다시 써보세요`);
      playSound(false);
      setShowFeedback(true);
      
      setTimeout(() => {
        setShowFeedback(false);
        setUserAnswer(''); // 입력창 초기화
      }, 1500);
    }
  };

  // 결과 화면 렌더링
  const renderResult = () => {
    const percentage = Math.round((score / totalAttempts) * 100);
    let message = '';
    
    if (percentage === 100) {
      message = '🏆 완벽해요! 천재예요!';
    } else if (percentage >= 80) {
      message = '🎖️ 정말 잘했어요!';
    } else if (percentage >= 60) {
      message = '👍 좋아요! 조금만 더!';
    } else {
      message = '💪 괜찮아요! 다시 해봐요!';
    }
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <Award className="w-24 h-24 mx-auto mb-6 text-yellow-500" />
          <h2 className="text-4xl font-bold mb-4 text-gray-800">{message}</h2>
          <div className="text-6xl font-bold text-purple-600 mb-6">
            {score} / {totalAttempts}
          </div>
          <div className="text-2xl text-gray-600 mb-8">
            정답률: {percentage}%
          </div>
          <button
            onClick={() => setGameMode('menu')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-xl font-bold hover:shadow-lg transform hover:scale-105 transition"
          >
            처음으로
          </button>
        </div>
      </div>
    );
  };

  // 사용자 선택 화면
  if (showUserSelect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full">
          <h1 className="text-5xl font-bold text-center mb-4 text-purple-600">
            🎓 영단어 학습 친구
          </h1>
          <p className="text-center text-gray-600 mb-12 text-xl">
            누가 공부할까요?
          </p>
          
          <div className="space-y-4">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => selectUser(user.id)}
                className={`w-full p-8 rounded-2xl border-4 hover:scale-105 transform transition shadow-lg bg-gradient-to-r ${
                  user.color === 'blue' ? 'from-blue-400 to-blue-600 border-blue-300' :
                  user.color === 'green' ? 'from-green-400 to-green-600 border-green-300' :
                  'from-orange-400 to-orange-600 border-orange-300'
                }`}
              >
                <div className="flex items-center justify-center gap-6">
                  <span className="text-7xl">{user.emoji}</span>
                  <span className="text-4xl font-bold text-white">{user.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 현재 사용자 정보 가져오기
  const currentUserInfo = users.find(u => u.id === currentUser);
  
  // 메뉴 화면
  if (gameMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            {/* 헤더 - 사용자 정보 및 전환 버튼 */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-purple-600">
                🎓 영단어 학습 친구
              </h1>
              <div className="flex items-center gap-4">
                <div className={`px-6 py-3 rounded-full font-bold text-white text-xl bg-gradient-to-r ${
                  currentUserInfo.color === 'blue' ? 'from-blue-400 to-blue-600' :
                  currentUserInfo.color === 'green' ? 'from-green-400 to-green-600' :
                  'from-orange-400 to-orange-600'
                }`}>
                  {currentUserInfo.emoji} {currentUserInfo.name}
                </div>
                <button
                  onClick={switchUser}
                  className="bg-gray-500 text-white px-4 py-3 rounded-full hover:bg-gray-600 transition font-bold"
                >
                  사용자 전환
                </button>
              </div>
            </div>

            {/* CSV 내보내기/불러오기 버튼 */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={exportToCSV}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl hover:shadow-lg transition font-bold flex items-center justify-center gap-2"
              >
                📥 내보내기
              </button>
              <label className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-3 rounded-xl hover:shadow-lg transition font-bold flex items-center justify-center gap-2 cursor-pointer">
                📤 불러오기
                <input
                  type="file"
                  accept=".csv"
                  onChange={importFromCSV}
                  className="hidden"
                />
              </label>
              <button
                onClick={showGitHubLoadOptions}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-xl hover:shadow-lg transition font-bold flex items-center justify-center gap-2"
              >
                🔄 새로고침
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 이번 주 단어 섹션 */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
                <h2 className="text-3xl font-bold mb-4 text-green-600 flex items-center gap-2">
                  📚 이번 주 단어
                </h2>
                
                {/* 단어 추가 */}
                <div className="mb-6">
                  <div className="space-y-3 mb-3">
                    <input
                      type="text"
                      placeholder="영어 (예: sunny)"
                      value={newWord.english}
                      onChange={(e) => setNewWord({ ...newWord, english: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-green-300 rounded-xl text-lg focus:outline-none focus:border-green-500"
                      onKeyPress={(e) => e.key === 'Enter' && document.querySelector('input[placeholder*="뜻"]').focus()}
                    />
                    <input
                      type="text"
                      placeholder="뜻 (예: 화창한)"
                      value={newWord.korean}
                      onChange={(e) => setNewWord({ ...newWord, korean: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-green-300 rounded-xl text-lg focus:outline-none focus:border-green-500"
                      onKeyPress={(e) => e.key === 'Enter' && addWord()}
                    />
                    <button
                      onClick={addWord}
                      className="w-full bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition font-bold text-lg flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      단어 추가하기
                    </button>
                  </div>
                </div>

                {/* 이번 주 단어 목록 */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-gray-800">
                      단어 목록 ({currentWords.length}개)
                    </h3>
                    {currentWords.length > 0 && (
                      <button
                        onClick={moveToReview}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                      >
                        복습으로 이동 →
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {currentWords.map((word) => (
                      <div
                        key={word.id}
                        className="flex items-center justify-between p-3 bg-white rounded-xl hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <button
                            onClick={() => speakWord(word.english)}
                            className="text-blue-500 hover:text-blue-600 flex-shrink-0"
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                          <div className="flex-1 min-w-0">
                            <span className="text-lg font-bold text-gray-800 block">{word.english}</span>
                            <span className="text-sm text-gray-600 block">{word.korean}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteWord(word.id)}
                          className="text-red-500 hover:text-red-600 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 이번 주 단어 게임 버튼 */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => startGame('matching', 'current')}
                    disabled={currentWords.length < 4}
                    className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Book className="w-10 h-10 mx-auto mb-2" />
                    <div className="text-xl font-bold">짝맞추기</div>
                    <div className="text-xs mt-1">최소 4개 필요</div>
                  </button>
                  
                  <button
                    onClick={() => startGame('spelling', 'current')}
                    disabled={currentWords.length === 0}
                    className="bg-gradient-to-r from-purple-400 to-pink-500 text-white p-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-10 h-10 mx-auto mb-2" />
                    <div className="text-xl font-bold">스펠링</div>
                    <div className="text-xs mt-1">직접 쓰기</div>
                  </button>
                </div>
              </div>

              {/* 복습 단어 섹션 */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6">
                <h2 className="text-3xl font-bold mb-4 text-orange-600 flex items-center gap-2">
                  🔄 복습 단어
                </h2>
                
                {/* 복습 단어 목록 */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    복습할 단어 ({reviewWords.length}개)
                  </h3>
                  <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
                    {reviewWords.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>아직 복습할 단어가 없어요</p>
                        <p className="text-sm mt-2">이번 주 단어를 완료하면 여기로 이동됩니다</p>
                      </div>
                    ) : (
                      reviewWords.map((word) => (
                        <div
                          key={word.id}
                          className="flex items-center justify-between p-3 bg-white rounded-xl hover:bg-gray-50 transition"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <button
                              onClick={() => speakWord(word.english)}
                              className="text-orange-500 hover:text-orange-600 flex-shrink-0"
                            >
                              <Volume2 className="w-5 h-5" />
                            </button>
                            <div className="flex-1 min-w-0">
                              <span className="text-lg font-bold text-gray-800 block">{word.english}</span>
                              <span className="text-sm text-gray-600 block">{word.korean}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteReviewWord(word.id)}
                            className="text-red-500 hover:text-red-600 flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 복습 게임 버튼 */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => startGame('matching', 'review')}
                    disabled={reviewWords.length < 4}
                    className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Book className="w-10 h-10 mx-auto mb-2" />
                    <div className="text-xl font-bold">짝맞추기</div>
                    <div className="text-xs mt-1">최소 4개 필요</div>
                  </button>
                  
                  <button
                    onClick={() => startGame('spelling', 'review')}
                    disabled={reviewWords.length === 0}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-10 h-10 mx-auto mb-2" />
                    <div className="text-xl font-bold">스펠링</div>
                    <div className="text-xs mt-1">직접 쓰기</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (gameMode === 'result') {
    return renderResult();
  }

  // 짝맞추기 게임
  if (gameMode === 'matching') {
    const words = sessionType === 'current' ? currentWords : reviewWords;
    const currentWord = words[currentWordIndex];
    const sessionTitle = sessionType === 'current' ? '이번 주 단어' : '복습 단어';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-lg text-purple-600 mb-2 font-bold">
              {sessionTitle} - 짝맞추기
            </div>
            <div className="text-xl text-gray-600 mb-2">
              문제 {currentWordIndex + 1} / {words.length}
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-4">
              점수: {score} / {totalAttempts}
            </div>
          </div>

          <div className="mb-12 p-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl">
            <div className="text-center">
              <div className="text-lg text-gray-600 mb-2">이 뜻의 영어 단어는?</div>
              <div className="text-5xl font-bold text-gray-800">{currentWord.korean}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {matchingOptions.map((word) => (
              <button
                key={word.id}
                onClick={() => checkMatching(word)}
                disabled={showFeedback}
                className="bg-white border-4 border-blue-300 p-6 rounded-2xl text-2xl font-bold text-gray-800 hover:bg-blue-50 hover:border-blue-500 transform hover:scale-105 transition disabled:opacity-50"
              >
                {word.english}
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className="text-center space-y-4">
              <div className="text-3xl font-bold text-purple-600 animate-bounce">
                {feedback}
              </div>
              {feedback.includes('아니에요') && (
                <button
                  onClick={() => {
                    setShowFeedback(false);
                    if (currentWordIndex < words.length - 1) {
                      const nextIndex = currentWordIndex + 1;
                      setCurrentWordIndex(nextIndex);
                      generateMatchingOptions(nextIndex, words);
                    } else {
                      setGameMode('result');
                    }
                  }}
                  className="bg-orange-500 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-orange-600 transition"
                >
                  ⏭️ 이 단어 넘어가기
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 스펠링 쓰기 게임
  if (gameMode === 'spelling') {
    const words = sessionType === 'current' ? currentWords : reviewWords;
    const currentWord = words[currentWordIndex];
    const sessionTitle = sessionType === 'current' ? '이번 주 단어' : '복습 단어';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-500 p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-lg text-orange-600 mb-2 font-bold">
              {sessionTitle} - 스펠링 쓰기
            </div>
            <div className="text-xl text-gray-600 mb-2">
              문제 {currentWordIndex + 1} / {words.length}
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-4">
              점수: {score} / {totalAttempts}
            </div>
          </div>

          <div className="mb-8 p-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
            <div className="text-center">
              <div className="text-lg text-gray-600 mb-4">이 뜻의 스펠링을 써보세요</div>
              <div className="text-5xl font-bold text-gray-800 mb-6">{currentWord.korean}</div>
              <button
                onClick={() => speakWord(currentWord.english)}
                className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition flex items-center gap-2 mx-auto"
              >
                <Volume2 className="w-5 h-5" />
                발음 듣기
              </button>
            </div>
          </div>

          <div className="mb-8">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !showFeedback && checkSpelling()}
              placeholder="여기에 영어 단어를 입력하세요"
              disabled={showFeedback}
              className="w-full px-6 py-4 border-4 border-purple-300 rounded-2xl text-3xl text-center font-bold focus:outline-none focus:border-purple-500 disabled:opacity-50"
              autoFocus
            />
          </div>

          {!showFeedback && (
            <button
              onClick={checkSpelling}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl text-2xl font-bold hover:shadow-lg transform hover:scale-105 transition"
            >
              확인하기
            </button>
          )}

          {showFeedback && (
            <div className="text-center space-y-4">
              <div className="text-3xl font-bold text-purple-600 animate-bounce">
                {feedback}
              </div>
              {feedback.includes('아쉬워요') && (
                <button
                  onClick={() => {
                    setShowFeedback(false);
                    setUserAnswer('');
                    if (currentWordIndex < words.length - 1) {
                      setCurrentWordIndex(prev => prev + 1);
                    } else {
                      setGameMode('result');
                    }
                  }}
                  className="bg-orange-500 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-orange-600 transition"
                >
                  ⏭️ 이 단어 넘어가기
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default WordLearningApp;
