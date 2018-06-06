import React, { Component } from 'react';
import { XR } from 'aws-amplify';

export class SumerianScene extends Component {
  componentDidMount() {
    XR.loadScene(this.props.sceneId);
  }

  render() {
    return (
      <div>
        <div id="loading-screen" className="hidden">
          <div className="background-thumbnail" style={{backgroundImage: 'url(https://us-east-1.sumerian.aws/42f29c3e42414f0f81614d75d2eeea01.scene/res/226f67a45297f8ee701f917ae3af4e972ea0ff2e.jpg)'}}></div>
          
          <div className="content">
            <div id="progress-bar">
              <div className="icon-aws"></div>
              <div id="progress"></div>
            </div>
            <h1>TestScene</h1>
            
            <div className="confirm-autoplay" id="confirmAutoplay" style={{display: 'none'}}>
              <button type="button" className="btn" id="enableAutoplay">Start</button>
            </div>
          </div>
        </div>
        <div id="canvas-screen" className="hidden">
          <div id="canvas-outer">
            <div id="canvas-inner"></div>
            <div id="in-vr" className="hide">
              <div className="message1">Presenting in VR</div>
              <div className="message2">(Put on Your Headset)</div>
            </div>
            <div id="vr-icons">
              <div id="enter-vr">
                <div className="tooltip">Enter VR</div>
              </div>
              <div id="exit-vr" className="hide-vr-icon">
                <div className="tooltip-vr-exit">Exit VR</div>
              </div>
            </div>
          </div>
          <div id="bottom-bar">
            <div className="scene-name">Scene Name Placeholder</div>
            <div id="action-buttons">
              <button
                id="maximize-button"
                className="btn icon-maximize"
              ></button><button
                id="mute-button"
                className="btn icon-sound"
              ></button>
            </div>
          </div>
        </div>
        <div id="warning-screen" className="hidden">
          <div className="background-thumbnail" style={{backgroundImage: 'url(https://us-east-1.sumerian.aws/42f29c3e42414f0f81614d75d2eeea01.scene/res/226f67a45297f8ee701f917ae3af4e972ea0ff2e.jpg)'}}></div>
          
          <div className="content">
            <div className="logo icon-aws"></div>
            <h1 id="unsupported-warning" className="hidden">Your browser is not supported by Amazon Sumerian and cannot load the scene</h1>
            <h1 id="not-fully-supported-warning" className="hidden">Your browser is not fully compatible with Amazon Sumerian. You can continue to view the scene, but some features may not work as intended.</h1>
            <p>For more information, <a href="https://aws.amazon.com/sumerian/faqs/">view our supported browser and device list.</a></p>
            <button id="warning-acknowledgement" className="hidden">I understand</button>
          </div>
        </div>
      </div>
    )
  }
}

export class AframeScene extends Component {
  componentDidMount() {
    XR.loadScene(this.props.sceneId);
  }

  render() {
    let scene;
    switch(this.props.sceneId) {
      case "1":
        scene = (
          <a-scene>
            <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
            <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
            <a-sky color="#4286f4"></a-sky>
          </a-scene>
        );
        break;
      case "2":
        scene = (
          <a-scene>
            <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
            <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
            <a-sky color="#31353a"></a-sky>
          </a-scene>
        );
        break;
      default:
        scene = (
          <a-scene>
            <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
            <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
            <a-sky color="#ECECEC"></a-sky>
          </a-scene>
        );
        break;
    }
    return scene;
  }
}