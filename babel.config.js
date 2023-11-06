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
          "@auth": "./src/services/auth",
          "@contextProviders": "./src/services/contextProviders",
          "@assets": "./src/assets",
          "@ToastProfiles": "./src/utils/ToastProfiles",
          "@APIConfig": "./src/utils/APIConfig",
          "@APIHandler": "./src/services/APIHandler",
          "@APIRepository": "./src/utils/APIRepository"
        },
      },
    ],
  ],

};
