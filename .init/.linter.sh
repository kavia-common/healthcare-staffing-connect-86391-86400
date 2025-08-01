#!/bin/bash
cd /home/kavia/workspace/code-generation/healthcare-staffing-connect-86391-86400/staffing_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

