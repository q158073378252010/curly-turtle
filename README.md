# Curly Turtle

[![Build Status](https://travis-ci.org/FiveYellowMice/curly-turtle.svg)](https://travis-ci.org/FiveYellowMice/curly-turtle)
[![npm version](https://img.shields.io/npm/v/curly-turtle.svg)](https://www.npmjs.com/package/curly-turtle)

Web proxy for searching on Google privately.

[中文说明](https://github.com/FiveYellowMice/curly-turtle/wiki/%E4%B8%AD%E6%96%87%E8%AF%B4%E6%98%8E)
 
## The story

In some areas of the earth, we can't have free internet (when we speak of free, we are referring to freedom, not price). Therefore people will need to find ways to access a relatively free internet. First we have HTTP proxy and VPN, but they are vulnerable and easy to censor. Then there is a great software called [Shadowsocks](https://github.com/Long-live-shadowsocks/shadowsocks), it's fast, secure and easy-to-setup. However, users have to install clients in order to use it, which is a bit hard on some platforms, or when you are travelling.

But web proxies don't have that restriction. Once you set it up on your server, you can access them with only a web browser, through HTTP or (better) HTTPS. When you request a web page, the server grab the things from internet it can access, and send back to you. Curly Turtle is a web proxy concentrated on searching on Google.

I'm not saying web proxies can replace tunnel proxies like Shadowsocks, I just say it's more convenient to do one thing. In Curly Turtle's case, it's searching on Google, but only Google, no more.

## Installing

*You only need to install it on a server, no client required.*

First you need to have `nodejs` version 5 or higher and `npm` version 3 or higher, see [Node.js official download page](https://nodejs.org/en/download/stable/) for detials.

Then run the following command **as root**:

	npm install curly-turtle -g

Ignore the warinings that says something replaces something. You can access the program by the command `curly-turtle`. Run `curly-turtle --help` for help.

## Accessing

When you run `curly-turtle` without any arguments, it serves a HTTP connection to all 0.0.0.0 on port 8081. However, because HTTP connection is plain, it's very easy for blacklist maintainers and 50 cents to know you are using Curly Turtle, **don't ever attempt to use Curly Turtle through insecure HTTP connections** even for testing purposes.

In order to use a secure HTTPS connection, you need to have an SSL private key and an SSL certificate. They can be generated by yourself (self-signed), or signed by a CA. See [these instructions](https://www.digitalocean.com/community/tutorials/openssl-essentials-working-with-ssl-certificates-private-keys-and-csrs) if you don't know how to do it.

Once you have got your key and certificate, use the `--sslkey` option to specify the path of your private key and the `--sslcert` option to specify the path of your certificate. For example, if your path of key is `/etc/ssl/domain.key` and path of certificate is `/etc/ssl/domain.crt`, run `curly-turtle --sslkey /etc/ssl/domain.key --sslcert /etc/ssl/domain.crt`.

You can then access it with your web browser, type `https://your-server-ip:8081` in the address bar, for example, `https://123.234.345.456:8081` if your server IP is 123.234.345.456.

If you use a self-signed certificate and your browser warns you that the site is insecure, don't worry, that's because your certificate is self-signed and not trusted by the browser. Just click whatever your browser gives you to proceed anyway (for Firefox is add exception). To skip that problem, [add your certificate to your browser's trust store](https://www.google.com/search?q=add+self-signed+certificate+to+trust+store).

If everything goes right, you will see a friendly web page.

## Disguising

You can specify a path with `--baseurl` option, which if you know that path, you can access Curly Turtle. But if not, an Nginx-look 404 response will be returned, therefore people without the path can not access Curly Turtle on your server.

For example, if you add `--baseurl /google/IQXuB6IbPUg9ca4O` to the command line, you can only access Curly Turtle with address `https://you-server-ip:8081/google/IQXuB6IbPUg9ca4O/`.

## Rate limiting

Google does not allow automatic fetching of their search results, and they will block IPs that send too much requests in a certain amount of time. Therefore your server running Curly Turtle may be blocked by Google if you search on it too frequently (you will get 502 or 503 errors). To deal with it, you can set a time, in miliseconds, that is the minimum interval between two searches. If your two searches' interval is below that limit, you will get "Too many requests" error. And when the time has passed, you can search again.

Use `--ratelimit` to set the limit, for example, `curly-turtle --ratelimit 20000` sets the rate limit to 20000 miliseconds (20 seconds).

## Configuration

You can also use a configuration file to set `address`, `port`, `baseurl`, `sslkey` and `sslcert`. Pass `-c` or `--config` option with the path of the configuration file to use it.

The configuration file must be in [YAML](http://yaml.org/) format. For example, create a cofiguration file in `/etc/curly-turtle/master.yml` with the following content:

	address: 127.0.0.1
	port: 8080
	baseurl: /eqBT7AGJLpIu17s0
	sslkey: /etc/ssl/domain.key
	sslcert: /etc/ssl/domain.crt
	ratelimit: 20000

Then run the command `curly-turtle -c /etc/curly-turtle/master.yml`, it will listen on address 127.0.0.1, port 8080, use `/eqBT7AGJLpIu17s0` as baseurl, load SSL private key in `/etc/ssl/domain.key`, load SSL certificate in `/etc/ssl/domain.crt` and set rate limit to 20000 miliseconds.

If one option is omitted, the default value will be used.

## License

Copyright (C) 2016 FiveYellowMice

Curly Turtle is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

Curly Turtle is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
