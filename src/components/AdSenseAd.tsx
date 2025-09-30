import React from 'react';

interface AdSenseAdProps {
  slot?: string;
  format?: string;
  style?: React.CSSProperties;
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({ 
  slot = "1380700398", 
  format = "auto",
  style = {}
}) => {
  // 간단한 광고 플레이스홀더
  return (
    <div style={{ 
      textAlign: 'center',
      marginBottom: 16,
      padding: '10px 0',
      minHeight: '100px',
      background: '#1a1a1a',
      borderRadius: 8,
      border: '1px solid #3a3a3a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }}>
      <div style={{
        color: '#666',
        fontSize: '14px',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{ marginBottom: '8px' }}>📺</div>
        <div>광고 영역</div>
        <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
          AdSense 승인 후 표시됩니다
        </div>
      </div>
    </div>
  );
};

export default AdSenseAd;
