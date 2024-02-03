<b>Upon first install:</b><br>
Use <code>npm ci --omit=dev</code> to install dependencies.

<b>Options:</b>
Type these after <code>node wallet.js</code> to utilize the script's features.
<ul>
  <li><code>new</code> to create a wallet and export it to <code>wallet.json</code></li>
  <li><code>airdrop [X]</code> to airdrop <code>[X]</code> amount (defaults to <code>1</code>)</li>
  <li><code>balance</code> to check the balance of an existing wallet (saved to <code>wallet.json</code>)</li>
  <li><code>transfer [otherPublicKey] [Amount]</code> to transfer <code>[Amount]</code> from the existing wallet to <code>[otherPublicKey]</code></li>
</ul>
