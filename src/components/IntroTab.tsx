import React from 'react';
import { TabType } from '../types';
import ContactSection from './ContactSection';
import CurvedLoopText from './CurvedLoopText';

interface IntroTabProps {
  setActiveTab: (tab: TabType) => void;
}

const IntroTab: React.FC<IntroTabProps> = ({ setActiveTab }) => {
  return (
    <div>
      {/* 히어로 섹션 */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        borderRadius: 16,
        padding: 60,
        textAlign: 'center',
        marginBottom: 40,
        border: '1px solid #3a3a3a',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 배경 패턴 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(74, 144, 226, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(74, 144, 226, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(74, 144, 226, 0.05) 0%, transparent 50%)
          `,
          zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="english-text" style={{
            fontSize: 48,
            marginBottom: 12,
            fontWeight: 300,
            letterSpacing: '2px',
            color: '#fff'
          }}>
            <span style={{ fontWeight: 700 }}>DIVE</span> : Dive in Dividend
          </div>
          
          <h2 style={{
            color: '#4a90e2',
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 16,
            lineHeight: 1.2
          }}>
            배당 재투자를 위한 플래너, <span style={{ fontWeight: 800 }}>다이브</span>
          </h2>
          
          <p style={{
            color: '#aaa',
            fontSize: 18,
            lineHeight: 1.6,
            maxWidth: 600,
            margin: '0 auto 32px auto'
          }}>
            스마트한 배당 재투자 전략으로 목표를 달성하세요.<br />
            포트폴리오 관리부터 시뮬레이션까지 한 번에.
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 16,
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setActiveTab('portfolio')}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #4a90e2, #357abd)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.border = '2px solid #4a90e2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.border = '2px solid #4a90e2';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              style={{
                background: 'transparent',
                color: '#fff',
                border: '2px solid #4a90e2',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: 'scale(1)'
              }}
            >
              📊 포트폴리오 시작하기
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #4a90e2, #357abd)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.border = '2px solid #4a90e2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.border = '2px solid #4a90e2';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              style={{
                background: 'transparent',
                color: '#fff',
                border: '2px solid #4a90e2',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: 'scale(1)'
              }}
            >
              🎯 목표 시뮬레이션
            </button>
          </div>
        </div>
      </div>

      {/* 철학 섹션 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 24,
        marginBottom: 40
      }}>
        {[
          {
            icon: '💡',
            title: '배당 재투자의 힘',
            desc: '배당금을 단순히 소비하지 않고 재투자할 때, 복리의 마법이 시작됩니다. 시간이 지날수록 가속화되는 성장을 경험하세요.'
          },
          {
            icon: '📊',
            title: '데이터 기반 의사결정',
            desc: '감정이 아닌 수치로 투자하세요. 정확한 시뮬레이션을 통해 목표 달성 시점을 예측하고 전략을 수정할 수 있습니다.'
          },
          {
            icon: '🎯',
            title: '목표 중심 설계',
            desc: '막연한 투자가 아닌 명확한 목표를 설정하세요. 언제까지 얼마를 모을 것인지, 어떤 전략이 최적인지 한눈에 파악할 수 있습니다.'
          }
        ].map((item, index) => (
          <div key={index} style={{
            background: '#1a1a1a',
            borderRadius: 12,
            padding: '32px 40px',
            border: '1px solid #3a3a3a'
          }}>
            <div style={{
              fontSize: 24,
              marginBottom: 16,
              textAlign: 'center'
            }}>{item.icon}</div>
            <h3 style={{
              color: '#fff',
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 16,
              textAlign: 'center'
            }}>
              {item.title}
            </h3>
            <p style={{
              color: '#aaa',
              fontSize: 16,
              lineHeight: 1.6,
              textAlign: 'center'
            }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 명언 섹션 */}
      <div style={{
        background: '#1a1a1a',
        borderRadius: 20,
        padding: '60px 60px 40px 60px',
        marginBottom: 40,
        textAlign: 'center',
        position: 'relative',
        border: '1px solid #3a3a3a'
      }}>
        {/* 큰 인용부호 */}
        <div style={{
          fontSize: 80,
          color: '#4a90e2',
          lineHeight: 0.5,
          marginBottom: 30,
          fontFamily: 'Georgia, serif',
          opacity: 0.6,
          fontWeight: 'bold'
        }}>
          ❞
        </div>
        
        {/* 영문 명언 */}
        <div style={{
          color: '#fff',
          fontSize: 36,
          fontWeight: 400,
          lineHeight: 1.4,
          marginBottom: 40,
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          maxWidth: 800,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          "My wealth has come from a combination of living in America,<br />
          some lucky genes, and compound interest."
        </div>
        
        {/* 구분선 */}
        <div style={{
          width: 100,
          height: 1,
          background: '#4a90e2',
          margin: '40px auto',
          opacity: 0.5
        }} />
        
        {/* 한글 번역 */}
        <div style={{
          color: '#aaa',
          fontSize: 20,
          fontWeight: 400,
          lineHeight: 1.6,
          marginBottom: 20,
          maxWidth: 600,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          "내 부는 미국에서 살았다는 것, 운 좋은 유전자,<br />
          그리고 복리의 힘이 결합된 결과입니다."
        </div>
        
        {/* 출처 */}
        <div style={{
          color: '#4a90e2',
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: '1px'
        }}>
          - 워렌 버핏 -
        </div>
        
        {/* DIVE 연결 메시지 */}
        <div style={{
          marginTop: 20,
          padding: '20px 30px',
          background: 'rgba(74, 144, 226, 0.1)',
          borderRadius: 12,
          border: '1px solid rgba(74, 144, 226, 0.2)'
        }}>
          <p style={{
            color: '#4a90e2',
            fontSize: 16,
            lineHeight: 1.5,
            margin: 0,
            fontWeight: 500
          }}>
            배당 투자도 마찬가지입니다. <strong>현재에 집중</strong>하며 <strong>꾸준히 실행</strong>할 때,<br />
            복리의 힘이 시간과 함께 당신의 목표를 현실로 만들어 줍니다.
          </p>
        </div>
      </div>

      {/* Curved Loop Text Animation */}
      <CurvedLoopText />

      {/* 특징 섹션 */}
      <div style={{
        background: '#1a1a1a',
        borderRadius: 16,
        padding: 40,
        border: '1px solid #3a3a3a',
        marginBottom: 40
      }}>
        <h3 style={{
          color: '#fff',
          fontSize: 24,
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: 32
        }}>
          🚀 DIVE만의 특별함
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 24
        }}>
          {[
            {
              icon: '📈',
              title: '실시간 계산',
              desc: '입력값 변경 시 즉시 결과 업데이트'
            },
            {
              icon: '🔄',
              title: '다중 시나리오',
              desc: 'A, B, C, D 시나리오 동시 비교'
            },
            {
              icon: '📊',
              title: '시각적 분석',
              desc: '직관적인 그래프와 차트'
            }
          ].map((feature, index) => (
            <div key={index} style={{
              textAlign: 'center',
              padding: 20
            }}>
              <div style={{
                fontSize: 32,
                marginBottom: 12
              }}>
                {feature.icon}
              </div>
              <h4 style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 8
              }}>
                {feature.title}
              </h4>
              <p style={{
                color: '#aaa',
                fontSize: 14,
                lineHeight: 1.4,
                margin: 0
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 문의하기 섹션 */}
      <ContactSection />
    </div>
  );
};

export default IntroTab;
