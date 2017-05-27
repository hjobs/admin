import React from 'react';
import Reflux from 'reflux';
import { withRouter } from 'react-router-dom';
import './styles/job.css';

import TrafficLight from './TrafficLight';

import JobStore from '../../stores/jobStore';

import { getSalaryDescription } from '../../services/var';

class Job extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = JobStore;
  }

  render() {
    const job = this.state.viewJob.data;
    if (!job) return null;
    const org = job.orgs[0];
    const imgSrc = !!job.photo ? job.photo : org.logo;
    const Tag = (props) => (
      <div className={"flex-row flex-vhCenter tag"}>
        <div className={props.type}>{props.string}</div>
      </div>
    );
    const tags = [];
    if (job.event) {
      tags.push(
        <Tag
          string={job.event}
          type="event"
          key={job.id + "-event-" + job.event}
        />
      );
    }
    if (job.langs && job.langs.length > 0) {
      job.langs.forEach(lang => {
        const strArr = lang.name.split("");
        strArr[0] = strArr[0].toUpperCase();
        let str = strArr.join("");
        tags.push(
          <Tag
            string={str}
            type="lang"
            key={job.id + "-langs-" + lang.name}
          />
        );
      });
    }
    if (!!job.date_tags && job.date_tags.length > 0) {
      job.date_tags.forEach(dateTagStr => {
        tags.push(
          <Tag
            key={job.id + "-datetag-" + dateTagStr}
            string={dateTagStr}
            type="date"
          />
        );
      });
    }

    return (
      <div className="job-container flex-row">
        <div
          className="job-thumbnail"
          style={{backgroundImage: "url('" + imgSrc + "')"}}
        />
        <div className="detail-container">
          <div className="flex-row flex-hStart flex-vCenter">
            <div className="job-title full-width">
              <TrafficLight show={job.job_type === 'quick'} job={job} />
              <span className="link">{job.title}</span>
            </div>
          </div>
          {!!tags && tags.length > 0 ?
            <div className="flex-row flex-hStart flex-vCenter">
              {tags}
            </div> : <div className="full-width" style={{height: '5px'}} />
          }
          <p>
            <span><i className="fa fa-usd" aria-hidden="true"></i> {getSalaryDescription(job)}</span><br />
            {job.locations && job.locations.length > 0 ?
              <span>
                <i className="fa fa-map-marker" aria-hidden="true"></i> {job.locations.map(l => l.address).join(", ")}<br />
              </span>
              : null
            }
            <i className="fa fa-building" aria-hidden="true"></i>{org.name}
          </p>
        </div>
      </div>
    );
  }
}

export default Job;
