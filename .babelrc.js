const plugins = [
  [
    require.resolve('babel-plugin-module-resolver'),
    {
      root: ['./src/'],
      alias: {
        '@Containers': './src/components/displayBlocks/Containers',
        '@DynamicViewHandler':
          './src/components/displayBlocks/DynamicViewHandler',
        '@HouseOfCards': './src/components/displayBlocks/HouseOfCards',
        '@screens': './src/components/screens',
        '@contextProviders': './src/services/contextProviders',
      },
    },
  ],
];
