import React from 'react';
import TimeAgo from 'react-timeago';
import { Button } from 'react-bootstrap';

class Job extends React.Component {
  render() {
    return (
      <div className="job-container flex-row">
        <div className="thumbnail-container flex-col flex-vCenter">
          <img src={this.props.imgSrc} className="thumbnail" alt={this.props.name} />
        </div>
        <div className="detail-container">
          <h4>{this.props.title}</h4>
          <p>
            {this.props.name} <br />
            <TimeAgo date={this.props.date} />
          </p>
          <Button bsSize="small" className="apply-button" onClick={()=>{this.props.applyJob(this.props.jobNo)}}>Apply!</Button>
        </div>
      </div>
    )
  }
}

Job.propTypes = {
  jobNo: React.PropTypes.number.isRequired,
  imgSrc: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  date: React.PropTypes.object,
  applyJob: React.PropTypes.func.isRequired
};

export default Job;
