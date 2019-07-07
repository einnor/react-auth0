import React, { Component } from "react";

class Profile extends Component {
    state = {
        profile: null,
        error: ""
    };

    componentDidMount() {
        this.loadUserProfile();
    }

    loadUserProfile() {
        this.props.auth.getProfile((profile, error) =>
          this.setState({ profile, error })
        );
    }

    render() {
        return <h1>Profile</h1>;
    }
}

export default Profile;