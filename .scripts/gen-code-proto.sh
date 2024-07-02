#!/bin/bash

set -e

DIRNAME="$(cd "$(dirname "$0")"; pwd)"
OUT_DIR_NODE=$DIRNAME/../mods/sdk/src/generated/node
OUT_DIR_WEB=$DIRNAME/../mods/sdk/src/generated/web

echo "Generating code for protos"

mkdir -p $OUT_DIR_NODE
mkdir -p $OUT_DIR_WEB

# Node.js
protoc -I=. $DIRNAME/../mods/common/src/protos/agents.proto \
  -I=. $DIRNAME/../mods/common/src/protos/domains.proto \
  -I=$DIRNAME/../mods/common/src/protos/ \
  --js_out=import_style=commonjs,binary:$OUT_DIR_NODE \
  --grpc_out=grpc_js:$OUT_DIR_NODE \
  --plugin=protoc-gen-grpc=$(which grpc_tools_node_protoc_plugin)

# Browser
protoc -I=. $DIRNAME/../mods/common/src/protos/agents.proto \
  -I=. $DIRNAME/../mods/common/src/protos/domains.proto \
  -I=$DIRNAME/../mods/common/src/protos/ \
  --js_out=import_style=commonjs:$OUT_DIR_WEB \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:$OUT_DIR_WEB