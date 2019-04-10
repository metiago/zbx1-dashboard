import React, { Component } from 'react';
import Nav from '../components/nav/Nav';
import Dropzone from '../components/dropzone/Dropzone';
import { CloudinaryContext, Video } from 'cloudinary-react';
import axios from 'axios';

class Dashboard extends Component {

  state = { videos: [] };

  getVideos() {
    axios.get('http://res.cloudinary.com/unicodeveloper/video/list/zbx1.json')
      .then(res => {
        console.log(res.data.resources);
        this.setState({ videos: res.data.resources.splice(0, 12) });
      });
  }

  componentDidMount() {
    this.getVideos();
  }

  render() {

    const { videos } = this.state;

    return (
      <div>

        <Nav />

        <Dropzone />

        <main>
          <div className="my-3 p-3 bg-white rounded shadow-sm">
            <h6 className="border-bottom border-gray pb-2 mb-0">My Files</h6>
            <div className="media text-muted pt-3">
              <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff" /><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>
              <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                <div className="d-flex justify-content-between align-items-center w-100">
                  <strong className="text-gray-dark">cart-data.xml</strong>
                  <a href="#">Details</a>
                </div>
                <span className="d-block">@tiago</span>
              </div>
            </div>
            <small className="d-block text-right mt-3">
              <a href="#">Show All</a>
            </small>
          </div>
        </main>

        <div className="col-sm-12">
          <CloudinaryContext cloudName="unicodeveloper">
            {videos.map((data, index) => (
              <div className="col-sm-4" key={index}>
                <div className="embed-responsive embed-responsive-4by3">
                  <Video publicId={data.public_id} width="300" height="300" controls></Video>
                </div>
                <div> Created at {data.created_at} </div>
              </div>
            ))
            }
          </CloudinaryContext>
        </div>
      </div>
    );
  }
}

export default Dashboard;
