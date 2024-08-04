# CORS Resolver

CORS Resolver is a Cloudflare Workers-based application designed to solve Cross-Origin Resource Sharing (CORS) issues during local development. It acts as a proxy, forwarding requests to external APIs while adding the necessary CORS headers to the response.

## How It Works

The CORS Resolver takes any request, forwards it to the specified external API, and returns the response with appropriate CORS headers.

For example, a request to `https://cors-resolver-cloudflare.com/https://external-api/user` will fetch data from `https://external-api/user` and return the response with CORS headers.

## Setup and Deployment

### Prerequisites

- A [Cloudflare](https://www.cloudflare.com/) account.
- Cloudflare Workers enabled on your account.
- Cloudflare Wrangler CLI installed.

### Steps

1. Run `npx wrangler deploy`
2. Follow its instructions. You may need to login to your Cloudflare account
3. Visit your Cloudflare Workers dashboard and copy the URL of your Worker (In this example, it's `https://cors-resolver-cloudflare.com`)

## Usage

Once the Worker is deployed, you can use it to bypass CORS issues during local development.

For example, if your Worker is deployed at `https://cors-resolver-cloudflare.com`, you can make requests like:

```plaintext
https://cors-resolver-cloudflare.com/https://external-api/user
```
