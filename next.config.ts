const nextConfig = {
  typescript: {
    // 型チェックを無効化
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLintチェックを無効化
    ignoreDuringBuilds: true,
  },
  webpack(config: any) {
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test && rule.test.test(/\.svg$/)
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/;
    }

    // @svgr/webpack を使用してSVGをReactコンポーネントとして処理するルールを追加
    // これにより、SVGがReactコンポーネントとしてデフォルトエクスポートされます
    config.module.rules.push({
      test: /\.svg$/,
      use: [{
        loader: '@svgr/webpack',
        options: {
          svgo: true, // SVG最適化を有効にする (推奨)
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false, // viewBoxを削除しない (SVGのサイズ調整に役立つ)
                  },
                },
              },
            ],
          },
        },
      }],
    });
    return config;
  },
};

module.exports = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
            },
          },
        ],
        as: '*.js',
      },
    },
  },
}