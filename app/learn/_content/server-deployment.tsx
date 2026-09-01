import {
  CodeBlock,
  Diagram,
  H2,
  H3,
  Line,
  Note,
  Table,
} from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: {
      bn: "SSH বন্ধ, সাইটও বন্ধ",
      en: "SSH closed, site down",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Self-hosted ডেপ্লয়মেন্ট আর্কিটেকচার",
      en: "The self-hosted deployment architecture",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "PM2 ও Nginx কনফিগারেশন",
      en: "PM2 & Nginx configuration",
    },
  },
  {
    id: "matrix",
    label: { bn: "Deployment Strategy Comparison", en: "Deployment strategy comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ServerDeployment() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        SSH বন্ধ, সাইটও বন্ধ
      </H2>

      <p>
        বিকাল ৩:১৫। ভুলু ভাই একটি উবুন্টু VPS সার্ভারে প্রজেক্ট ডেপ্লয় করলেন। তিনি SSH দিয়ে ঢুকে{" "}
        <code>npm run dev</code> চালিয়ে টার্মিনাল বন্ধ করতেই ওয়েবসাইট ডাউন হয়ে গেল! এরপর{" "}
        <code>nohup npm start &amp;</code> দিয়ে ব্যাকগ্রাউন্ডে চালালেন, কিন্তু রাতে সার্ভার মেমরি
        স্পাইক করে প্রসেস ক্র্যাশ করায় অ্যাপ আর নিজে নিজে রিস্টার্ট হলো না।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! VPS সার্ভারে অ্যাপ ডেপ্লয় করার পর টার্মিনাল ক্লোজ করলেই অ্যাপ বন্ধ হয়ে যায় কেন? আর
        সার্ভারে সরাসরি HTTPS বা ডোমেইন কীভাবে পয়েন্ট করাব?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! প্রোডাকশন সার্ভারে সরাসরি <code>npm run dev</code> চালানো চরম ঝুঁকি! আপনার প্রয়োজন
        একটি process manager (PM2 বা Docker) যা ক্র্যাশ করলে স্বয়ংক্রিয়ভাবে রিস্টার্ট করবে, আর তার
        সামনে বসাতে হবে একটি reverse proxy (Nginx বা Caddy) যা SSL ট্রাফিক ও পোর্ট ফরওয়ার্ডিং হ্যান্ডেল
        করবে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Self-hosted সার্ভারে চালানোর বেস্ট প্র্যাকটিস হলো{" "}
        <code>output: &apos;standalone&apos;</code> দিয়ে বিল্ড করে PM2 বা ডকারের মাধ্যমে{" "}
        <code>server.js</code> রান করা, এবং সামনে Nginx বসিয়ে ৪৪৩ পোর্ট থেকে প্রক্সি করা!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Self-Hosted Server Deployment Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 SELF-HOSTED SERVER DEPLOYMENT ARCHITECTURE                  │
└─────────────────────────────────────────────────────────────────────────────┘

 Public internet / browser  (HTTPS on port 443)
                            │
                            ▼
 ┌───────────────────────────────────────────────────┐
 │ Nginx / Caddy reverse proxy                       │ 🟢 SSL termination (Certbot)
 │ - owns the domain and certificates                │ 🟢 gzip / brotli, static cache
 │ - forwards traffic to a local port                │
 └──────────────────────────┬────────────────────────┘
                            │
                            ▼ internal proxy to 127.0.0.1:3000
 ┌───────────────────────────────────────────────────┐
 │ PM2 process manager / Docker engine               │ 🟢 auto-restart on crash
 │ └─ Next.js standalone server (node server.js)     │ 🟢 recovery after reboot
 └───────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Reverse proxy:</strong> সরাসরি ৩০০০ বা ৮০ পোর্টে Node.js অ্যাপ এক্সপোজ না করে সামনে
        Nginx রাখা আবশ্যক। Nginx SSL সার্টিফিকেট হ্যান্ডেল করে, gzip/brotli কম্প্রেশন দেয়, স্ট্যাটিক
        অ্যাসেট ক্যাশ করে এবং নোড প্রসেসকে সরাসরি ইন্টারনেট থেকে আড়াল করে।
      </p>

      <p>
        <strong>Process lifecycle management:</strong> মেমরি লিক, আনহ্যান্ডেলড এক্সসেপশন বা সার্ভার
        রিবুটের ফলে নোড প্রসেস বন্ধ হয়ে যেতে পারে। PM2 বা Docker container ব্যাকগ্রাউন্ডে প্রসেস মনিটর
        করে এবং সেকেন্ডের মধ্যে অটো-রিস্টার্ট করে।
      </p>

      <p>
        <strong>Standalone execution:</strong> সার্ভারে পুরো <code>node_modules</code> না পাঠিয়ে{" "}
        <code>output: &apos;standalone&apos;</code> দিয়ে তৈরি হালকা আর্টিফ্যাক্ট নিয়ে{" "}
        <code>node server.js</code> চালানো অনেক বেশি দ্রুত ও ইফিশিয়েন্ট।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — a dev command or an unmonitored background process</H3>

      <CodeBlock filename="terminal">{`# 🔴 POOR PRACTICE: raw commands on a production VPS
# no SSL, no auto-restart, dies on reboot, ships all of node_modules

cd /var/www/my-next-app

npm run dev        # ❌ dev server in production; dies the moment SSH disconnects

nohup npm start &  # ❌ if the process OOMs at 3am, the site stays down until morning`}</CodeBlock>

      <H3>🟢 Production pattern — standalone + PM2 + Nginx</H3>

      <p>
        <strong>Step 1 — PM2 ecosystem কনফিগ।</strong>
      </p>

      <CodeBlock filename="ecosystem.config.js">{`// 🟢 PRODUCTION PATTERN: PM2 process management
module.exports = {
  apps: [
    {
      name: 'next-production-app',
      // run the lightweight standalone server directly
      script: './.next/standalone/server.js',
      instances: 'max', // one worker per CPU core
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // 🟢 bind to loopback only — nothing reaches port 3000 from the internet
        HOSTNAME: '127.0.0.1',
      },
      max_memory_restart: '1G', // restart before a leak takes the box down
      autorestart: true,
    },
  ],
};`}</CodeBlock>

      <p>
        <strong>Step 2 — Nginx reverse proxy ও SSL।</strong>
      </p>

      <CodeBlock filename="/etc/nginx/sites-available/mydomain">{`# 🟢 PRODUCTION PATTERN: Nginx in front of the Node process
server {
    listen 80;
    server_name mydomain.com www.mydomain.com;

    # send everything to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name mydomain.com www.mydomain.com;

    # certificates managed by Certbot
    ssl_certificate     /etc/letsencrypt/live/mydomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mydomain.com/privkey.pem;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    location / {
        # forward to the Next.js process managed by PM2
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # WebSocket and server-sent events support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # 🟢 without these the app sees Nginx's IP, not the visitor's —
        # rate limiting and geo detection would both break
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_cache_bypass $http_upgrade;
    }
}`}</CodeBlock>

      <p>
        <strong>Step 3 — ডেপ্লয়মেন্ট কমান্ড।</strong>
      </p>

      <CodeBlock filename="terminal">{`# 1. build in CI, then upload .next/standalone, .next/static and public/

# 2. start under PM2 and persist the process list
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # generates the systemd unit so PM2 survives a reboot

# 3. validate and reload Nginx
sudo nginx -t
sudo systemctl reload nginx`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Deployment Strategy Comparison</H2>

      <Table
        head={["বৈশিষ্ট্য", "Direct npm start", "PM2 + Nginx", "Docker + Nginx/Traefik"]}
        rows={[
          [
            "Auto-restart",
            "নেই 🔴",
            "তাৎক্ষণিক রিস্টার্ট 🟢",
            "কনটেইনার পলিসি অনুযায়ী 🟢",
          ],
          [
            "SSL management",
            "ম্যানুয়াল 🔴",
            "Certbot স্বয়ংক্রিয় 🟢",
            "Traefik/Certbot স্বয়ংক্রিয় 🟢",
          ],
          [
            "রিসোর্স ব্যবহার",
            "বেশি — পুরো node_modules 🔴",
            "কম — standalone mode 🟢",
            "আইসোলেটেড ও রিপ্রোডিউসিবল 🟢",
          ],
          [
            "রিবুট সাপোর্ট",
            "নেই 🔴",
            "pm2 startup দিয়ে সেট হয় 🟢",
            "restart: always দিয়ে সেট হয় 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        একদম ক্রিস্টাল ক্লিয়ার ফাহিম! এখন বুঝেছি কেন সেলফ-হোস্টেড সার্ভারে PM2 দিয়ে প্রসেস হ্যান্ডেল
        করতে হয় আর সামনে Nginx বসিয়ে সুরক্ষার দেয়াল তৈরি করতে হয়!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Bind Node to localhost only:</strong> অ্যাপকে{" "}
            <code>HOSTNAME=127.0.0.1</code>-এ চালান, যাতে পাবলিক ইন্টারনেট থেকে কেউ সরাসরি পোর্ট
            ৩০০০-এ হিট করে Nginx-এর সব গার্ড বাইপাস করতে না পারে।
          </li>
          <li>
            <strong>Forward the real client IP:</strong> Nginx-এ{" "}
            <code>X-Forwarded-For</code> ও <code>X-Forwarded-Proto</code> সেট না করলে rate limiting,
            geo detection ও HTTPS ডিটেকশন — সবই ভুল ফল দেবে।
          </li>
          <li>
            <strong>Use cluster mode on multi-core VPS:</strong> একাধিক CPU core থাকলে PM2-র{" "}
            <code>instances: &apos;max&apos;</code> ব্যবহার করে থ্রুপুট বহুগুণ বাড়িয়ে নিন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
