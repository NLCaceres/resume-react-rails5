//* Component: Lists posts, alternating left to right (May refactor for right start as an option)
import React, { Component } from "react";
import { Row, Col, Card, CardText, CardBody, CardTitle, Button } from "reactstrap";
import SimpleCarousel from "../SimpleCarousel/SimpleCarousel";
import CardImageModal from "../CardImageModal/CardImageModal";
import cnames from "classnames";
import postlist from "./PostList.module.css";
import ConsoleLogger from "../Utility/LoggerFuncs";
//* 'Import' loads statically, so if grabbing json data from files in a particular dir, have to grab each file one by one
// import iOSProjects from "../TabPanelData/iOS.json";

class PostListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      modal: false,
      modalProject: null,
      projectList: {
        majorProjects: [],
        minorProjects: [],
      }, //? Without initing all used state, will get errs
    };

    this.openModal = this.openModal.bind(this);
    this.fetchProjects = this.fetchProjects.bind(this);
    this.fetchProjectSet = this.fetchProjectSet.bind(this);
  }

  async componentDidMount() {
    this.fetchProjects();
  }

  async componentDidUpdate(prevProps) {
    // !!! CHECK IF IT IS CONSTANTLY FIRING!
    if (this.props.location !== prevProps.location) {
      ConsoleLogger("Component Update fired");
      this.fetchProjects();
    }
  }

  async fetchProjects() {
    let queryParams = this.props.tabId;
    ConsoleLogger(`Tab ID: ${this.props.tabId}`);
    if (queryParams === "About Me!") {
      const httpResponse = await fetch("/api/posts?project_type=null");
      const jsonResponse = await httpResponse.json();
      const projectList = { ...this.state.projectList };
      projectList.majorProjects.unshift(jsonResponse);
      this.setState({ projectList: projectList });
      return;
    }
    if (queryParams !== "iOS") {
      queryParams = queryParams.toLowerCase();
    }
    if (queryParams === "front-end" || queryParams === "back-end") {
      queryParams = queryParams.replace("-", "_");
    }
    this.fetchProjectSet(`?project_type=${queryParams}`);
  }

  async fetchProjectSet(filterStr) {
    const httpResponse = await fetch(`/api/posts${filterStr}`);
    const jsonResponse = await httpResponse.json();

    const projectList = { ...this.state.projectList }; //? Spread the object, set its values and set the object!
    projectList.majorProjects = jsonResponse.filter(
      (project) => project["project_size"] === "major_project"
    );
    projectList.minorProjects = jsonResponse.filter(
      (project) => project["project_size"] === "small_project"
    );
    this.setState({ projectList: projectList }); //? Sets projectList to array BUT requires array to already exist in state object!
  }

  openModal(project) {
    if (project === null) {
      this.setState((prevState) => ({
        modal: !prevState.modal,
      }));
    } else {
      if (this.props.viewWidth < 768) {
        return; //* Prevent modal from appearing
      }
      this.setState((prevState) => ({
        modal: !prevState.modal,
        modalProject: project,
      }));
    }
  }

  render() {
    return (
      (this.state.projectList.majorProjects.length > 0 ||
        this.state.projectList.minorProjects.length > 0) && (
        <div>
          {this.props.viewWidth >= 768 && (
            <CardImageModal
              modalControl={this.openModal}
              isModalOpen={this.state.modal}
              project={this.state.modalProject}
              viewWidth={this.props.viewWidth}
            />
          )}
          <h1>{this.props.tabId}</h1>
          <ProjectList
            tabId={this.props.tabId}
            projectList={this.state.projectList}
            viewWidth={this.props.viewWidth}
            modalControl={this.openModal}
          />
        </div>
      )
    );
  }
}

const ProjectList = (props) => {
  //? For future reference, can use nanoid, shortid, uuid from npm for keys on lists or id on forms
  //? Otherwise using other props is helpful as a key
  return Object.values(props.projectList).map((projects, i) => {
    const projectSize = i === 0 ? "Major Projects" : "Small Projects";
    const aboutMeTitle =
      props.tabId === "About Me!" ? "Nicholas L. Caceres" : null;
    const projectSectionKey = props.tabId + " " + projectSize;
    return (
      projects.length > 0 && (
        <div key={projectSectionKey}>
          <h1>{aboutMeTitle || projectSize}</h1>
          <ProjectSection
            projects={projects}
            viewWidth={props.viewWidth}
            modalControl={props.modalControl}
          />
        </div>
      )
    );
  });
};

