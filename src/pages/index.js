import React, { useEffect, useState } from "react"
import styled from "styled-components"
import Layout from "../layout/layout"

const Container = styled.div`
  width: 100vh;
  height: 100vh;
  margin: auto;
  position: relative;
`;

export default function Home() {
  const [fullRadius, setFullRadius] = useState(0);

  useEffect(() => {
    const fullHeight = document.documentElement.clientHeight;
    const fullWidth = document.documentElement.clientWidth;
    setFullRadius(Math.min(fullWidth, fullHeight))
  }, []);

  useEffect(() => {
    if (fullRadius > 0) initialize();
  }, [fullRadius]);

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
  const containerElement = document.getElementById('Container');
  const initialCircleElement = document.getElementById('InitialCircle');

  const { x: stringX, y: stringY, radius: stringRadius } =  initialCircleElement.dataset;
  const [x, y, radius] = [Number(stringX), Number(stringY), Number(stringRadius)];

  addCircle(x, y, radius, containerElement);
}

function addCircle(x, y, radius, containerElement) {
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
    splitCircle(x, y, radius, containerElement);
    newCircle.remove();
  });
  containerElement.appendChild(newCircle);
}

function splitCircle(x, y, radius, containerElement) {
  const reductionRatio = 1 / (1 + 2**(1/2));
  const newRadius = reductionRatio * radius;
  const secondReductionRatio = (2**(1/2) - 1);
  const secondNewRadius = secondReductionRatio * newRadius;

  const distance = newRadius * (2**(1/2));
  addCircle(x - distance, y, newRadius, containerElement);
  addCircle(x + distance, y, newRadius, containerElement);
  addCircle(x, y - distance, newRadius, containerElement);
  addCircle(x, y + distance, newRadius, containerElement);
  addCircle(x, y, secondNewRadius, containerElement);
  addCircle(x - (2**(1/2) * newRadius), y - (2**(1/2) * newRadius), secondNewRadius, containerElement);
  addCircle(x - (2**(1/2) * newRadius), y + (2**(1/2) * newRadius), secondNewRadius, containerElement);
  addCircle(x + (2**(1/2) * newRadius), y - (2**(1/2) * newRadius), secondNewRadius, containerElement);
  addCircle(x + (2**(1/2) * newRadius), y + (2**(1/2) * newRadius), secondNewRadius, containerElement);
}
