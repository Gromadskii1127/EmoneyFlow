import React from 'react';
import PropTypes from 'prop-types';
// Components
import EmoneyToggleBtn from './components/EmoneyToggleBtn';

const EmoneyToggleBtnGroup = ({ buttons, onChange }) => {
  const [activeIndex, setActiveIndex] = React.useState(0); // First element is activated as default

  /**
   * Handler when select button
   * @params:
   *  btn: selected button instance
   *  index: index of buttons
   */
  const onSelectBtn = React.useCallback(
    (btn, index) => {
      // call parent handler
      if (onChange) {
        onChange(btn);
      }

      // set clicked button to activated
      setActiveIndex(index);
    },
    [onChange]
  );

  /**
   * Render each render toogle button
   */
  const renderToogleBtn = React.useCallback(
    (btn, index) => {
      return (
        <EmoneyToggleBtn
          key={`emoney-toogle-btn-${index}`}
          onClick={() => onSelectBtn(btn, index)}
          activated={index === activeIndex}>
          {btn.label}
        </EmoneyToggleBtn>
      );
    },
    [activeIndex, onSelectBtn]
  );

  return (
    <div className="d-flex flex-direction-row">
      {buttons.map(renderToogleBtn)}
    </div>
  );
};

EmoneyToggleBtnGroup.propTypes = {
  // toggle buttons option array
  buttons: PropTypes.array.isRequired,
  // onChange Handler
  onChange: PropTypes.func
};

export default EmoneyToggleBtnGroup;
