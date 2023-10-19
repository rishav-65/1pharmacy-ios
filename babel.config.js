module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          "@utils": "./src/utils",
          "@Containers": "./src/components/displayBlocks/Containers",
          "@DynamicViewHandler": "./src/components/displayBlocks/DynamicViewHandler",
          "@HouseOfCards": "./src/components/displayBlocks/HouseOfCards",
          "@screens": "./src/components/screens",
          "@contextProviders": "./src/services/contextProviders",
          "@assets": "./src/assets",
          "@APIConfig": "./src/utils/APIConfig",
          "@APIHandler": "./src/services/APIHandler"
        },
      },
    ],
  ],

};
