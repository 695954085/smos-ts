import React from 'react'
interface Config {
  [key: string]: ConfigItem;
}

interface State {
  sceneConfig: Config;
  stack: ConfigItem[]
}

interface ConfigItem {
  key: string;
  component: React.FunctionComponent<Props>;
}