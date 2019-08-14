import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Header, ListItem } from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown';
import Colors from '../../../constants/Colors';
import BaseIcon from '../UserScreen/BaseIcon';

export interface IItem {
  type: string;
  name: string;
  amount: string;
}

export interface IProps {
  listItems: IItem[];
}

export default class PlantInfo extends React.Component<IProps, object> {
  private idx: number;

  public getColor(name: string): string {
    switch (name) {
      case 'ios-rose':
        return Colors.red;
      case 'tree':
        return Colors.forestGreen;
      case 'flower':
        return Colors.pink;
      case 'leaf':
        return Colors.green;
      default:
        return Colors.green;
    }
  }

  public renderRow(rowData: IItem) {
    const color = this.getColor(rowData.name);
    return (
      <ListItem
        rightTitle={rowData.amount}
        containerStyle={styles.rowItem}
        leftIcon={
          <BaseIcon
            containerStyle={{ 
              backgroundColor: color,
              marginLeft: 0,
            }}
            icon={{
              type: rowData.type,
              name: rowData.name,
            }}
          />
        }
      />
    );
  }

  public renderDropDown() {
    return(
      <ModalDropdown ref="dropdown"
        style={styles.dropdown}
        defaultValue="Your Plant"
        dropdownStyle={styles.dropdown_dropdown}
        textStyle={styles.dropdown_TextStyle}
        options={this.props.listItems}
        onSelect={this.onSelect.bind(this)}
        renderRow={this.renderRow.bind(this)}
      />
    );
  }

  public onSelect(idx: number, _value: IItem) {
    this.idx = idx;
    if (this.idx !== 0) {
      return false;
    }
  }

  public render() {
    return (
      <Header
        centerComponent={this.renderDropDown()}
        containerStyle={{
          backgroundColor: '#fff',
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  rowItem: {
    height: 50,
  },
  dropdown: {
    justifyContent: 'center',
    alignContent: 'center',
    width: 180,
    borderWidth: 0,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dropdown_dropdown: {
    width: 180,
    height: 'auto',
    borderColor: 'cornflowerblue',
    borderWidth: 2,
    borderRadius: 3,
  },
  dropdown_TextStyle: {
    backgroundColor: '#fff',
    color: Colors.forestGreen,
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
