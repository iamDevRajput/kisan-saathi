import React, { useState, useCallback } from 'react';

// Language content mapping - defined outside component to avoid recreation on every render
const content = {
  en: {
    // Navigation
    location: "Sadar Bazaar, Meerut, Uttar Pradesh",
    farmerName: "Ram Sharma",
    
    // Alert
    alertMessage: "Pest outbreak reported in your district. Take preventive measures.",
    
    // Weather Section
    weatherTitle: "Weather & Alerts",
    temperature: "Temperature",
    rainProbability: "Rain Probability",
    forecastTitle: "3-Day Forecast",
    advisoryTitle: "Advisory",
    advisoryText: "Heavy rain expected in 48 hrs – Avoid fertilizer application.",
    
    // Crop Section
    cropsTitle: "Crop Overview",
    cropName: "Crop Name",
    growthStage: "Growth Stage",
    health: "Health",
    lastAdvisory: "Last Advisory",
    viewAdvisory: "View Advisory",
    
    // Soil Section
    soilTitle: "Soil & Fertilizer Recommendation",
    soilHealth: "Soil Health Score",
    phLevel: "pH Level",
    npk: "Recommended NPK",
    nextAction: "Next Action Date",
    
    // Quick Actions
    actionsTitle: "Quick Actions",
    uploadPest: "Upload Pest Image",
    askAI: "Ask AI Assistant",
    checkMarket: "Check Market Price",
    generateReport: "Generate Report",
    
    // Market Section
    marketTitle: "Market Snapshot",
    crop: "Crop",
    mandi: "Mandi",
    price: "Price (₹/Quintal)",
    trend: "Trend",
    
    // Voice Modal
    voiceTitle: "AI Assistant",
    listening: "Listening... Speak your question",
    close: "Close"
  },
  hi: {
    // Navigation
    location: "सदर बाजार, मेरठ, उत्तर प्रदेश",
    farmerName: "राम शर्मा",
    
    // Alert
    alertMessage: "आपके जिले में कीट का प्रकोप होने की सूचना। निवारक उपाय करें।",
    
    // Weather Section
    weatherTitle: "मौसम एवं चेतावनी",
    temperature: "तापमान",
    rainProbability: "बारिश की संभावना",
    forecastTitle: "3 दिन का पूर्वानुमान",
    advisoryTitle: "सलाह",
    advisoryText: "48 घंटों में भारी बारिश होने की संभावना है - उर्वरक का उपयोग न करें।",
    
    // Crop Section
    cropsTitle: "फसल अवलोकन",
    cropName: "फसल का नाम",
    growthStage: "वृद्धि अवस्था",
    health: "स्वास्थ्य",
    lastAdvisory: "अंतिम सलाह",
    viewAdvisory: "सलाह देखें",
    
    // Soil Section
    soilTitle: "मिट्टी एवं उर्वरक सुझाव",
    soilHealth: "मिट्टी का स्वास्थ्य अंक",
    phLevel: "pH स्तर",
    npk: "अनुशंसित NPK",
    nextAction: "अगली कार्यवाही की तारीख",
    
    // Quick Actions
    actionsTitle: "त्वरित कार्य",
    uploadPest: "कीट की तस्वीर अपलोड करें",
    askAI: "AI सहायक से पूछें",
    checkMarket: "बाजार मूल्य जांचें",
    generateReport: "रिपोर्ट जनरेट करें",
    
    // Market Section
    marketTitle: "बाजार अवलोकन",
    crop: "फसल",
    mandi: "मंडी",
    price: "मूल्य (₹/क्विंटल)",
    trend: "प्रवृत्ति",
    
    // Voice Modal
    voiceTitle: "AI सहायक",
    listening: "सुन रहा है... अपना प्रश्न बोलें",
    close: "बंद करें"
  }
};

// Mock data - defined outside component to avoid recreation on every render
const DEFAULT_WEATHER_DATA = {
  temperature: 28,
  rainProbability: 65,
  forecast: [
    { day: 'Today', date: '15 Jan', temp: 28, condition: 'Partly Cloudy' },
    { day: 'Tomorrow', date: '16 Jan', temp: 30, condition: 'Sunny' },
    { day: 'Day 3', date: '17 Jan', temp: 32, condition: 'Hot' }
  ]
};

const DEFAULT_CROP_DATA = [
  { 
    name: 'Wheat', 
    name_hi: 'गेहूँ',
    stage: 'Flowering', 
    stage_hi: 'पुष्पन अवस्था',
    health: 85, 
    lastAdvisory: '2026-01-15' 
  },
  { 
    name: 'Mustard', 
    name_hi: 'सरसों',
    stage: 'Ripening', 
    stage_hi: 'पकने की अवस्था',
    health: 78, 
    lastAdvisory: '2026-01-14' 
  }
];