const ProjectSection = (props) => {
  const projects = props.projects;
  if (Array.isArray(projects)) {
    return projects.map((project, i) => {
      if (i % 2 === 0 || props.viewWidth < 768) {
        return (
          <LeftSidedCardPost
            project={project}
            modalControl={props.modalControl}
            viewWidth={props.viewWidth}
            key={project.title}
          />
        );
      } else {
        return (
          <RightSidedCardPost
            project={project}
            modalControl={props.modalControl}
            viewWidth={props.viewWidth}
            key={project.title}
          />
        );
      }
    });
  } else {
    return (
      <LeftSidedCardPost
        project={projects}
        viewWidth={props.viewWidth}
        key={projects.name}
      />
    );
  }
};

const LeftSidedCardPost = (props) => {
  const project = props.project;
  const imageSrc =
    project.post_images.length > 0
      ? project.post_images["0"].image_url
      : "No img";
  const imageAlt =
    project.post_images.length > 0
      ? project.post_images["0"].alt_text
      : "Placeholder";
  const backupImg = imageSrc === "https://via.placeholder.com/350.png?text=Project";

  return (
    <>
      <Card>
        <Row noGutters>
          <Col xs="12" md="2" className="d-flex justify-content-center">
            {props.viewWidth >= 768 || project.post_images.length <= 1 ? (
              <img
                className={cnames(
                  "align-self-center",
                  {
                    [postlist.cardImg]: !backupImg,
                    [postlist.cardImgBackupStyle]: backupImg,
                  },
                  {
                    [postlist.clickable]:
                      props.viewWidth >= 992 && !backupImg,
                  }
                )}
                src={imageSrc || project.post_images}
                alt={imageAlt}
                onClick={() => {
                  if (!backupImg) {
                    props.modalControl(project);
                  }
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/350.png?text=Project";
                  e.target.style.height = "100%";
                }}
              />
            ) : (
                <SimpleCarousel
                  images={project.post_images}
                  viewWidth={props.viewWidth}
                />
              )}
          </Col>
          <Col xs="12" md="10">
            <CardBody>
              <CardTitle className="font-weight-bold">
                {project.title}
              </CardTitle>
              <CardText className={cnames(postlist.cardText)}>
                {project.description}
              </CardText>
              <Button
                className={cnames(
                  postlist.githubLink,
                  postlist.blockButton,
                  "font-weight-bold",
                  { "d-block": props.viewWidth >= 992 }
                )}
                href={project.github_url}
              >
                Github Page
              </Button>
              {project.homepage_url != null && (
                <Button
                  className={cnames(
                    postlist.blockButton,
                    "font-weight-bold btn-danger",
                    { "ml-4": props.viewWidth < 992 },
                    { "d-block mt-4": props.viewWidth >= 992 }
                  )}
                  href={project.homepage_url}
                >
                  Home Page
                </Button>
              )}
            </CardBody>
          </Col>
        </Row>
      </Card>
    </>
  );
};

const RightSidedCardPost = (props) => {
  const project = props.project;
  const imageSrc =
    project.post_images.length > 0
      ? project.post_images["0"].image_url
      : "No img";
  const imageAlt =
    project.post_images.length > 0
      ? project.post_images["0"].alt_text
      : "Placeholder";
  const backupImg = imageSrc === "https://via.placeholder.com/350.png?text=Project";
  return (
    <>
      <Card>
        <Row noGutters>
          <Col xs="12" md="10">
            <CardBody>
              <CardTitle className="font-weight-bold">
                {project.title}
              </CardTitle>
              <CardText className="">{project.description}</CardText>
              <Button
                className={cnames(
                  postlist.githubLink,
                  postlist.blockButton,
                  "font-weight-bold",
                  { "d-block": props.viewWidth >= 992 }
                )}
                href={project.github_url}
              >
                Github Page
              </Button>
              {project.homepage_url != null && (
                <Button
                  className={cnames(
                    postlist.blockButton,
                    "font-weight-bold btn-danger",
                    { "ml-4": props.viewWidth < 992 },
                    { "d-block mt-4": props.viewWidth >= 992 }
                  )}
                  href={project.homepage_url}
                >
                  Home Page
                </Button>
              )}
            </CardBody>
          </Col>
          <Col xs="12" md="2" className="d-flex justify-content-center">
            <img
              className={cnames("align-self-center", postlist.cardImg, {
                [postlist.clickable]: props.viewWidth >= 768 && !backupImg,
              })}
              src={imageSrc}
              alt={imageAlt}
              onClick={() => {
                if (!backupImg) { //* If not a backup Img, then allow modal
                  props.modalControl(project);
                }
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/350.png?text=Project";
                e.target.style.height = "100%";
              }}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default PostListView;
