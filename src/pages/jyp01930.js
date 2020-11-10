import React from "react"
import { Helmet } from "react-helmet"
import styled from "styled-components"

const Test = styled.div`
  color: red;
`

export default function Jyp01930() {
  return (
    <Test>
      <Helmet>
        <meta charSet="utf-8" />
        <meta property="og:title" content="생일생일" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://snufestival.com/mascot.jpg" />
        <meta property="og:description" content="해피버스데이" />
        <title>창민아 생일 축하한돠~~</title>
      </Helmet>
      생일축하~~
    </Test>
  );
}
