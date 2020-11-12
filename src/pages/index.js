import React, { useEffect } from "react"
import styled from "styled-components"
import Layout from "../layout/layout"

export default function Home() {
  useEffect(() => {
    initialize();
  }, []);

  console.log(document.documentElement.clientWidth);
  console.log(document.documentElement.offsetWidth);
  console.log(window.outerWidth);

  return (
    <Layout>
      <Container id="Container">
        <InitialCircle id="InitialCircle" />
      </Container>
    </Layout>
  );
}

let containerElement = null;
let circleIndex = 0;

function initialize() {
  containerElement = document.getElementById('Container');
  const initialCircleElement = document.getElementById('InitialCircle');


}

function addCircle() {

}

const Container = styled.div`
  width: 100vh;
  height: 100vh;
  margin: auto;
  position: relative;
`;

const InitialCircle = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: lightblue;
`;
