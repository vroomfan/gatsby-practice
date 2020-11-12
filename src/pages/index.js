import React, { useEffect } from "react"
import styled from "styled-components"
import Layout from "../layout/layout"

const fullHeight = document.documentElement.clientHeight;
const fullWidth = document.documentElement.clientWidth;
const fullRadius = Math.min(fullWidth, fullHeight);
let containerElement = null;

const Container = styled.div`
  width: 100vh;
  height: 100vh;
  margin: auto;
  position: relative;
`;

export default function Home() {
  useEffect(() => {
    initialize();
  }, []);

  return (
    <Layout>
      <Container id="Container">
        <div
          id="InitialCircle"
          data-x={fullRadius / 2}
          data-y={fullRadius / 2}
          data-radius={fullRadius / 2}
        />
      </Container>
    </Layout>
  );
}

function initialize() {
  containerElement = document.getElementById('Container');
  const initialCircleElement = document.getElementById('InitialCircle');

  const { x: stringX, y: stringY, radius: stringRadius } =  initialCircleElement.dataset;
  const [x, y, radius] = [Number(stringX), Number(stringY), Number(stringRadius)];

  addCircle(x, y, radius);
}

function addCircle(x, y, radius) {
  if (radius < 10) return ;

  const newCircle = document.createElement('div');
  newCircle.setAttribute('style', '' +
    `top: ${y - radius}px;` +
    `left: ${x - radius}px;` +
    `width: ${radius * 2}px;` +
    `height: ${radius * 2}px;` +
    'position: absolute; border-radius: 50%; background-color: lightblue;'
  );
  newCircle.addEventListener('mousemove', () => {
    splitCircle(x, y, radius);
    newCircle.remove();
  });
  containerElement.appendChild(newCircle);
}

function splitCircle(x, y, radius) {
  const reductionRatio = 1 / (1 + 2**(1/2));
  const newRadius = reductionRatio * radius;
  const secondReductionRatio = (2**(1/2) - 1);
  const secondNewRadius = secondReductionRatio * newRadius;

  const distance = newRadius * (2**(1/2));
  addCircle(x - distance, y, newRadius);
  addCircle(x + distance, y, newRadius);
  addCircle(x, y - distance, newRadius);
  addCircle(x, y + distance, newRadius);
  addCircle(x, y, secondNewRadius);
  addCircle(x - (2**(1/2) * newRadius), y - (2**(1/2) * newRadius), secondNewRadius);
  addCircle(x - (2**(1/2) * newRadius), y + (2**(1/2) * newRadius), secondNewRadius);
  addCircle(x + (2**(1/2) * newRadius), y - (2**(1/2) * newRadius), secondNewRadius);
  addCircle(x + (2**(1/2) * newRadius), y + (2**(1/2) * newRadius), secondNewRadius);
}
