import React from 'react'
import { RouteProps } from './types/Route'
import Route from './Route'
import { Config, State } from './types/Navigator'
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  PanResponder
} from 'react-native'

const buildSceneConfig = (children: Array<Route> = []) => {
  const config: Config = {}
  children.forEach(child => {
    config[child.props.name] = {
      component: child.props.component,
      key: child.props.name
    }
  })

  return config
}

const { width } = Dimensions.get('window')

export default class Navigator extends React.Component<{}, State> {
  // Aminated
  private animatedValue = new Animated.Value(0)

  private panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      const isFirstScreen = this.state.stack.length === 1
      const isFarLeft = evt.nativeEvent.pageX < Math.floor(width * 0.25)

      if (!isFirstScreen && isFarLeft) {
        return true
      }
      return false
    },
    onPanResponderMove: (evt, gestureState) => {
      this.animatedValue.setValue(gestureState.moveX)
    },
    onPanResponderRelease: (evt, gestrueState) => {
      if (Math.floor(gestrueState.moveX) > width / 2) {
        this.handlePop()
      } else {
        Animated.timing(this.animatedValue, {
          duration: 250,
          toValue: 0,
          useNativeDriver: true
        }).start()
      }
    },
    onPanResponderTerminate: (evt, gestrueState) => {
      Animated.timing(this.animatedValue, {
        duration: 250,
        toValue: 0,
        useNativeDriver: true
      }).start()
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true
  })
  constructor(props: any) {
    super(props)

    const sceneConfig = buildSceneConfig(props.children)
    const initialSceneName = (props.children as Array<
      React.ReactElement<RouteProps>
    >)[0].props.name
    this.state = {
      sceneConfig,
      stack: [sceneConfig[initialSceneName]]
    }
  }

  public handlePush = (sceneName: string) => {
    this.setState(
      prevState => ({
        stack: [...prevState.stack, prevState.sceneConfig[sceneName]]
      }),
      () => {
        this.animatedValue.setValue(width)
        Animated.timing(this.animatedValue, {
          duration: 250,
          easing: Easing.linear,
          toValue: 0,
          useNativeDriver: true
        }).start()
      }
    )
  }

  public handlePop = () => {
    Animated.timing(this.animatedValue, {
      duration: 250,
      easing: Easing.linear,
      toValue: width,
      useNativeDriver: true
    }).start(() => {
      this.animatedValue.setValue(0)
      this.setState(prevState => {
        const { stack } = prevState
        if (stack.length > 1) {
          return {
            stack: stack.slice(0, stack.length - 1)
          }
        }
        return { ...prevState }
      })
    })
  }

  public render() {
    return (
      <View style={styles.container} {...this.panResponder.panHandlers}>
        {this.state.stack.map((scene, index) => {
          const CurrentScene = scene.component
          const sceneStyles: Array<any> = [styles.scene]

          if (index === this.state.stack.length - 1 && index > 0) {
            sceneStyles.push({
              transform: [
                {
                  translateX: this.animatedValue
                }
              ]
            })
          }

          return (
            <Animated.View key={scene.key} style={sceneStyles}>
              <CurrentScene
                navigator={{ push: this.handlePush, pop: this.handlePop }}
              />
            </Animated.View>
          )
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  scene: {
    ...StyleSheet.absoluteFillObject,
    flex: 1
  }
})
