import React from "react"
import { Helmet } from "react-helmet"
import styled from "styled-components"
import Layout from "../layout/layout"

const Test = styled.div`
  color: red;
`

export default function Jyp01930() {
  return (
    <Layout>
      <Test>
        <Helmet>
          <meta charSet="utf-8" />
          <meta property="og:title" content="생일생일" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://snufestival.com/mascot.jpg" />
          <meta property="og:description" content="해피버스데이" />
          <title>제목</title>
        </Helmet>
      </Test>
    </Layout>
  );
}
