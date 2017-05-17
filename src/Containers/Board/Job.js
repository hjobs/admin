import React from 'react';
import { Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Themes from '../../styles/theme';

import { customTimeStamp } from '../../services/var';

import { JobActions } from '../../stores/jobStore';

// const Header = ({content}) => (
//   <div
//     className="full-width"
//     style={{}}
//     children={content}
//   />
// );

// const Body = ({children}) => (
//   <div
//     className="full-width"
//   >
//     {children}
//   </div>
// )

const Container = ({children}) => (
  <div
    style={{
      backgroundColor: Themes.colors.white,
      borderRadius: 6,
      padding: 10,
      fontSize: Themes.fontSizes.s,
      width: 350,
      maxWidth: "100%"
    }}
    children={children}
  />
)

const Section = (props) => (
  <div
    style={{padding: "5px 8px"}}
    {...props}
    className={!props.className ? "full-width" : "full-width " + props.className}
  />
)

const Item = ({title, content}) => (
  <div className="full-width flex-row flex-hCenter flex-vStart">
    <div className="inline-block" style={{
      width: "40%"
    }}>
      <b>{title}</b>:
    </div>
    <div className="inline-block" style={{
      width: "60%"
    }}>
      {content}
    </div>
  </div>
)

const ActionButton = (props) => (
  <button
    style={{
      backgroundColor: "transparent",
      border: "none",
      padding: "0px 2em"
    }}
    {...props}
  />
);

const CustomLink = (props) => (
  <span
    className="link"
    style={{color: Themes.colors[props.color || "linkBlue"] || Themes.colors.linkBlue}}
    {...props}
  />
)

const Job = ({job}) => {
  return (
    <Col xs={12} sm={6} className="flex-col flex-vhCenter" style={{
      backgroundColor: Themes.colors.offWhite,
      padding: 15
    }}>
      <Container>
        <Section children={<h3>{job.title}</h3>} />
        <Section>
          <Item title="Job type" content={job.job_type} />
          <Item title="Updated at" content={customTimeStamp(new Date(job.updated_at), "date")} />
          <Item title="Clicks" content={job.view_count || 0} />
          <Item title="Applicants" content={
            <span>
              {job.applicants_count || 0}<br />
              {job.employees.map((employee, i) => (
                <div key={'job-' + job.id + '-employee-' + employee.id}>
                  <Link
                    to={"/viewEmployee/" + employee.id}
                    children={employee.name}
                  />
                </div>
              ))}
            </span>
          }/>
        </Section>
        <Section className="flex-row flex-vhCenter" style={{padding: "15px 8px 0px 8px"}}>
          <ActionButton>
            <Link to={"/editJob/" + job.id} children="Edit" />
          </ActionButton>
          <ActionButton>
            <CustomLink
              color="red"
              
            />
            <CustomLink color="red"
              onClick={() => JobActions.delete(job.id)}
              children={"Delete"}
            />
          </ActionButton>
        </Section>
      </Container>
    </Col>
  );
}

// <span
//   className="link"
//   onClick={() => { if (!this.state.jobs.loading) JobActions.delete(i); }}
// >
//   X
// </span>

/**
 * updated_at: 
 * 
 * click-throughs: 
 * applicants no.: 
 */

export default Job;
