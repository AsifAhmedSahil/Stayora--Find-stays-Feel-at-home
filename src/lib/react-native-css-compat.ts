/* eslint-disable @typescript-eslint/no-require-imports */
// @ts-expect-error The types only list named exports; at runtime the default import is the CommonJS exports object.
import wrapperForImports from "react-native-css/components";

// NativeWind's Metro resolver sends every `import ... from "react-native"` through
// `react-native-css/components`, which re-exports a fixed list of React Native names.
// 3.1.0-rc.0 predates React Native 0.88's `AssetRegistry`, so expo-asset got `undefined`
// and fonts and local images failed to load. Add the missing export to the wrapper.
//
// The package ships the wrapper twice (`import` → dist/module, `require` → dist/commonjs),
// so patch both copies. A default import of this CommonJS file is its real exports object.
// `react-native/index` skips the redirect (it only matches the bare "react-native").
// Remove once react-native-css re-exports AssetRegistry itself.
const wrappers: object[] = [wrapperForImports, require("react-native-css/components")];

for (const wrapper of wrappers) {
  if (!Object.prototype.hasOwnProperty.call(wrapper, "AssetRegistry")) {
    Object.defineProperty(wrapper, "AssetRegistry", {
      enumerable: true,
      get: () => require("react-native/index").AssetRegistry,
    });
  }
}
