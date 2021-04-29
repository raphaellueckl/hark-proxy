import { Application } from "https://deno.land/x/oak@v7.3.0/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const app = new Application();

app.use(oakCors());

app.use(async (ctx) => {
  const urlToFetch = "http" + ctx.request.url.href.split("http")[2];
  const page = await (await fetch(urlToFetch)).text();
  const doc = new DOMParser().parseFromString(page, "text/html");
  const pageHeader = doc
    .querySelector("#mrt-node-Lead-3-QuoteHeader")
    .querySelector('span[data-reactid="32"]').textContent;
  console.log({ price: Number(pageHeader.split(",").join("")) });
  ctx.response.headers.set(
    "Access-Control-Allow-Headers",
    "Accept,Content-Type,X-Requested-With,x-api-key"
  );
  ctx.response.body = { price: Number(pageHeader.split(",").join("")) };
});

await app.listen({
  port: 443,
  secure: true,
  certFile: "/etc/letsencrypt/live/ripped.link/fullchain.pem",
  keyFile: "/etc/letsencrypt/live/ripped.link/privkey.pem",
});
