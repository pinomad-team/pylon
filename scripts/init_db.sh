#!/bin/bash
mkdir -p ./.secrets/
echo '{"cockroach":{"username":"root","password":""}}' | jq . > ./.secrets/cockroach.yaml