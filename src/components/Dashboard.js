import React, { Component } from 'react';
import Nav from './Nav';
import File from './File'
import { CloudinaryContext, Video } from 'cloudinary-react';
import axios from 'axios';

class Dashboard extends Component {

  state = { videos: [] };

  getVideos() {
    axios.get('http://res.cloudinary.com/unicodeveloper/video/list/zbx1.json')
          .then(res => {
            console.log(res.data.resources);
            this.setState({ videos: res.data.resources.splice(0,12)});
    });
  }

  componentDidMount() {
    this.getVideos();
  }

  render() {

    const { videos }  = this.state;

    return (
      <div>
        
        <Nav />
        
        <File/>
      
        <div className="col-sm-12">
          <CloudinaryContext cloudName="unicodeveloper">
            { videos.map((data, index) => (
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
