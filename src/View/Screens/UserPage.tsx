import * as React from 'react';
import { Button, Modal, ScrollView, StyleSheet, Text, View, TouchableHighlight, Dimensions } from 'react-native';

import ChartModal from '../../components/ChartModal';
import AppHeader from '../../components/AppHeader';
import ProfileBackend from '../../Business/ProfileBackend';

export interface IProps {
  navigation: any;
}

export default class UserPage extends React.Component<IProps, object> {

  public componentDidMount = () => {
    ProfileBackend.retrieveDataSet(30)
      .then((value) => { 
        console.log(JSON.stringify);
        
      }).catch();
  }

  public render() {
    
    return (
     <View style={styles.container}>
       <AppHeader title="User"/>
       
       <ScrollView>
          <ChartModal
            modalTitle="Health Data"
            transparent={true}
          />

          <ChartModal
            modalTitle="Sleep Data"
            transparent={true}
          /> 
          
          <ChartModal
            modalTitle="Mood Data"
            transparent={true}
          />
        </ScrollView>

     </View>
   );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 5,
    flex: 1,
    justifyContent: 'center',
  },
});
