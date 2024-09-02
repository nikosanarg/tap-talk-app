import React from 'react'
import { Image } from 'react-native'

const TapTalkImage = require('../../assets/images/TapTalkLogo.png')

interface TapTalkLogoProps {
  width: number
  height: number
}

const TapTalkLogo = ({width, height}: TapTalkLogoProps) => {
  return (
    <Image source={TapTalkImage} style={{ width, height }}/>
  )
}

export default TapTalkLogo