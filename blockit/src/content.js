/* src/content.js */
/*global chrome*/

import React from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer } from 'react-frame-component';
//import { Container, Form, Button, Alert, Modal } from 'react-bootstrap';
import "./content.css";
import cors from 'cors';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      url: 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=HTDuhLv3GOM&key=AIzaSyDvh_LgkZuQxxAg2tvCN_DHKsrU8STK_jo',
      categoryId: 'hoo'
    };
  }

  requestCategoryId = (response) => {
    console.log(response);
    var result = JSON.parse(response.responseText);
    var categoryId = result.items[0].snippet.categoryId;
    // console.log(categoryId);
    //return categoryId;
    this.setState({ categoryId });
  }
  
  // sendHttpRequest = (url) => {
  //   // TODO: 이 코드를 프로미스를 사용해서 바꾸기
  //   // https://medium.com/@kiwanjung/%EB%B2%88%EC%97%AD-async-await-%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-%EC%A0%84%EC%97%90-promise%EB%A5%BC-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-955dbac2c4a4
  //   console.log('url: ', url);
  //   return new Promise((resolve, reject) => {
  //     var req = new XMLHttpRequest();
  //     console.log('before GET');
  //     req.open('GET', url);
  //     console.log('after GET');
  //     req.onload = () => {
  //       if (req.status === 200) {
  //         console.log(req.response);
  //         resolve(req.response);
  //       }
  //       else {
  //         reject(Error(req.statusText));
  //       }
  //     }
  //     // req.addEventListener("load", requestCategoryId);
  //     // onRequest.open("GET", url);

  //     // Handle network errors
  //     req.onerror = () => {
  //       reject(Error("Network Error"));
  //     }

  //     req.send();
  //   });
  // }

  render() {
    console.log('rendering...');
    return (
      <Frame head={[
        <link
          type="text/css"
          rel="stylesheet"
          href={chrome.runtime.getURL("/static/css/content.css")}
        >
        </link>]
      }>
        <FrameContextConsumer>
          {
          // Callback is invoked with iframe's window and document instances
          ({document, window}) => {
            // Render Children
            return (
              <div className="my-extension">
                <button 
                  onClick={() => {
                    console.log('before click');
                    fetch(this.state.url)
                      // .then((response) => {
                      //   if (!response.ok) {
                      //     throw Error(response.statusText);
                      //     }
                      //     // Read the response as json.
                      //     return response.json();
                      // })
                      .then((responseAsJson) => this.requestCategoryId(responseAsJson))
                      .catch((error) => console.log(error));
                  }}
                >
                  Click!
                </button>
                <h1>{this.state.categoryId}</h1>
              </div>
            )}
          } 
        </FrameContextConsumer> 
      </Frame>
    )
  }
}

const app = document.createElement('div');
app.use(cors());
app.id = "my-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);

app.style.display = "none";
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action") {
      // alert("clicked browser!");
      toggle();
    }
  }
);

function toggle(){
  if(app.style.display === "none"){
    app.style.display = "block";
  } else{
    app.style.display = "none";
  }
}

//TODO: NOW I have to resolve CORS problem Hahah
// https://medium.com/@nabil6391/avoid-cors-requests-for-a-react-app-2988e0061c1a
// see above to solve the problem
// yarn start, yarn build
// load chrome extensions again
// load localhost:3000 and click the icon
