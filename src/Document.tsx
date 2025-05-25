import { Html, Head, Body, Main } from "rwsdk";
import { siteConfig } from "@/lib/site-config";
import { PROD_FQDN } from "@/lib/constants";

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="theme-color" content={META_THEME_COLORS.light} />
        <meta name="description" content={siteConfig.description} />
        <meta name="keywords" content="Monitoring, Uptime, Latency, Status code, OpsGenie" />
        <meta name="creator" content="Jonathan Beckmann" />
        <meta name="author" content="Jonathan Beckmann" />
        
        {/* OpenGraph */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content={`https://${PROD_FQDN}`} />
        <meta property="og:title" content={siteConfig.name} />
        <meta property="og:description" content={siteConfig.description} />
        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:image" content={`https://${PROD_FQDN}/og_image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={siteConfig.name} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteConfig.name} />
        <meta name="twitter:description" content={siteConfig.description} />
        <meta name="twitter:image" content={`${PROD_FQDN}/og_image.png`} />
        <meta name="twitter:creator" content="@SolBeckman_" />
        
        {/* Icons */}
        <link rel="icon" href="/favicon.ico?v=2" />
        <link rel="shortcut icon" href="/icon-192.png?v=2" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
      </Head>
      <Body>
        <Main />
      </Body>
    </Html>
  );
}