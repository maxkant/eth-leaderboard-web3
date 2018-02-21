# eth-leaderboard-web3

[DESCRIPTION]

## Getting Started
1. Clone the repository and cd into it.

2. Install dependencies:
    ```
    npm install
    ```
3. If you don't have testrpc installed, run:
    ```
    npm install -g testrpc
    ```
4. Run testrpc in deterministic mode (to have the same accounts each time):
    ```
    testrpc -d
    ```
5. In another tab, run the deployment script to have the accounts make some random transactions:
    ```
    node src/deploy.js
    ```
6. Start the development server (http://localhost:3000):
    ```
    yarn start
    ```
