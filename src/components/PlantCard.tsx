import * as React from 'react';
import { StyleSheet, View, Image, ImageSourcePropType } from 'react-native';

export interface Values {
  imgSource: string,
  cost: number;
}

export interface Data {
  type: string,
  values: Values;
}

export interface IProps {
  data: Data;
}

export default class PlantCard extends React.Component<IProps, {}> {
  constructor(args: any) {
    super(args);
    this.getImageType = this.getImageType.bind(this);
  }

  getImageType(type: string) {
    let source: ImageSourcePropType;
    switch (type) {
      case "HEADER":
          source = require('../../assets/images/Plant_Header.png')
          break;
      case "BODY":
          source = require('../../assets/images/Plant_Body.png')
          break;
      case "BODY_LONG":
          source = require('../../assets/images/Plant_Body_Long.png')
          break;
      case "FOOTER":
          source = require('../../assets/images/Plant_Footer.png')
          break;
      default:
          source = {};
          break;
    }
    return source;
  }

  public render() {
    let source:ImageSourcePropType = this.getImageType(this.props.data.type);
    return(
      <View  style={styles.outerContainer}>
          <View style={styles.container}>
              <Image style={styles.image} source={source}/>
          </View>
          <View style={styles.line}></View>
      </View>);
  }
}
const styles = StyleSheet.create({
  outerContainer:{
    flex:1,
  },
  container: {
    backgroundColor: "white",
    alignItems:"center",
  },
  image: {
    borderRadius: 7
  },
  line: {
    height: 1,
    backgroundColor: "#d3d3d3"
  }
});
