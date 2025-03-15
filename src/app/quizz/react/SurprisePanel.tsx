import React from 'react';
import Confetti from 'react-confetti';

interface SurprisePanelProps {
  result: string;
  onRestart: () => void;
}

const SurprisePanel: React.FC<SurprisePanelProps> = ({ result, onRestart }) => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  console.log("SurprisePanel: Renderizando componente com resultado:", result);
  console.log("Dimensões do Confetti:", { width, height });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(to bottom, #0f0326, #2a1a5e)', // Fundo gradiente
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      color: '#ffffff',
      overflow: 'hidden',
    }}>
      <Confetti
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2001 }}
      />
      <div style={{
        textAlign: 'center',
        background: 'rgba(15, 3, 38, 0.7)',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        width: '90%',
        maxWidth: '600px',
        minWidth: '300px',
        zIndex: 2002,
      }}>
        <h1 style={{
          fontSize: '36px',
          textShadow: '2px 2px 4px #ff00ff',
          marginBottom: '25px',
          whiteSpace: 'normal',
          wordBreak: 'normal',
        }}>
          Parabéns, você terminou!
        </h1>
        <p style={{
          fontSize: '24px',
          marginBottom: '40px',
          whiteSpace: 'normal',
          wordBreak: 'normal',
          lineHeight: '1.6',
        }}>
          Seu resultado: <strong>{result}</strong>
        </p>
        <button
          onClick={onRestart}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
            border: 'none',
            borderRadius: '8px',
            color: '#ffffff',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.5s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Jogar Novamente
        </button>
      </div>
    </div>
  );
};

export default SurprisePanel;