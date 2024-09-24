import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css'; 
import DisplayIcon from '../assets/Display.svg';

const Header = () => {
  const [showSelect, setShowSelect] = useState(false);
  const [grouping, setGrouping] = useState('');
  const navigate = useNavigate();

  const toggleSelect = () => {
    setShowSelect(!showSelect);
  };

  const handleChange = (value) => {
    setGrouping(value);
    setShowSelect(false);

    // Navigate to the appropriate route based on the selected option
    if (value === 'status') {
      navigate('/status');
    } else if (value === 'user') {
      navigate('/user');
    } else if (value === 'priority') {
      navigate('/priority');
    }
  };

  return (
    <div className="header-container">
      <div className="header-content">
        <button className="display-button" onClick={toggleSelect}>
          <img src={DisplayIcon} alt="Display" className="grid-icon" />
          Display

          {showSelect && (
            <div className="dropdown-options">
              <div onClick={() => handleChange('status')} className="dropdown-option">
                Status
              </div>
              <div onClick={() => handleChange('user')} className="dropdown-option">
                User
              </div>
              <div onClick={() => handleChange('priority')} className="dropdown-option">
                Priority
              </div>
            </div>
          )}
        </button>
      </div>

      {grouping && <div className="selected-grouping">Selected: {grouping}</div>}

      <div className="header-line"></div>
    </div>
  );
};

export default Header;