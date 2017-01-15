import React from 'react';
import 'whatwg-fetch';

import Job from './Job';
import ApplyModal from './ApplyModal';



const data = [
  {
    imgSrc: 'http://placehold.it/150x150',
    title: 'Job Title Here',
    name: 'HotelName Here',
    date: new Date(1479095519606)
  },
  {
    imgSrc: 'http://placehold.it/150x150',
    title: 'Job Title Here',
    name: 'HotelName Here \n HotelName Here a;sdlkfjas;ldkfjas;dlkfjas;dlfkajsd;lfkasjdf',
    date: new Date(1479095519606)
  },
  {
    imgSrc: 'http://placehold.it/150x150',
    title: 'Job Title Here',
    name: 'HotelName Here',
    date: new Date(1479095519606)
  },
  {
    imgSrc: 'http://placehold.it/150x150',
    title: 'Job Title Here',
    name: 'HotelName Here',
    date: new Date(1479095519606)
  },
  {
    imgSrc: 'http://placehold.it/150x150',
    title: 'Job Title Here',
    name: 'HotelName Here',
    date: new Date(1479095519606)
  },
  {
    imgSrc: 'http://placehold.it/150x150',
    title: 'Job Title Here',
    name: 'HotelName Here',
    date: new Date(1479095519606)
  }
];

class Jobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShown: false,
      data: null
    };
  }

  componentDidMount() {
    fetch('http://localhost:3003/jobs', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      console.log(res);
      return res.json();
    }).then(d => {
      console.log(d);
      this.setState({data: d}, () => { console.log('this.state.data'); console.log(this.state.data); });
    });
  }

  openModal(jobNo) {
    console.log('openModal, jobNo parameter is: ' + jobNo);
    this.setState({
      modalShown: true
    });
  }

  closeModal() {
    console.log("closeModal");
    this.setState({
      modalShown: false
    });
  }

  render() {
    let dataArr = data.map((datum, i) => {
      return (
        <div className="col-xs-24 col-sm-12" key={i}>
          <Job
            imgSrc={datum.imgSrc} title={datum.title}
            name={datum.name} date={datum.date}
            applyJob={ (jobNo) => { this.openModal(jobNo); } } jobNo={i} />
        </div>
      );
    });

    return (
      <div className="container-fluid jobs">
        <p className="text-center">search for you job</p>
        <div className="row job-row clearfix">
          {dataArr}
        </div>
        <ApplyModal shown={this.state.modalShown} closeModal={ () => {this.closeModal()} } />
      </div>
    );
  }
}

export default Jobs;

// <Job imgSrc={data[i].imgSrc} title={data[i].title} name={data[i].name} date={data[i].date} applyJob={this.applyJob.bind((data[i]))} key={i} />
//

        // <div className="col-sm-12 col-md-6" >
        //   <Job imgSrc={data[i + 1].imgSrc} title={data[i + 1].title} name={data[i + 1].name} date={data[i + 1].date} applyJob={this.applyJob.bind((data[i + 1]))} key={i + 1} />
        // </div>
