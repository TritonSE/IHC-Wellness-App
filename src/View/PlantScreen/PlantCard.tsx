import * as React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

export interface IValues {
  imgSource: string;
  cost: number;
}

export interface IData {
  type: string;
  values: IValues;
}

export interface IProps {
  data: IData;
}

export default class PlantCard extends React.Component<IProps, object> {
  constructor(props: IProps) {
    super(props);
    this.getImageType = this.getImageType.bind(this);
  }

  public getImageType(type: string) {
    let source: ImageSourcePropType;
    switch (type) {
      case 'HEADER':
        source = require('../../../assets/images/Plant_Header.png');
        break;
      case 'BODY':
        source = require('../../../assets/images/Plant_Body.png');
        break;
      case 'BODY_LONG':
        source = require('../../../assets/images/Plant_Body_Long.png');
        break;
      case 'FOOTER':
        source = require('../../../assets/images/Plant_Footer.png');
        break;
      default:
        source = {};
        break;
    }
    return source;
  }

  public render() {
    const source: ImageSourcePropType = this.getImageType(this.props.data.type);
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
  container: {
    alignItems:'center',
    backgroundColor: 'white',
  },
  image: {
    borderRadius: 7,
  },
  line: {
    backgroundColor: '#d3d3d3',
    height: 1,
  },
  outerContainer:{
    flex:1,
  },
});
