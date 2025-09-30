import React, { useEffect } from 'react';

const AdSenseAd: React.FC = () => {
  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (err) {
      console.log('AdSense error:', err);
    }
  }, []);

  return (
    <div style={{ 
      textAlign: 'center',
      marginBottom: 32,
      padding: '20px 0'
    }}>
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-2772763439292423"
           data-ad-slot="1380700398"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
};

export default AdSenseAd;