const DEFAULT_SOIL_DATA = {
  healthScore: 82,
  phLevel: 6.8,
  npk: '20:15:10',
  nextAction: '25 Jan 2026'
};

const DEFAULT_MARKET_DATA = [
  { crop: 'Wheat', crop_hi: 'गेहूँ', mandi: 'Meerut', mandi_hi: 'मेरठ', price: 2450, trend: 'up' },
  { crop: 'Rice', crop_hi: 'चावल', mandi: 'Meerut', mandi_hi: 'मेरठ', price: 2800, trend: 'down' },
  { crop: 'Mustard', crop_hi: 'सरसों', mandi: 'Meerut', mandi_hi: 'मेरठ', price: 4200, trend: 'up' },
  { crop: 'Gram', crop_hi: 'चना', mandi: 'Meerut', mandi_hi: 'मेरठ', price: 5100, trend: 'stable' }
];

const KisanSaathiDashboard = () => {
  const [language, setLanguage] = useState('hi');
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(DEFAULT_WEATHER_DATA);
  const [cropData, setCropData] = useState(DEFAULT_CROP_DATA);
  const [soilData, setSoilData] = useState(DEFAULT_SOIL_DATA);
  const [marketData, setMarketData] = useState(DEFAULT_MARKET_DATA);

  // Get current language texts
  const texts = content[language];
  
  // Toggle language
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  // Handle voice assistant
  const handleVoiceAssistant = () => {
    setShowVoiceModal(true);
  };

  // Close voice modal
  const closeVoiceModal = () => {
    setShowVoiceModal(false);
  };

  // Close alert
  const closeAlert = () => {
    setShowAlert(false);
  };

  // Quick action handlers
  const handleQuickAction = useCallback((action) => {
    switch(action) {
      case 'upload':
        alert('Upload Pest Image feature activated');
        break;
      case 'ai':
        setShowVoiceModal(true);
        break;
      case 'market':
        alert('Market Price feature activated');
        break;
      case 'report':
        alert('Report Generation feature activated');
        break;
      default:
        break;
    }
  }, []);

  // Render trend indicator
  const renderTrend = useCallback((trend) => {
    switch(trend) {
      case 'up': return <span style={{color: '#4CAF50'}}>↗️ +2%</span>;
      case 'down': return <span style={{color: '#f44336'}}>↘️ -1%</span>;
      case 'stable': return <span style={{color: '#9e9e9e'}}>➡️ 0%</span>;
      default: return <span style={{color: '#9e9e9e'}}>➡️ 0%</span>;
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Top Navigation */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.8rem', color: '#0A6B3A' }}>🌱</span>
          <span style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: '#0A6B3A',
            background: 'linear-gradient(135deg, #0A6B3A 0%, #4CAF50 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            KisanSaathi
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: '#0A6B3A',
            fontWeight: '600'
          }}>
            <span>📍</span>
            <span>{texts.location}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              onClick={handleVoiceAssistant}
              style={{
                background: 'none',
                border: 'none',
                padding: '10px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.2rem',
                color: '#0A6B3A',
                transition: 'all 0.3s ease'
              }}
              title="Voice Input"
            >
              🎤
            </button>
            
            <button 
              style={{
                background: 'none',
                border: 'none',
                padding: '10px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.2rem',
                color: '#0A6B3A',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
              title="Notifications"
            >
              🔔
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: '#ff4444',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                3
              </span>
            </button>
            
            <div style={{
              display: 'flex',
              background: '#f0f0f0',
              borderRadius: '20px',
              padding: '3px'
            }}>
              <button 
                onClick={() => setLanguage('en')}
                style={{
                  background: language === 'en' ? '#0A6B3A' : 'none',
                  color: language === 'en' ? 'white' : '#333',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '17px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
              >
                English
              </button>
              <button 
                onClick={() => setLanguage('hi')}
                style={{
                  background: language === 'hi' ? '#0A6B3A' : 'none',
                  color: language === 'hi' ? 'white' : '#333',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '17px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
              >
                हिंदी
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#0A6B3A',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                border: '2px solid #0A6B3A'
              }}>
                RS
              </div>
              <span style={{ fontWeight: '600', color: '#333' }}>
                {texts.farmerName}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div style={{ padding: '2rem' }}>
        {/* Alert Banner */}
        {showAlert && (
          <div style={{
            backgroundColor: '#ff6b6b',
            color: 'white',
            padding: '15px 20px',
            marginBottom: '2rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <span>⚠️</span>
            <span style={{ flex: 1 }}>{texts.alertMessage}</span>
            <button 
              onClick={closeAlert}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.2rem',
                cursor: 'pointer',
                marginLeft: 'auto'
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Dashboard Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {/* Weather & Alerts Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #eee',
              backgroundColor: '#f8fff9'
            }}>
              <h3 style={{
                color: '#0A6B3A',
                fontSize: '1.2rem',
                fontWeight: '600',
                margin: 0
              }}>
                {texts.weatherTitle}
              </h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '2rem', color: '#0A6B3A' }}>🌡️</span>
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0A6B3A' }}>
                      {weatherData.temperature}°C
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      {texts.temperature}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🌧️</span>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0A6B3A' }}>
                      {weatherData.rainProbability}%
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      {texts.rainProbability}
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{
                  color: '#0A6B3A',
                  marginBottom: '1rem',
                  fontSize: '1rem'
                }}>
                  {texts.forecastTitle}
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem'
                }}>
                  {weatherData.forecast.map((day) => (
                    <div key={day.day} style={{
                      textAlign: 'center',
                      padding: '0.8rem',
                      backgroundColor: '#f8fff9',
                      borderRadius: '8px'
                    }}>
                      <div style={{
                        fontSize: '0.9rem',
                        color: '#666',
                        marginBottom: '0.3rem'
                      }}>
                        {day.day}
                      </div>
                      <div style={{
                        fontWeight: '600',
                        color: '#0A6B3A',
                        fontSize: '1.1rem'
                      }}>
                        {day.temp}°C
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#888',
                        marginTop: '0.2rem'
                      }}>
                        {day.condition}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '1rem',
                backgroundColor: '#fff8e1',
                borderRadius: '8px',
                borderLeft: '4px solid #ffc107'
              }}>
                <span style={{ color: '#ffc107', fontSize: '1.2rem' }}>💡</span>
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: '#0A6B3A',
                    marginBottom: '0.5rem'
                  }}>
                    {texts.advisoryTitle}
                  </div>
                  <p style={{
                    color: '#5d4037',
                    lineHeight: '1.5',
                    margin: 0
                  }}>
                    {texts.advisoryText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Crop Overview Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #eee',
              backgroundColor: '#f8fff9'
            }}>
              <h3 style={{
                color: '#0A6B3A',
                fontSize: '1.2rem',
                fontWeight: '600',
                margin: 0
              }}>
                {texts.cropsTitle}
              </h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {cropData.map((crop) => (
                  <div key={crop.name} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: '#f8fff9'
                  }}>
                    <div>
                      <h4 style={{
                        color: '#0A6B3A',
                        fontSize: '1.1rem',
                        margin: '0 0 0.5rem 0'
                      }}>
                        {language === 'hi' ? crop.name_hi : crop.name}
                      </h4>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        {texts.growthStage}: {language === 'hi' ? crop.stage_hi : crop.stage}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.3rem' }}>
                        {texts.lastAdvisory}: {crop.lastAdvisory}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '0.5rem'
                      }}>
                        <div style={{
                          width: '100px',
                          height: '8px',
                          backgroundColor: '#e0e0e0',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${crop.health}%`,
                            background: 'linear-gradient(90deg, #0A6B3A, #4caf50)',
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                        <span style={{
                          fontWeight: '600',
                          color: '#0A6B3A',
                          minWidth: '40px'
                        }}>
                          {crop.health}%
                        </span>
                      </div>
                      <button style={{
                        padding: '8px 16px',
                        backgroundColor: '#0A6B3A',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}>
                        {texts.viewAdvisory}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Soil & Fertilizer Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #eee',
              backgroundColor: '#f8fff9'
            }}>
              <h3 style={{
                color: '#0A6B3A',
                fontSize: '1.2rem',
                fontWeight: '600',
                margin: 0
              }}>
                {texts.soilTitle}
              </h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  position: 'relative',
                  width: '120px',
                  height: '120px',
                  margin: '0 auto 1rem',
                  background: `conic-gradient(#0A6B3A 0% ${soilData.healthScore}%, #e0e0e0 ${soilData.healthScore}% 100%)`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '90px',
                    height: '90px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#0A6B3A'
                  }}>
                    {soilData.healthScore}
                  </div>
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#0A6B3A'
                }}>
                  {texts.soilHealth}
                </div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem'
              }}>
                <div style={{
                  textAlign: 'center',
                  padding: '0.8rem',
                  backgroundColor: '#f8fff9',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#666',
                    marginBottom: '0.3rem'
                  }}>
                    {texts.phLevel}
                  </div>
                  <div style={{
                    fontWeight: '600',
                    color: '#0A6B3A',
                    fontSize: '1.1rem'
                  }}>
                    {soilData.phLevel}
                  </div>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '0.8rem',
                  backgroundColor: '#f8fff9',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#666',
                    marginBottom: '0.3rem'
                  }}>
                    {texts.npk}
                  </div>
                  <div style={{
                    fontWeight: '600',
                    color: '#0A6B3A',
                    fontSize: '1.1rem'
                  }}>
                    {soilData.npk}
                  </div>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '0.8rem',
                  backgroundColor: '#f8fff9',
                  borderRadius: '8px',
                  gridColumn: 'span 2'
                }}>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#666',
                    marginBottom: '0.3rem'
                  }}>
                    {texts.nextAction}
                  </div>
                  <div style={{
                    fontWeight: '600',
                    color: '#0A6B3A',
                    fontSize: '1.1rem'
                  }}>
                    {soilData.nextAction}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #eee',
              backgroundColor: '#f8fff9'
            }}>
              <h3 style={{
                color: '#0A6B3A',
                fontSize: '1.2rem',
                fontWeight: '600',
                margin: 0
              }}>
                {texts.actionsTitle}
              </h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem'
              }}>
                <button 
                  onClick={() => handleQuickAction('upload')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: '#f8fff9',
                    color: '#0A6B3A',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    fontWeight: '500'
                  }}
                >
                  <span style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📷</span>
                  <span>{texts.uploadPest}</span>
                </button>
                <button 
                  onClick={() => handleQuickAction('ai')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: '#f8fff9',
                    color: '#0A6B3A',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    fontWeight: '500'
                  }}
                >
                  <span style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>💬</span>
                  <span>{texts.askAI}</span>
                </button>
                <button 
                  onClick={() => handleQuickAction('market')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: '#f8fff9',
                    color: '#0A6B3A',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    fontWeight: '500'
                  }}
                >
                  <span style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📈</span>
                  <span>{texts.checkMarket}</span>
                </button>
                <button 
                  onClick={() => handleQuickAction('report')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: '#f8fff9',
                    color: '#0A6B3A',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    fontWeight: '500'
                  }}
                >
                  <span style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📄</span>
                  <span>{texts.generateReport}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Market Snapshot Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            gridColumn: '1 / -1'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #eee',
              backgroundColor: '#f8fff9'
            }}>
              <h3 style={{
                color: '#0A6B3A',
                fontSize: '1.2rem',
                fontWeight: '600',
                margin: 0
              }}>
                {texts.marketTitle}
              </h3>
            </div>
            <div style={{ padding: '1.5rem', overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '600px'
              }}>
                <thead>
                  <tr>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      backgroundColor: '#f8fff9',
                      color: '#0A6B3A',
                      fontWeight: '600',
                      borderBottom: '1px solid #eee'
                    }}>
                      {texts.crop}
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      backgroundColor: '#f8fff9',
                      color: '#0A6B3A',
                      fontWeight: '600',
                      borderBottom: '1px solid #eee'
                    }}>
                      {texts.mandi}
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      backgroundColor: '#f8fff9',
                      color: '#0A6B3A',
                      fontWeight: '600',
                      borderBottom: '1px solid #eee'
                    }}>
                      {texts.price}
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      backgroundColor: '#f8fff9',
                      color: '#0A6B3A',
                      fontWeight: '600',
                      borderBottom: '1px solid #eee'
                    }}>
                      {texts.trend}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.map((item) => (
                    <tr key={item.crop} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem' }}>
                        {language === 'hi' ? item.crop_hi : item.crop}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {language === 'hi' ? item.mandi_hi : item.mandi}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: '600' }}>
                        ₹{item.price}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {renderTrend(item.trend)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Assistant Modal */}
      {showVoiceModal && (
        <div 
          onClick={closeVoiceModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem',
              borderBottom: '1px solid #eee',
              backgroundColor: '#f8fff9'
            }}>
              <h3 style={{
                color: '#0A6B3A',
                margin: 0
              }}>
                {texts.voiceTitle}
              </h3>
              <button 
                onClick={closeVoiceModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{
                fontSize: '3rem',
                color: '#0A6B3A',
                marginBottom: '1rem',
                animation: 'pulse 1.5s infinite'
              }}>
                🎤
              </div>
              <p style={{
                fontSize: '1.1rem',
                color: '#666',
                marginBottom: '2rem'
              }}>
                {texts.listening}
              </p>
              <div style={{
                padding: '1rem',
                backgroundColor: '#f8fff9',
                borderRadius: '8px',
                minHeight: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <p style={{ 
                  color: '#0A6B3A',
                  margin: 0,
                  textAlign: 'center'
                }}>
                  Based on current weather conditions, it's advisable to delay pesticide application for 2 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(10, 107, 58, 0.2);
        }
        
        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          
          nav {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }
          
          .quick-actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default KisanSaathiDashboard;