#!/bin/sh
APP_NAME="bc-annotation"

rm -rf dist node_modules
#语言版本请自定义，现在支持node8、node10、node12 node14 若有新的版本需要，请联系@吴艳丽
node_version="node12"
#npm install
npm install --registry=http://ued.zuoyebang.cc/npm/

npm run build

rm -rf output

mkdir -p output/webroot/$APP_NAME

# 拷贝代码文件
cp -r dist/* output/webroot/$APP_NAME

cd output

# 打包
tar -zcf $APP_NAME.tar.gz webroot/

rm -rf webroot
