import React from 'react';

const ContactSection: React.FC = () => {
  return (
    <div style={{
      textAlign: 'center',
      marginTop: window.innerWidth <= 768 ? 10 : 15,
      paddingTop: window.innerWidth <= 768 ? 15 : 20,
      borderTop: '1px solid #3a3a3a'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: '#fff',
        fontSize: 16
      }}>
        <div style={{
          width: 16,
          height: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}        >
          📮
        </div>
        <span>문의</span>
        <span style={{ margin: '0 4px' }}>|</span>
        <a 
          href="mailto:Scarlettlee0317@gmail.com"
          style={{
            color: '#4a90e2',
            textDecoration: 'none',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#357abd';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#4a90e2';
          }}
        >
          Scarlettlee0317@gmail.com
        </a>
      </div>
      
      {/* 소개 텍스트 */}
      <div style={{
        marginTop: window.innerWidth <= 768 ? 12 : 16,
        padding: window.innerWidth <= 768 ? '12px' : '16px',
        background: '#1a1a1a',
        borderRadius: 12,
        border: '1px solid #3a3a3a',
        width: '100%',
        margin: window.innerWidth <= 768 ? '12px 0 30px 0' : '16px 0 40px 0',
        boxSizing: 'border-box'
      }}>
        <p style={{
          color: '#ccc',
          fontSize: 15,
          lineHeight: 1.7,
          margin: window.innerWidth <= 768 ? '0 20px' : '0 20px',
          textAlign: 'center'
        }}>
          배당 투자에 관심이 많은 UX디자이너, Scarlett 입니다 🐰💕 열심히 '뚝딱뚝딱' 🔨 ✨ 웹페이지를 만들어보고 있습니다 💻 🤍<br />
          관련해서 도움을 주시거나, 혹은 이야기를 함께 나누고 싶은 분이 있으시다면 편하게 메일 보내주세요 💌 투자 이야기 대환영입니다! 💰 ✨
        </p>
      </div>
    </div>
  );
};

export default ContactSection;
