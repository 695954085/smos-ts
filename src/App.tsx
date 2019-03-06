import React from 'react'
import { StyleSheet, View, Button } from 'react-native'
import Route from './Route'
import Navigator from './Navigator'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center'
  },
  screen: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  }
})
const Screen1 = ({ navigator }: Props) => (
  <View style={[styles.screen, { backgroundColor: '#59c9a5' }]}>
    <Button title="Screen 2" onPress={() => navigator.push('Screen2')} />
    <Button title="Pop" onPress={() => navigator.pop()} />
  </View>
)

const Screen2 = ({ navigator }: Props) => (
  <View style={[styles.screen, { backgroundColor: '#23395b' }]}>
    <Button title="Screen 3" onPress={() => navigator.push('Screen3')} />
    <Button title="Pop" onPress={() => navigator.pop()} />
  </View>
)
const Screen3 = ({ navigator }: Props) => (
  <View style={[styles.screen, { backgroundColor: '#b9e3c6' }]}>
    <Button title="Pop" onPress={() => navigator.pop()} />
  </View>
)
export default class App extends React.Component {
  public render() {
    return (
      <Navigator>
        <Route name="Screen1" component={Screen1} />
        <Route name="Screen2" component={Screen2} />
        <Route name="Screen3" component={Screen3} />
      </Navigator>
    )
  }
}
