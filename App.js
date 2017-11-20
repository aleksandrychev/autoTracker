/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import MapView, { MAP_TYPES } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class App extends Component<{}> {
    constructor(props) {
        super(props);

        this.state = {
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            marker: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
            }
        };

        setInterval(() => {
            this.getPositionFromApiAndMoveMap();
        }, 1000);
    }

    onRegionChange(region) {
        this.setState({ region });
    }


    getRandomFloat(min, max) {
        return (Math.random() * (max - min)) + min;
    }

    randomCoordinate() {
        const region = this.state.region;
        return {
            latitude: region.latitude + ((Math.random() - 0.5) * (region.latitudeDelta / 2)),
            longitude: region.longitude + ((Math.random() - 0.5) * (region.longitudeDelta / 2)),
        };
    }

    randomRegion() {
        return {
            ...this.state.region,
            ...this.randomCoordinate(),
        };
    }

     getPositionFromApiAndMoveMap() {
        return fetch('http://aleksandrychev.name:3000')
            .then((response) => response.json())
            .then((responseJson) => {

                this.map.animateToCoordinate({
                    latitude: responseJson.Lat,
                    longitude: responseJson.Long
                });

                this.setState({ region: {
                    latitude: responseJson.Lat,
                    longitude: responseJson.Long,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                },
                    marker: {
                        latitude: responseJson.Lat,
                        longitude: responseJson.Long
                    } });

            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <View style={styles.container}>
              <MapView
                  provider={this.props.provider}
                  ref={ref => { this.map = ref; }}
                  mapType={MAP_TYPES.TERRAIN}
                  style={styles.map}
                  initialRegion={this.state.region}
                  onRegionChange={region => this.onRegionChange(region)}
              >

                  <MapView.Marker
                      key="mazda3"
                      coordinate={{
                          latitude: this.state.marker.latitude,
                          longitude: this.state.marker.longitude
                      }}
                  />
              </MapView>


              <View style={[styles.bubble, styles.latlng]}>
                <Text style={{ textAlign: 'center' }}>
                    {this.state.region.latitude.toPrecision(7)},
                    {this.state.region.longitude.toPrecision(7)}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => this.getPositionFromApiAndMoveMap()}
                    style={[styles.bubble, styles.button]}
                >
                  <Text style={styles.buttonText}>get position</Text>
                </TouchableOpacity>

              </View>
            </View>
        );
    }
}

App.propTypes = {
    provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bubble: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    latlng: {
        width: 200,
        alignItems: 'stretch',
    },
    button: {
        width: 100,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
    },
    buttonText: {
        textAlign: 'center',
    },
});