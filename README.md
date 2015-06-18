# Handle Github webhooks and LIFX lamps

This [Node.js](nodejs) server handles incoming Github webhooks and
flashes a selection of [Lifx](lifx) lamps depending on the event.

## Start

Run the server with `node server.js` in the root of the repo.

## Configuration

You need to create a `secrets.json` file in the root of the repo and update it
with the correct values.

  - `defaultBranch`: The main branch of the your at Github.
  - `lifx.token`: A token you can generate at your Lifx [account settings](tokens).
  - `lifx.selector`: A selector targeting a set of lamps. See [API docs](selectors).

## Lamps

  - Pull request opened: Soft flash blue.
  - Failed build default branch: Bright repeating red flash
  - Failed build other branch: Soft red flash
  - Successful build default branch: Bright green flash
  - Successful build other branch: Soft green flash

  [nodejs]:    https://nodejs.org/
  [lifx]:      http://www.lifx.com/
  [tokens]:    https://cloud.lifx.com/settings
  [selectors]: http://developer.lifx.com/#selectors
