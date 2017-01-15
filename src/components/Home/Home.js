import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

class About extends React.Component {
  render() {
    return (
      <div className="container-fluid home flex-col">
        <div className="about-banner-container flex-col flex-vhCenter text-center full-width">
          <div className="about-banner flex-col flex-vhCenter">
            <h2>Build Your Career</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel lobortis neque, ac laoreet lectus. Pellentesque pellentesque bibendum consectetur.</p>
          </div>
        </div>
        <div className="about-choice-container flex-col flex-vhCenter text-center full-width">
          <div className="about-choice flex-col flex-vhCenter">
            <Grid>
              <Row className="show-grid">
                <Col xs={24} sm={12} md={12} lg={12} className="flex-row flex-vhCenter">
                  <div className="div-circle div-circle-big flex-row flex-vhCenter">
                    <h3>Looking for a Quick Job?</h3>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} className="flex-row flex-vhCenter">
                  <div className="div-circle div-circle-big flex-row flex-vhCenter">
                    <h3>Looking for a Longer Term Job?</h3>
                  </div>
                </Col>
              </Row>
              <Row className="show-grid">
                <Col xs={24} sm={12} md={12} lg={12} className="flex-row flex-vhCenter">
                  <div className="div-circle div-circle-small flex-row flex-vhCenter">
                    First big Circle Here
                  </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} className="flex-row flex-vhCenter">
                  <div className="div-circle div-circle-small flex-row flex-vhCenter">
                    Second big Circle Here
                  </div>
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
        <div className="about-intro-container flex-col flex-vhCenter text-center full-width">
          <div className="about-intro flex-col flex-vhCenter">
            <h2>Our Service</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel lobortis neque, ac laoreet lectus. Pellentesque pellentesque bibendum consectetur.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel lobortis neque, ac laoreet lectus. Pellentesque pellentesque bibendum consectetur.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel lobortis neque, ac laoreet lectus. Pellentesque pellentesque bibendum consectetur.</p>
          </div>
        </div>
        <div className="about-feature-container flex-col flex-vhCenter text-center full-width">
          <div className="about-feature flex-col flex-vhCenter">
            <Grid className="full-width">
              <Row className="show-grid">
                <Col xs={24} sm={12} md={8} lg={8} className="flex-col flex-vhCenter column">
                  <i className="fa fa-users" aria-hidden="true"></i>
                  <h4> Title </h4>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel lobortis neque, ac laoreet lectus.</p>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} className="flex-col flex-vhCenter column">
                  <i className="fa fa-users" aria-hidden="true"></i>
                  <h4> Title </h4>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel lobortis neque, ac laoreet lectus.</p>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} className="flex-col flex-vhCenter column">
                  <i className="fa fa-users" aria-hidden="true"></i>
                  <h4> Title </h4>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel lobortis neque, ac laoreet lectus.</p>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} className="flex-col flex-vhCenter column">
                  <i className="fa fa-users" aria-hidden="true"></i>
                  <h4> Title </h4>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel lobortis neque, ac laoreet lectus.</p>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} className="flex-col flex-vhCenter column">
                  <i className="fa fa-users" aria-hidden="true"></i>
                  <h4> Title </h4>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel lobortis neque, ac laoreet lectus.</p>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} className="flex-col flex-vhCenter column">
                  <i className="fa fa-users" aria-hidden="true"></i>
                  <h4> Title </h4>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel lobortis neque, ac laoreet lectus.</p>
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
        <div className="about-team-container flex-col flex-vhCenter text-center full-width">
          <div className="about-team flex-col flex-vhCenter">
            <h2>Our Team</h2>
            <Grid className="full-width">
              <Row className="show-grid">
                <Col xs={24} sm={12} md={12} lg={12} className="flex-col flex-vhCenter">
                  <img src="./dist/images/jo.jpg" alt="Jonathan" className="img-circle" />
                  <h4>Jo Sutton</h4>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel lobortis neque, ac laoreet lectus. Pellentesque pellentesque bibendum consectetur.</p>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} className="flex-col flex-vhCenter">
                  <img src="./dist/images/jo.jpg" alt="Jonathan" className="img-circle" />
                  <h4>Jo Sutton</h4>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel lobortis neque, ac laoreet lectus. Pellentesque pellentesque bibendum consectetur.</p>
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
        <div className="contact-container flex-col flex-vhCenter text-center full-width">
          <div className="contact flex-col flex-vhCenter">
            <h2>Contact Us</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel lobortis neque, ac laoreet lectus. Pellentesque pellentesque bibendum consectetur.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
