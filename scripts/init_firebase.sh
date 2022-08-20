#!/bin/bash
mkdir -p ./.secrets/
gcloud secrets versions access latest --secret=firebase-admin | jq . > .secrets/firebase.yaml