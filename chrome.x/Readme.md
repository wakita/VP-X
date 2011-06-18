manifest.json がありませんが，このディレクトリで omake を実行するか，以下を十個すると生成できます．ただし，d8 が必要ですけれど．．．

d8 vpx.js -- --manifest > manifest.json

vpx.js のなかの content_scripts の matches で，特定の URL 以外では，この拡張機能が動作しないように制限しています．この設定のままでは私の環境でしか動作しません．みなさんの環境に合わせて変更して下さい．変更を終えてから manifest.json を生成して下さい．

Chrome を起動するためのスクリプトは上の bin ディレクトリに保存してあります．Chrome の experimental な機能を有効にするための設定を含んでいます．

-----
