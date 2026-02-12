import React, { useState, useEffect } from 'react';
import './App.css';

// 영화 데이터 (가격과 포스터 색상)
const MOVIES = [
  { id: 1, title: '어벤져스: 엔드게임', price: 12000, color: '#e74c3c' },
  { id: 2, title: '조커', price: 11000, color: '#8e44ad' },
  { id: 3, title: '토이 스토리 4', price: 10000, color: '#f1c40f' },
];

// 좌석 배치 (8x6 그리드)
const ROWS = 6;
const COLS = 8;

const App = () => {
  // 상태 관리
  const [selectedMovie, setSelectedMovie] = useState(MOVIES[0]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState({}); // { 영화ID: [좌석번호들] }

  // 1. 초기 데이터 로드 (LocalStorage)
  useEffect(() => {
    const savedSeats = localStorage.getItem('movie-occupied-seats');
    if (savedSeats) {
      setOccupiedSeats(JSON.parse(savedSeats));
    }
  }, []);

  // 2. 데이터 변경 시 저장
  useEffect(() => {
    localStorage.setItem('movie-occupied-seats', JSON.stringify(occupiedSeats));
  }, [occupiedSeats]);

  // 영화 변경 핸들러
  const handleMovieChange = (movie) => {
    setSelectedMovie(movie);
    setSelectedSeats([]); // 영화 바꾸면 선택 취소
  };

  // 좌석 클릭 핸들러
  const handleSeatClick = (seatId) => {
    // 이미 예매된 좌석은 무시
    if (occupiedSeats[selectedMovie.id]?.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // 예매하기 버튼 핸들러
  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert('좌석을 선택해주세요!');
      return;
    }

    if (window.confirm(`${selectedMovie.title}\n총 ${selectedSeats.length}석 예매하시겠습니까?`)) {
      // 기존 예매된 좌석 + 지금 선택한 좌석 합치기
      const currentOccupied = occupiedSeats[selectedMovie.id] || [];
      const newOccupied = [...currentOccupied, ...selectedSeats];

      setOccupiedSeats({
        ...occupiedSeats,
        [selectedMovie.id]: newOccupied,
      });

      setSelectedSeats([]);
      alert('예매가 완료되었습니다!');
    }
  };

  // 좌석 렌더링 함수
  const renderSeats = () => {
    const seats = [];
    const currentOccupied = occupiedSeats[selectedMovie.id] || [];

    for (let i = 0; i < ROWS * COLS; i++) {
      const isSelected = selectedSeats.includes(i);
      const isOccupied = currentOccupied.includes(i);
      
      let className = 'seat';
      if (isOccupied) className += ' occupied';
      else if (isSelected) className += ' selected';

      seats.push(
        <div
          key={i}
          className={className}
          onClick={() => handleSeatClick(i)}
        />
      );
    }
    return seats;
  };

  return (
    <div className="App">
      <h1>🎬 영화 예매 시스템</h1>
      
      {/* 1. 영화 선택 영역 */}
      <div className="movie-container">
        <label>영화 선택: </label>
        <select 
          onChange={(e) => handleMovieChange(MOVIES.find(m => m.id === parseInt(e.target.value)))}
          value={selectedMovie.id}
        >
          {MOVIES.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title} ({movie.price}원)
            </option>
          ))}
        </select>
      </div>

      {/* 2. 좌석 상태 설명 */}
      <ul className="showcase">
        <li>
          <div className="seat"></div>
          <small>선택 가능</small>
        </li>
        <li>
          <div className="seat selected"></div>
          <small>선택됨</small>
        </li>
        <li>
          <div className="seat occupied"></div>
          <small>예매 완료</small>
        </li>
      </ul>

      {/* 3. 스크린과 좌석 배치 */}
      <div className="theater-container">
        <div className="screen">SCREEN</div>
        <div className="row">
          {renderSeats()}
        </div>
      </div>

      {/* 4. 결제 정보 및 버튼 */}
      <p className="text">
        선택한 영화: <span>{selectedMovie.title}</span><br/>
        총 <span>{selectedSeats.length}</span>석, 
        결제 금액: <span>{selectedSeats.length * selectedMovie.price}</span>원
      </p>

      <button className="booking-btn" onClick={handleBooking}>
        예매하기
      </button>
    </div>
  );
};

export default App;