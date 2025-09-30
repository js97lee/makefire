import React from 'react';

const CurvedLoopText: React.FC = () => {
  const text = "Dive ✦ Deep ✦ Into ✦ Dividends ✦ ";
  const speed = 4.0; // 속도 대폭 증가
  const curve = 0;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      margin: '10px 0',
      height: '80px',
      overflow: 'hidden',
      width: '100%',
      position: 'relative'
    }}>
      <div
        style={{
          fontSize: '26px',
          fontWeight: 600,
          color: '#4a90e2',
          whiteSpace: 'nowrap',
          animation: `curvedLoop ${text.length / speed}s linear infinite`,
          transform: `translateY(${curve}px)`,
          position: 'absolute',
          left: '0'
        }}
      >
        {text.repeat(5)}
      </div>
      
      <style>{`
        @keyframes curvedLoop {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${text.length * 1.2}ch);
          }
        }
      `}</style>
    </div>
  );
};

export default CurvedLoopText;
