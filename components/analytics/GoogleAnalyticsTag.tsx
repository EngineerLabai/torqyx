import { CONSENT_COOKIE, CONSENT_PREFS_KEY, CONSENT_STORAGE_KEY } from "@/utils/consent";

type GoogleAnalyticsTagProps = {
  measurementId: string;
};

const buildGoogleTagInitScript = (measurementId: string) => `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};

(function() {
  function readCookie(name) {
    var parts = document.cookie ? document.cookie.split(";") : [];
    for (var index = 0; index < parts.length; index += 1) {
      var part = parts[index].trim();
      if (part.indexOf(name + "=") === 0) {
        return decodeURIComponent(part.slice(name.length + 1));
      }
    }
    return null;
  }

  function readStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function readConsentPrefs() {
    var status = readStorage(${JSON.stringify(CONSENT_STORAGE_KEY)}) || readCookie(${JSON.stringify(CONSENT_COOKIE)});
    if (status === "accept") {
      return { analytics: true, advertising: true };
    }
    if (status !== "custom") {
      return { analytics: false, advertising: false };
    }

    try {
      var storedPrefs = JSON.parse(readStorage(${JSON.stringify(CONSENT_PREFS_KEY)}) || "{}");
      return {
        analytics: Boolean(storedPrefs.analytics),
        advertising: Boolean(storedPrefs.advertising)
      };
    } catch (error) {
      return { analytics: false, advertising: false };
    }
  }

  var prefs = readConsentPrefs();
  window.gtag("consent", "default", {
    analytics_storage: prefs.analytics ? "granted" : "denied",
    ad_storage: prefs.advertising ? "granted" : "denied",
    ad_user_data: prefs.advertising ? "granted" : "denied",
    ad_personalization: prefs.advertising ? "granted" : "denied"
  });
})();

window.gtag("js", new Date());
window.gtag("config", ${JSON.stringify(measurementId)});
`;

export default function GoogleAnalyticsTag({ measurementId }: GoogleAnalyticsTagProps) {
  const normalizedMeasurementId = measurementId.trim();

  if (!normalizedMeasurementId) return null;

  return (
    <>
      <script
        id="google-tag-loader"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(normalizedMeasurementId)}`}
      />
      <script
        id="google-tag-init"
        dangerouslySetInnerHTML={{ __html: buildGoogleTagInitScript(normalizedMeasurementId) }}
      />
    </>
  );
}
