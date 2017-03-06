// @flow
'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions
} from 'react-native';

import StarRating from 'react-native-star-rating';
import RoundedButton from '../views/RoundedButton';
import Networking from '../networking/Networking';

var baseStyles = require('../styles');
var colors = require('../colors');
var {height, width} = Dimensions.get('window');

export default class TrackReviewScreen extends Component {

  constructor(props) {
    super(props);
    this.networking = new Networking();
    this.state = {
      rating: 0,
      animating: false,
      error: ""
    };
  }

  // Events

  onPressRating(rating) {
    this.setState({
      rating: rating
    });
  }

  onPressSubmit() {
    if (this.state.animating) {
      return;
    }
    this.submitTrackReview();
  }

  // Networking

  async submitTrackReview() {
    try {
      this.setState({animating: true, error: ''});
      let chartId = this.props.chartId;
      let playlistId = this.props.playlistId;
      let trackId = this.props.track._id;
      await this.networking.post(
        `charts/${chartId}/playlists/${playlistId}/review/${trackId}`,
        {rating: this.state.rating}
      );
      this.setState({
        animating: false
      });
      this.props.submitTrackReview(this.props.rowId, this.state.rating);
    } catch(error) {
      this.setState({
        animating: false,
        error: error.toString()
      });
    }
  }

  // Rendering

  render() {
    return (
      <View style={baseStyles.container}>
        <ActivityIndicator
          animating={this.state.animating}
          style={styles.activityIndicator}
          color="white"
        />
        <Text
          numberOfLines={3}
          style={styles.name}>
            {this.props.track.name}
        </Text>
        <Text style={styles.artist}>
          {this.props.track.artist}
        </Text>
        <StarRating
          disabled={false}
          maxStars={10}
          starSize={(width - 20) / 10}
          rating={this.state.rating}
          starColor={'#FFEFB3'}
          emptyStarColor={colors.white}
          selectedStar={(rating) => this.onPressRating(rating)}
        />
        <Text style={styles.rating}>
          {`${this.state.rating} of 10 stars`}
        </Text>
        <Text style={styles.error}>
          {this.state.error}
        </Text>
        <RoundedButton
          title="Submit"
          highlightColor={colors.primaryHighlighted}
          style={[baseStyles.button, styles.button]}
          textStyle={[baseStyles.buttonText, styles.buttonText]}
          onPress={this.onPressSubmit.bind(this)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  error: {
    fontSize: 20,
    color: colors.primary,
    textAlign: 'center',
    width: 300,
    margin: 5
  },
  name: {
    fontSize: 24,
    color: colors.white,
    textAlign: 'center',
    width: 300,
    margin: 10
  },
  artist: {
    fontSize: 20,
    color: colors.subtitle,
    textAlign: 'center',
    marginBottom: 30,
  },
  rating: {
    marginTop: 10,
    fontSize: 20,
    color: '#FFEFB3'
  },
  button: {
    backgroundColor: colors.primary
  },
  buttonText: {
    color: colors.white
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});
