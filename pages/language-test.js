import React, { useState } from 'react';

export default function LanguageTest() {
  const [language, setLanguage] = useState('hi');
  
  const content = {
    en: {
      title: "English Title",
      description: "This is English text"
    },
    hi: {
      title: "हिंदी शीर्षक",
      description: "यह हिंदी पाठ है"
    }
  };
  
  const texts = content[language];
  
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Language Toggle Test</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => setLanguage('en')}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: language === 'en' ? '#0A6B3A' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          English
        </button>
        <button 
          onClick={() => setLanguage('hi')}
          style={{ 
            padding: '10px 20px',
            backgroundColor: language === 'hi' ? '#0A6B3A' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          हिंदी
        </button>
      </div>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '8px'
      }}>
        <h2>{texts.title}</h2>
        <p>{texts.description}</p>
        <p><strong>Current language:</strong> {language}</p>
      </div>
    </div>
  );
}