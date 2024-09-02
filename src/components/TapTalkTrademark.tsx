import React from 'react';
import styled from 'styled-components/native';

const TrademarkText = styled.Text<{ fontSize: string }>`
  font-family: 'Lobster-Regular';
  color: black;
  font-size: ${({ fontSize }) => fontSize};
`;

interface TapTalkTrademarkProps {
  fontSize?: string;
}

const TapTalkTrademark: React.FC<TapTalkTrademarkProps> = ({ fontSize }) => {
  return <TrademarkText fontSize={fontSize ?? '24px'}>Tap-Talk</TrademarkText>;
};

export default TapTalkTrademark;
