// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

// docker will override this environment.
// define at coordinator project.
window.env = {
  // COORDINATOR_SERVICE_PORT not using now.
  COORDINATOR_SERVICE_PORT: 8000,
  COORDINATOR_SERVICE_URL:
    'http://ec2-13-238-217-178.ap-southeast-2.compute.amazonaws.com:8000/graphql',
};
