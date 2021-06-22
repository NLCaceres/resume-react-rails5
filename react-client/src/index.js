import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import SimpleNavBar from "./SimpleNavbar/SimpleNavbar";
import PostListView from "./PostListView/PostListView.js";
import throttle from "lodash.throttle";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import ConsoleLogger from "./Utility/LoggerFuncs";

class App extends Component {
  constructor(props) {
    super(props);
    this.openTab = this.openTab.bind(this);
    this.state = {
      width: window.innerWidth
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener(
      "resize",
      throttle(this.updateWindowDimensions(), 500)
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "resize",
      throttle(this.updateWindowDimensions(), 500)
    );
  }

  updateWindowDimensions() {
    return throttle(() => {
      this.setState({ width: window.innerWidth });
    });
  }

  openTab(tab) {
    ConsoleLogger(`Open tab called`);
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    //* Prevent double redirects BUT on initial viewing redirect to /portfolio
    return (
      <BrowserRouter>
        <FullPage openTab={this.openTab} viewWidth={this.state.width}/>
        {/* //? React-Router works in 3 parts, Router > Switch > Route/Redirect. You ALWAYS need those 3 parts, nested like so  */}
        <Switch>
          {/* //? If you place any regular components in a switch, it'll override any Routes/Redirects that come after it */}
          {/* //? Redirects NEED to be placed in Switches just like Routes */}
          <Redirect exact from="/" to="/portfolio/about-me" />
          {/* //* Any redirects at basename='portfolio' level need to be handled there, any at root here */}
        </Switch>
      </BrowserRouter>
    );
  }
}

const FullPage = props => {
  return (
    <BrowserRouter basename="/portfolio">
      <SimpleNavBar openTab={props.openTab} viewWidth={props.viewWidth} />
        <Switch>
          <Route exact path="/iOS"
            render={routeProps => (
              <PostListView tabId="iOS"
                viewWidth={props.viewWidth}
                location={routeProps.location} />
            )} 
          />
          <Route exact path="/android"
            render={routeProps => (
              <PostListView tabId="Android"
                viewWidth={props.viewWidth}
                location={routeProps.location} />
            )} 
          />
          <Route exact path="/front-end"
            render={routeProps => (
              <PostListView tabId="Front-End"
                viewWidth={props.viewWidth}
                location={routeProps.location} />
            )} 
          />
          <Route exact path="/back-end"
            render={routeProps => (
              <PostListView tabId="Back-End"
                viewWidth={props.viewWidth}
                location={routeProps.location} />
            )} 
          />
          <Route exact path="/about-me"
            render={routeProps => (
              <PostListView tabId="About Me!"
                viewWidth={props.viewWidth}
                location={routeProps.location} />
            )} 
          />
          <Redirect exact from="/" to="/about-me" /> {/*//* Without this route before the next redirect, always end up at 404 */}

          <Route exact path="/not-found" component={ NoMatchFoundPage } />
          <Redirect to="/not-found"/> {/* //? Redirects, if placed last, can be fallbacks just like Routes! */}
        </Switch>
    </BrowserRouter>
  );
}

const NoMatchFoundPage = () => {
  const randomImgSet = [
    "https://imgur.com/uclpvfT.png",
    "https://imgur.com/lNcHO0e.png",
    "https://imgur.com/Of0gAOd.png",
    "https://imgur.com/2EEuwzP.png",
    "https://imgur.com/wkdXneC.png",
    "https://imgur.com/DnGZrfn.png",
    "https://imgur.com/UYxIDEk.png",
    "https://imgur.com/KXnbSAi.png",
    "https://imgur.com/Ow4Vn9x.png"
  ];
  const rand = Math.floor(Math.random() * 9);
  const imgSrc = randomImgSet[rand];
  //* Padding-left: 10px for h1, h4
  //* Padding-left: 20px for img
  return (
    <div>
      <h1 style={{ marginLeft: "10px" }}>Sorry! Not Much to See Here!</h1>
      <img src={imgSrc} alt="A Cute Pup!" className="not-found-img" />
      <h4 style={{ marginLeft: "10px", marginTop: "10px" }}>So Here's a Puppy to Make Up for It!</h4>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
